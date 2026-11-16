/**
 * Single source of truth for every piece of text on the site.
 * Everything here is taken from assets/source/documents/ArjunNS-Resume.pdf (plus the phone number,
 * location and Frontend skills supplied directly by Arjun). Do not add
 * anything that isn't in the résumé.
 */

export type Profile = {
  name: string;
  firstName: string;
  initials: string;
  role: string;
  email: string;
  phone?: string;
  phoneHref?: string;
  location?: string;
  resumeSummary: string;
  extraLine: string;
  github: string;
  githubHandle: string;
  linkedin: string;
  kaggle: string;
  leetcode: string;
  resume: string;
};

export const PROFILE: Profile = {
  name: "Arjun N S",
  firstName: "Arjun",
  initials: "AN",
  role: "Software Developer & AI Engineer",
  email: "nsarjun3705@gmail.com",
  phone: "9344103428",
  phoneHref: "tel:+919344103428",
  location: "Hyderabad",
  resumeSummary:
    "Software developer and AI engineer who builds real-world products that solve customer and user problems, combining platform software development with machine learning and agentic AI. Experienced in building AI-native applications on the ServiceNow platform, developing AI agents, fine-tuning LLMs, designing scalable neural architectures, and deploying ML solutions into production pipelines. Computer Science undergraduate focused on turning applied AI research into reliable, customer-ready software.",
  extraLine:
    "Member of the Platform Intelligence and Process Automation Center team at ServiceNow, building solutions to real-world customer problems within Agile development cycles.",
  github: "https://github.com/NSArjun",
  githubHandle: "NSArjun",
  linkedin: "https://www.linkedin.com/in/arjunns3705",
  kaggle: "https://www.kaggle.com/arjunns07",
  leetcode: "https://leetcode.com/u/Arjunns",
  resume: "/files/ArjunNS-Resume.pdf",
};

export type ThemedLogo = { src: string; srcDark?: string; alt: string; width: number; height: number };

const SERVICENOW_LOGO: ThemedLogo = {
  src: "/logos/servicenow.png",
  srcDark: "/logos/servicenow-dark.png",
  alt: "ServiceNow",
  width: 572,
  height: 91,
};

export type SectionId = "about" | "skills" | "work" | "certifications" | "experience" | "achievements" | "contact";

