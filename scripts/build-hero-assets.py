#!/usr/bin/env python3
"""
Build the hero assets from the raw intro video.

  public/hero/intro-light.{mp4,webm}   light theme: seamless loop, person-centred, background whitened
  public/hero/intro-dark.{mp4,webm}    dark theme (--variant dark): same loop, background crushed to black
  public/images/portrait-bust.webp     480x600 head-to-shirt crop (from --photo, or the sharpest frame)
  public/images/og.jpg                 1200x630 social card

Source files are read from assets/source/ by default: video/intro-{light,dark}.mp4 and images/portrait.jpg.

Requirements: ffmpeg/ffprobe on PATH, Python 3.9+, numpy, Pillow.

Usage:
  python3 scripts/build-hero-assets.py                    # light clip + stills
  python3 scripts/build-hero-assets.py --variant dark     # dark clip
  Options: [--video PATH] [--photo PATH] [--crop W:H:X:Y] [--seconds 10] [--fade 0.5]

The light clip is shown with mix-blend-mode:multiply (white disappears into the paper),
the dark clip with mix-blend-mode:screen (black disappears into the dark page).
"""
import argparse
import json
import subprocess
import sys
import tempfile
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
SOURCE = ROOT / "assets" / "source"
OUT_W, OUT_H = 768, 960
LEVELS = {
    # off-white backdrop -> pure white (multiplies away on the light page)
    "light": "colorlevels=rimax=0.98:gimax=0.98:bimax=0.98",
    # near-black backdrop (~#0a0a0a) -> pure black (screens away on the dark page)
    "dark": "colorlevels=rimin=0.08:gimin=0.08:bimin=0.08",
}
PAPER = (244, 242, 238)
INK = (13, 13, 13)
MUTE = (119, 117, 111)
SR = 48000


def run(cmd, **kw):
    print("  $", " ".join(str(c) for c in cmd)[:220])
    return subprocess.run(cmd, check=True, **kw)


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)],
        check=True, capture_output=True, text=True,
    ).stdout
    data = json.loads(out)
    v = next(s for s in data["streams"] if s["codec_type"] == "video")
    a = next((s for s in data["streams"] if s["codec_type"] == "audio"), None)
    num, den = map(int, v["r_frame_rate"].split("/"))
    return {
        "w": int(v["width"]), "h": int(v["height"]), "fps": num / den, "fps_str": v["r_frame_rate"],
        "vdur": float(v.get("duration") or data["format"]["duration"]),
        "adur": float(a["duration"]) if a and a.get("duration") else None,
    }


def grab_gray(path, t, w, h, scale=4):
    """Return a downscaled grayscale frame at time t as a uint8 array."""
    sw, sh = w // scale, h // scale
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-ss", f"{t:.3f}", "-i", str(path), "-frames:v", "1",
         "-vf", f"scale={sw}:{sh}", "-f", "rawvideo", "-pix_fmt", "gray", "-"],
        check=True, capture_output=True,
    ).stdout
    return np.frombuffer(raw, np.uint8).reshape(sh, sw), scale


def detect_crop(path, info, seconds):
    """Union bounding box of non-background pixels over several frames -> 4:5 crop, centred."""
    boxes, centres = [], []
    for t in np.linspace(0.2, seconds - 0.2, 8):
        g, s = grab_gray(path, t, info["w"], info["h"])
        # per-row backdrop level from the frame edges handles floor gradients on light or dark sets
        bg = np.median(np.concatenate([g[:, :8], g[:, -8:]], axis=1), axis=1, keepdims=True)
        mask = np.abs(g.astype(np.int16) - bg) > 28
        ys, xs = np.nonzero(mask)
        if len(xs) < 50:
            continue
        top, bot = np.percentile(ys, 0.2), np.percentile(ys, 99.9)
        boxes.append((np.percentile(xs, 0.5) * s, top * s, np.percentile(xs, 99.5) * s, bot * s))
        # horizontal centre from head + torso only, so floor shadows don't skew it
        upper = xs[ys < top + (bot - top) * 0.6]
        centres.append(np.median(upper) * s)
    if not boxes:
        sys.exit("Could not detect the person - pass --crop W:H:X:Y")
    b = np.array(boxes)
    x0, y0, x1, y1 = b[:, 0].min(), b[:, 1].min(), b[:, 2].max(), b[:, 3].max()
    print(f"  person bbox x={x0:.0f}-{x1:.0f}  y={y0:.0f}-{y1:.0f}  centre x={np.median(centres):.0f}")
    ch = min(info["h"], int((y1 - y0) * 1.06 + 40)) // 2 * 2
    ch = max(ch, 400)
    cw = int(ch * OUT_W / OUT_H) // 2 * 2
    if cw > info["w"]:
        cw = info["w"] // 2 * 2
        ch = int(cw * OUT_H / OUT_W) // 2 * 2
    cx = float(np.median(centres))
    cy = (y0 + y1) / 2
    x = int(np.clip(cx - cw / 2, 0, info["w"] - cw))
    y = int(np.clip(cy - ch / 2, 0, info["h"] - ch))
    return cw, ch, x, y