export const NAV: { id: SectionId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

/** Section tags, numbered in page order. */
export const SECTION_TAGS: Record<SectionId, string> = {
  about: "01",
  experience: "02",
  skills: "03",
  work: "04",
  certifications: "05",
  achievements: "06",
  contact: "07",
};

/* ---------------------------------------------------------------- skills */

export type Skill = {
  name: string;
  symbol: string;
  /** key into TechLogo BRAND or CONCEPT maps */
  logo: string;
  /** Résumé items that explicitly mention this skill */
  usedIn?: string[];
};

export type SkillGroup = { family: string; resumeLabel: string; skills: Skill[] };

export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Languages",
    resumeLabel: "Languages",
    skills: [
      { name: "Python", symbol: "Py", logo: "python" },
      { name: "C", symbol: "C", logo: "c" },
      { name: "C++", symbol: "Cp", logo: "cplusplus" },
      { name: "SQL", symbol: "Sq", logo: "sql" },
      { name: "Bash/Shell Scripting", symbol: "Sh", logo: "bash" },
    ],
  },
  {
    family: "Frontend",
    resumeLabel: "Frontend",
    skills: [
      { name: "React", symbol: "Re", logo: "react" },
      { name: "Next.js", symbol: "Nx", logo: "nextjs" },
      { name: "JavaScript", symbol: "Js", logo: "javascript" },
      { name: "TypeScript", symbol: "Ts", logo: "typescript" },
      { name: "HTML", symbol: "Ht", logo: "html5" },
      { name: "CSS", symbol: "Cs", logo: "css3" },
      { name: "Tailwind CSS", symbol: "Tw", logo: "tailwindcss" },
    ],
  },
  {
    family: "ML Frameworks",
    resumeLabel: "Frameworks",
    skills: [
      { name: "TensorFlow", symbol: "Tf", logo: "tensorflow" },
      { name: "Keras", symbol: "Ke", logo: "keras" },
      { name: "PyTorch", symbol: "Pt", logo: "pytorch" },
      { name: "Scikit-learn", symbol: "Sk", logo: "scikitlearn" },
      { name: "Hugging Face Transformers", symbol: "Hf", logo: "huggingface" },
      { name: "OpenCV", symbol: "Cv", logo: "opencv" },
    ],
  },
  {
    family: "Agentic AI",
    resumeLabel: "Agentic AI",
    skills: [
      {
        name: "ServiceNow AI Agent Studio",
        symbol: "As",
        logo: "agent",
        usedIn: ["Ground Truth AI agents (ServiceNow internship)"],
      },
      { name: "MCP", symbol: "Mc", logo: "modelcontextprotocol", usedIn: ["Buildtools1 (BT1) dashboard (ServiceNow internship)"] },
      { name: "Prebuilt Agentic Frameworks", symbol: "Pa", logo: "framework" },
      { name: "Custom Workflows", symbol: "Cw", logo: "workflow" },
    ],
  },
  {
    family: "Deployment",
    resumeLabel: "Model Serving and Deployment",
    skills: [
      { name: "Docker", symbol: "Dk", logo: "docker", usedIn: ["Heimdall Builder"] },
      { name: "TensorFlow Serving", symbol: "Tv", logo: "tensorflow" },
      { name: "Kubernetes", symbol: "Ku", logo: "kubernetes", usedIn: ["Heimdall Builder"] },
      { name: "Helm", symbol: "He", logo: "helm", usedIn: ["Heimdall Builder"] },
    ],
  },
  {
    family: "MLOps",
    resumeLabel: "MLOps and Automation",
    skills: [
      { name: "Airflow", symbol: "Ar", logo: "apacheairflow" },
      { name: "Kubeflow", symbol: "Kf", logo: "kubeflow" },
      { name: "Prefect", symbol: "Pf", logo: "prefect" },
      { name: "Jenkins", symbol: "Jk", logo: "jenkins" },
      { name: "GitHub Actions", symbol: "Ga", logo: "githubactions" },
      { name: "GitLab CI", symbol: "Gl", logo: "gitlab" },
      { name: "Prometheus", symbol: "Pm", logo: "prometheus" },
      { name: "Grafana", symbol: "Gf", logo: "grafana" },
    ],
  },
  {
    family: "Data",
    resumeLabel: "Data Processing",
    skills: [
      { name: "Pandas", symbol: "Pd", logo: "pandas" },
      { name: "NumPy", symbol: "Np", logo: "numpy" },
      { name: "Apache Spark (PySpark, Spark MLlib)", symbol: "Sp", logo: "apachespark" },
      { name: "Apache Kafka", symbol: "Ka", logo: "apachekafka" },
      { name: "ETL", symbol: "Et", logo: "etl" },
      { name: "Feature Engineering", symbol: "Fe", logo: "features" },
    ],
  },
  {
    family: "Databases",
    resumeLabel: "Databases and Storage",
    skills: [
      { name: "PostgreSQL", symbol: "Pg", logo: "postgresql" },
      { name: "MongoDB", symbol: "Mg", logo: "mongodb" },
      { name: "Redis", symbol: "Rd", logo: "redis" },
      { name: "Elasticsearch", symbol: "Es", logo: "elasticsearch" },
      { name: "Snowflake", symbol: "Sf", logo: "snowflake" },
      { name: "BigQuery", symbol: "Bq", logo: "googlebigquery" },
      { name: "HDFS", symbol: "Hd", logo: "hadoop" },
    ],
  },
  {
    family: "Dev Tools",
    resumeLabel: "Developer Tools",
    skills: [
      { name: "Git", symbol: "Gi", logo: "git" },
      { name: "GitHub", symbol: "Gh", logo: "github" },
      { name: "VS Code", symbol: "Vs", logo: "vscode" },
      { name: "Google Colab", symbol: "Co", logo: "googlecolab" },
      { name: "CLIs", symbol: "Cl", logo: "terminal" },
    ],
  },
  {
    family: "Design",
    resumeLabel: "Design",
    skills: [
      { name: "Figma", symbol: "Fg", logo: "figma" },
      { name: "Fusion 360", symbol: "Fu", logo: "fusion" },
      { name: "Blender", symbol: "Bl", logo: "blender" },
    ],
  },
  {
    family: "Soft Skills",
    resumeLabel: "Soft Skills",
    skills: [
      { name: "Leadership", symbol: "Ld", logo: "leadership" },
      { name: "Team Collaboration", symbol: "Tc", logo: "team" },
      { name: "Communication", symbol: "Cm", logo: "communication" },
      { name: "Time Management", symbol: "Tm", logo: "clock" },
      { name: "Problem Solving", symbol: "Ps", logo: "puzzle" },
      { name: "Strategic Thinking", symbol: "St", logo: "strategy" },
    ],
  },
];