def read_wav(path):
    with wave.open(str(path), "rb") as w:
        ch = w.getnchannels()
        data = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    return data.reshape(-1, ch)


def write_wav(path, pcm):
    pcm = np.clip(pcm, -1, 1)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(pcm.shape[1])
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((pcm * 32767).astype(np.int16).tobytes())


def loop_audio(src_wav, dst_wav, dur, fade):
    """Sample-accurate equal-power cross-fade: tail [D-F, D) blends into head [0, F)."""
    pcm = read_wav(src_wav)
    n_d, n_f = int(round(dur * SR)), int(round(fade * SR))
    if len(pcm) < n_d:
        pcm = np.pad(pcm, ((0, n_d - len(pcm)), (0, 0)))
    pcm = pcm[:n_d]
    head, body = pcm[:n_f], pcm[n_f:].copy()
    t = np.linspace(0, 1, n_f, endpoint=False)[:, None]
    body[-n_f:] = body[-n_f:] * np.cos(t * np.pi / 2) + head * np.sin(t * np.pi / 2)
    write_wav(dst_wav, body)
    print(f"  audio loop: {len(body)} samples = {len(body) / SR:.4f}s")


def build_video(args, info, crop, tmp):
    cw, ch, cx, cy = crop
    fps = info["fps"]
    avail = min(args.seconds, info["vdur"], info["adur"] or info["vdur"])
    frames = int(np.floor(avail * fps + 1e-6))
    ff = int(round(args.fade * fps))
    dur, fade = frames / fps, ff / fps
    loop_len = dur - fade
    print(f"  source {dur:.4f}s, fade {fade:.4f}s -> loop {loop_len:.4f}s")

    has_audio = info["adur"] is not None
    loop_wav = tmp / "loop.wav"
    if has_audio:
        raw_wav = tmp / "raw.wav"
        run(["ffmpeg", "-v", "error", "-y", "-i", args.video, "-t", f"{dur:.6f}", "-vn",
             "-ac", "2", "-ar", str(SR), "-c:a", "pcm_s16le", raw_wav])
        loop_audio(raw_wav, loop_wav, dur, fade)

    vf = (
        f"[0:v]trim=end_frame={frames},setpts=PTS-STARTPTS,"
        f"crop={cw}:{ch}:{cx}:{cy},scale={OUT_W}:{OUT_H}:flags=lanczos,{LEVELS[args.variant]},format=yuv420p,split[a][b];"
        f"[a]trim=start_frame={ff},setpts=PTS-STARTPTS[m];"
        f"[b]trim=end_frame={ff},setpts=PTS-STARTPTS[h];"
        f"[m][h]xfade=transition=fade:duration={fade:.6f}:offset={loop_len - fade:.6f},format=yuv420p[v]"
    )
    master = tmp / "master.mkv"
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", args.video]
    if has_audio:
        cmd += ["-i", loop_wav]
    cmd += ["-filter_complex", vf, "-map", "[v]"]
    if has_audio:
        cmd += ["-map", "1:a", "-c:a", "pcm_s16le"]
    cmd += ["-r", info["fps_str"], "-c:v", "ffv1", "-t", f"{loop_len:.6f}", master]
    run(cmd)

    out = PUBLIC / "hero"
    out.mkdir(parents=True, exist_ok=True)
    a_mp4 = ["-c:a", "aac", "-b:a", "96k"] if has_audio else ["-an"]
    a_webm = ["-c:a", "libopus", "-b:a", "80k"] if has_audio else ["-an"]
    name = output_name(args.variant)
    run(["ffmpeg", "-v", "error", "-y", "-i", master, "-c:v", "libx264", "-preset", "slow", "-crf", "24",
         "-pix_fmt", "yuv420p", "-profile:v", "high", *a_mp4, "-movflags", "+faststart", out / f"{name}.mp4"])
    run(["ffmpeg", "-v", "error", "-y", "-i", master, "-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0",
         "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", "-pix_fmt", "yuv420p", *a_webm, out / f"{name}.webm"])
    return master


def output_name(variant):
    return f"intro-{variant}"


def sharpest_frame(master, tmp):
    run(["ffmpeg", "-v", "error", "-y", "-i", master, "-vf", "fps=4", tmp / "f_%03d.png"])
    best, score = None, -1.0
    for p in sorted(tmp.glob("f_*.png")):
        g = np.asarray(Image.open(p).convert("L"), np.float32)
        lap = np.abs(4 * g[1:-1, 1:-1] - g[:-2, 1:-1] - g[2:, 1:-1] - g[1:-1, :-2] - g[1:-1, 2:]).var()
        if lap > score:
            best, score = p, lap
    return Image.open(best).convert("RGB")


def whiten(img):
    a = np.asarray(img, np.float32) / 255
    return Image.fromarray((np.clip(a / 0.98, 0, 1) * 255).astype(np.uint8))