/* ------------------------------------------------------------ experience */

export type TimelineStop = {
  kind: "education" | "experience";
  period: string;
  start: number;
  title: string;
  place: string;
  detail?: string;
  points?: string[];
  logo?: ThemedLogo;
};

export const EDUCATION: TimelineStop[] = [
  {
    kind: "education",
    period: "2023 – 2027",
    start: 2023,
    title: "B.Tech in Computer Science and Engineering (Artificial Intelligence and Data Science)",
    place: "Saveetha Engineering College",
    detail: "CGPA: 8.6/10",
  },
];

export const EXPERIENCE: TimelineStop[] = [
  {
    kind: "experience",
    period: "Aug 2026 – Feb 2027",
    start: 2026,
    title: "Software Engineering Intern",
    place: "ServiceNow",
    logo: SERVICENOW_LOGO,
    detail:
      "Member of the Platform Intelligence and Process Automation Center team, building solutions to real-world customer problems within Agile development cycles.",
    points: [
      "Built Heimdall Builder, an AI-powered ServiceNow app that scans service repositories and generates Dockerfiles, Helm charts, and CI/CD pipelines for Snowsk8s, ServiceNow’s internal Kubernetes platform; authored a NOW AI 2026 paper on the system.",
      "Developed AI agents in ServiceNow AI Agent Studio that verify support-case fixes against live instance state (Ground Truth), contributed to Arc, a sandboxed Claude agent environment, and built an MCP-driven Buildtools1 (BT1) dashboard.",
    ],
  },
];

/* -------------------------------------------------------------- projects */

export type Project = {
  id: "heimdall" | "redactless" | "edith" | "consumewise" | "smartcam" | "hdims";
  index: string;
  title: string;
  kicker: string;
  date: string;
  description: string;
  features: string[];
  tech: { name: string; logo?: string }[];
  github?: string;
};

export const PROJECTS: Project[] = [
  {
    id: "heimdall",
    index: "01",
    title: "Heimdall Builder",
    kicker: "AI-Assisted Kubernetes Config Tool (ServiceNow)",
    date: "2026",
    description:
      "Built an AI-native ServiceNow app that scans repositories and generates Dockerfiles, Helm charts, and CI/CD pipelines for Snowsk8s.",
    features: [
      "Scans service repositories",
      "Generates Dockerfiles",
      "Generates Helm charts",
      "Generates CI/CD pipelines",
      "Automated CMDB workload deployment",
      "AI-driven container vulnerability remediation",
    ],
    tech: [
      { name: "ServiceNow" },
      { name: "Docker", logo: "docker" },
      { name: "Helm", logo: "helm" },
      { name: "Kubernetes", logo: "kubernetes" },
      { name: "CI/CD" },
      { name: "NOW AI 2026 paper" },
    ],
  },
  {
    id: "redactless",
    index: "02",
    title: "RedactLess",
    kicker: "AI-Powered Smart Redaction and Anonymization Tool",
    date: "Sep 2025 – Oct 2025",
    description: "Detects, masks, and synthesizes sensitive data, preserving privacy without compromising usability.",
    features: [
      "Fine-tuned transformer model for PII",
      "Detects, masks and synthesizes data",
      "Built for finance, healthcare and law",
      "Powered by the IBM LinuxONE system",
    ],
    tech: [{ name: "Transformer model" }, { name: "PII detection" }, { name: "IBM LinuxONE" }],
    github: "https://github.com/NSArjun/RedactLess",
  },
  {
    id: "edith",
    index: "03",
    title: "EDITH",
    kicker: "AI-Driven Personalized Learning Platform",
    date: "Feb 2025 – Mar 2025",
    description:
      "Delivers AI-powered content generation for diverse educational materials and an AI learning assistant for tailored video explanations.",
    features: [
      "Real-time doubt resolution chatbot",
      "AI learning assistant for video explanations",
      "Learning paths: Arts, Coding, Financial Literacy, Science",
      "Interactive quizzes and progress tracking",
    ],
    tech: [{ name: "Gemini API" }, { name: "AI content generation" }, { name: "Chatbot" }],
    github: "https://github.com/SriHarishb/edith",
  },
  {
    id: "consumewise",
    index: "04",
    title: "Consume Wise",
    kicker: "Public Information System for Conscious Consumption",
    date: "Jan 2025",
    description:
      "Provides consumers with verified data on food products, including nutritional value, sustainability, and ingredient suitability.",
    features: [
      "Barcode scanning",
      "Health suggestions",
      "Decentralized data evaluation",
      "Interfaces tailored for consumers in India",
    ],
    tech: [{ name: "Barcode scanning" }, { name: "Decentralized data" }],
    github: "https://github.com/SriHarishb/ConsumeWise",
  },
  {
    id: "smartcam",
    index: "05",
    title: "Smart AI Camera",
    kicker: "AI-Integrated Surveillance System",
    date: "Oct 2024",
    description:
      "Uses machine learning algorithms and real-time analytics to enhance security and safety across environments.",
    features: [
      "Facial detection",
      "Vehicle logging with parking assistance",
      "Animal detection",
      "Trespassing and anomaly detection",
      "Collapse and weapons detection",
      "Camera interference detection",
    ],
    tech: [{ name: "Machine learning" }, { name: "Real-time analytics" }],
    github: "https://github.com/NSArjun/Smart-AI-CAMERA",
  },
  {
    id: "hdims",
    index: "06",
    title: "HDIMS",
    kicker: "Health Data Information and Management System",
    date: "Aug 2024 – Sep 2024",
    description:
      "Built a cross-platform mobile application managed by hospitals and supervised by health officers.",
    features: [
      "Unified patient record maintenance",
      "Real-time data",
      "Decision support",
      "Accessible documentation",
    ],
    tech: [{ name: "Cross-platform mobile" }, { name: "Real-time data" }],
    github: "https://github.com/SriHarishb/hdims",
  },
];

/* -------------------------------------------------------- certifications */

export const CERTIFICATIONS: { title: string; issuer: string; href: string }[] = [
  {
    title: "Computational Neuroscience",
    issuer: "University of Washington",
    href: "https://coursera.org/share/9dbd0c6f10e120a503720808eb0614b5",
  },
  {
    title: "Databases and SQL for Data Science with Python",
    issuer: "IBM",
    href: "https://coursera.org/share/d180fcbe91e4c1f79c6efe4d64cc4acc",
  },
  {
    title: "Data Science Fundamentals with Python and SQL",
    issuer: "IBM",
    href: "https://coursera.org/share/28c7fc37abcb5a521c652e20c1a67455",
  },
  {
    title: "Introduction to Programming with MATLAB",
    issuer: "Vanderbilt University",
    href: "https://coursera.org/share/ebabaa8e719f74e207369e69dd15f61b",
  },
];