def head_box(img):
    """Locate the head (darkest/most-contrasting region near the top) and return a 4:5 head-to-shirt box."""
    g = np.asarray(img.convert("L"), np.float32)
    mask = g < 200
    ys, xs = np.nonzero(mask)
    top = np.percentile(ys, 0.3)
    head_rows = mask[int(top): int(top + g.shape[0] * 0.25)]
    cols = np.nonzero(head_rows.any(0))[0]
    cx = (np.percentile(cols, 5) + np.percentile(cols, 95)) / 2 if len(cols) else g.shape[1] / 2
    head_w = (np.percentile(cols, 95) - np.percentile(cols, 5)) if len(cols) else g.shape[1] / 3
    w = min(g.shape[1], head_w * 2.0)
    h = w * 600 / 480
    y0 = max(0, top - h * 0.08)
    if y0 + h > g.shape[0]:
        h = g.shape[0] - y0
        w = h * 480 / 600
    x0 = float(np.clip(cx - w / 2, 0, g.shape[1] - w))
    return (int(x0), int(y0), int(x0 + w), int(y0 + h))


def build_stills(args, master, tmp):
    src = Image.open(args.photo).convert("RGB") if args.photo else sharpest_frame(master, tmp)
    src = whiten(src)
    bust = src.crop(head_box(src)).resize((480, 600), Image.LANCZOS)
    bust.save(PUBLIC / "images" / "portrait-bust.webp", "WEBP", quality=82, method=6)

    og = Image.new("RGB", (1200, 630), PAPER)
    run(["ffmpeg", "-v", "error", "-y", "-ss", "1", "-i", master, "-frames:v", "1", tmp / "og.png"])
    frame = Image.open(tmp / "og.png").convert("RGB")
    fig = frame.resize((int(630 * frame.width / frame.height), 630), Image.LANCZOS)
    x = 1200 - fig.width - 40
    region = np.asarray(og.crop((x, 0, x + fig.width, 630)), np.float32)
    mult = region * np.asarray(fig, np.float32) / 255
    og.paste(Image.fromarray(mult.astype(np.uint8)), (x, 0))

    d = ImageDraw.Draw(og)
    font = lambda size: ImageFont.truetype(args.font, size) if args.font else ImageFont.load_default(size)
    d.text((72, 210), args.name, font=font(92), fill=INK)
    d.text((76, 330), args.role, font=font(38), fill=MUTE)
    d.line((76, 410, 196, 410), fill=INK, width=3)
    og.save(PUBLIC / "images" / "og.jpg", "JPEG", quality=86, optimize=True, progressive=True)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--variant", choices=["light", "dark"], default="light",
                    help="light: white backdrop -> intro-light.*; dark: black backdrop -> intro-dark.* (no stills)")
    ap.add_argument("--video", help="source clip (default: assets/source/video/intro-<variant>.mp4)")
    ap.add_argument("--photo", help="portrait photo for portrait-bust.webp (default: assets/source/images/portrait.jpg if present)")
    ap.add_argument("--crop", help="W:H:X:Y override for the person crop")
    ap.add_argument("--seconds", type=float, default=10.0)
    ap.add_argument("--fade", type=float, default=0.5)
    ap.add_argument("--name", default="Arjun N S")
    ap.add_argument("--role", default="Software Developer & AI Engineer")
    ap.add_argument("--font", default="/System/Library/Fonts/HelveticaNeue.ttc",
                    help="TTF/OTF/TTC used for og.jpg text")
    args = ap.parse_args()
    if args.font and not Path(args.font).exists():
        args.font = None
    args.video = args.video or str(SOURCE / "video" / f"intro-{args.variant}.mp4")
    if args.photo is None and (SOURCE / "images" / "portrait.jpg").exists():
        args.photo = str(SOURCE / "images" / "portrait.jpg")
    if not Path(args.video).exists():
        sys.exit(f"Source video not found: {args.video}")

    info = probe(args.video)
    print(f"source {info['w']}x{info['h']} @ {info['fps']:.3f}fps, {info['vdur']:.2f}s")
    crop = tuple(map(int, args.crop.split(":"))) if args.crop else detect_crop(args.video, info, min(args.seconds, info["vdur"]))
    print(f"  crop={crop[0]}:{crop[1]}:{crop[2]}:{crop[3]}")
    with tempfile.TemporaryDirectory() as t:
        tmp = Path(t)
        master = build_video(args, info, crop, tmp)
        if args.variant == "light":
            build_stills(args, master, tmp)
    name = output_name(args.variant)
    outputs = [PUBLIC / f"hero/{name}.mp4", PUBLIC / f"hero/{name}.webm"]
    if args.variant == "light":
        outputs += [PUBLIC / "images" / "portrait-bust.webp", PUBLIC / "images" / "og.jpg"]
    for p in outputs:
        print(f"  wrote {p.relative_to(ROOT)}  {p.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