/* ---------------------------------------------------------- achievements */

export type Achievement = {
  label: string;
  caption: string;
  detail: string;
  /** brand or concept key for TechLogo */
  logo: string;
  value?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** used instead of a number when the résumé states no figure */
  bigText?: string;
  href?: string;
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    label: "Hackathons",
    caption: "Top 50 teams in several global innovation challenges",
    detail: "Participated in multiple national and global hackathons.",
    logo: "trophy",
    prefix: "Top ",
    value: 50,
  },
  {
    label: "Publication",
    caption: "Authored a NOW AI 2026 paper",
    detail: "On Heimdall Builder, built during the ServiceNow internship.",
    logo: "paper",
    value: 2026,
  },
  {
    label: "CGPA",
    caption: "B.Tech CSE (AI & Data Science)",
    detail: "Saveetha Engineering College, 2023 – 2027.",
    logo: "cap",
    value: 8.6,
    decimals: 1,
    suffix: "/10",
  },
  {
    label: "Projects",
    caption: "Projects listed in the résumé",
    detail: "Heimdall Builder, RedactLess, EDITH, Consume Wise, Smart AI Camera, HDIMS.",
    logo: "folder",
    value: PROJECTS.length,
  },
  {
    label: "Certifications",
    caption: "Courses completed on Coursera",
    detail: "University of Washington, IBM and Vanderbilt University.",
    logo: "coursera",
    value: CERTIFICATIONS.length,
  },
  {
    label: "Lead Compere",
    caption: "Celenza 2024 and 2025",
    detail: "Hosted the inter-college cultural fest and multiple flagship college events.",
    logo: "mic",
    value: 2,
    suffix: "×",
  },
  {
    label: "Chair",
    caption: "YUVA Young Indians Club, SEC",
    detail: "Led the HR Communications vertical, overseeing outreach and internal coordination.",
    logo: "leadership",
    bigText: "Chair",
  },
  {
    label: "Coordinator",
    caption: "DRESTEIN, Saveetha Engineering College",
    detail: "Managed operations and communication for the national-level technical symposium.",
    logo: "team",
    bigText: "Coord.",
  },
  {
    label: "Content Team Member",
    caption: "Tech Society, SEC",
    detail: "Contributed to event documentation and technical publications.",
    logo: "paper",
    bigText: "Docs",
  },
  {
    label: "LeetCode",
    caption: "Problem-solving profile",
    detail: "leetcode.com/u/Arjunns",
    logo: "leetcode",
    bigText: "@Arjunns",
    href: "https://leetcode.com/u/Arjunns",
  },
  {
    label: "Kaggle",
    caption: "Data science profile",
    detail: "kaggle.com/arjunns07",
    logo: "kaggle",
    bigText: "@arjunns07",
    href: "https://www.kaggle.com/arjunns07",
  },
];

/* ---------------------------------------------------------- about / card */

export const QUICK_FACTS: {
  label: string;
  value: string;
  href?: string;
  logo?: ThemedLogo;
}[] = [
  ...(PROFILE.location ? [{ label: "Location", value: PROFILE.location }] : []),
  { label: "Education", value: "B.Tech CSE (AI & DS), Saveetha Engineering College" },
  { label: "Currently", value: "Software Engineering Intern", logo: SERVICENOW_LOGO },
  { label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}` },
];

/** Paraphrase of the résumé's own words. */
export const ABOUT_QUOTE = "Turning applied AI research into reliable, customer-ready software.";

export const ID_CARD = {
  idNo: `@${PROFILE.githubHandle}`,
  dept: "CSE · AI & DS",
  validTill: "2027",
  back: [
    PROFILE.role,
    "B.Tech CSE (AI & DS) · CGPA 8.6/10",
    "Software Engineering Intern at ServiceNow",
    "Built Heimdall Builder, RedactLess, EDITH",
    "NOW AI 2026 paper · Top 50 in global innovation challenges",
  ],
};
