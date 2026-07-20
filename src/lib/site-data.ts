export const socials = [
  { label: "GitHub", href: "https://github.com/Elliot-Sones" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/elliot-sones/" },
  { label: "Resume", href: "/resume.pdf" },
  { label: "Email", href: "mailto:soneselliot@gmail.com" },
];

export const navItems = [
  { slug: "experience", label: "Experience" },
  { slug: "projects", label: "Projects" },
  { slug: "competitions", label: "Competitions" },
  { slug: "learning", label: "Learning Blogs" },
];

export interface StatusItem {
  title: string;
  detail: string;
  badge: string;
  tone: "live" | "ship" | "plain";
}

export const focuses = [
  {
    title: "AI Agents",
    detail:
      "Building autonomous agents that can reason, plan, and take actions — from RL-based game agents to tool-using LLM agents that solve real problems.",
  },
  {
    title: "Deep Learning & MLOps",
    detail:
      "Training models from scratch (transformers, CNNs, RNNs) and deploying them — with a focus on reinforcement learning and attention mechanisms.",
  },
];

export const workingOn: StatusItem[] = [
  {
    title: "whisper-flow",
    detail: "Personal push-to-talk dictation for macOS",
    badge: "building",
    tone: "live",
  },
  {
    title: "probabilistic-pitcher-physics",
    detail: "Pitcher physics modeling and validation from public Statcast data",
    badge: "modeling",
    tone: "plain",
  },
  {
    title: "This portfolio",
    detail: "Next.js 16 · MDX · live stats — you're looking at it",
    badge: "shipping",
    tone: "ship",
  },
];

export const learningNow: StatusItem[] = [
  {
    title: "Kernel-level optimization for transformer models",
    detail: "Writing and tuning GPU kernels instead of importing them",
    badge: "current",
    tone: "live",
  },
];

export interface Competition {
  slug: string;
  name: string;
  project: string;
  date: string;
  outcome?: string;
  git?: string;
  link?: string;
  logo?: string;
  image?: string;
  description: string;
}

export const competitions: Competition[] = [
  {
    slug: "huskyhack-2026",
    name: "HuskyHack 2026",
    project: "Travel the World. Learn the Language.",
    date: "May 2026",
    git: "https://github.com/Elliot-Sones/HuskyHac",
    link: "https://huskyhac.vercel.app",
    logo: "/experience/huskyhack_logo.svg",
    description:
      "Immersive AI travel companion built at George Brown Polytechnic's 12-hour hackathon — walk the airport and talk your way through a foreign country, learning the language and social norms through live scenarios, from apprentice interpreter to Grand Dragoman.",
  },
  {
    slug: "hack-canada-2026",
    name: "Hack Canada 2026",
    project: "CoCivil — Land Development Due Diligence Platform",
    date: "March 2026",
    outcome: "Won Google Studio AI",
    git: "https://github.com/Elliot-Sones/Hack_Canada",
    link: "https://cocivils.com",
    logo: "/experience/cocivil_logo.svg",
    description:
      "Full-stack due diligence platform for Toronto land development. Generates planning submission packages from a plain-English query using AI, zoning analysis, 3D massing, and RAG-powered policy search.",
  },
  {
    slug: "splxutspan-2026",
    name: "SPLxUTSPAN 2026 Data Challenge",
    project: "Free Throw Prediction from Motion Capture",
    date: "February 2026",
    outcome: "1st Place",
    git: "https://github.com/Elliot-Sones/SPLxUTSPAN-2026-Data-Challenge",
    link: "https://www.kaggle.com/competitions/spl-utspan-data-challenge-2026",
    logo: "/experience/spl_logo.png",
    image: "/experience/spl_image.png",
    description:
      "Kaggle competition predicting basketball free throw outcomes from 69-joint motion capture data. Per-player biomechanical models, temporal commitment analysis, kinetic chain features, and CNN ensembles — 0.006148 MSE.",
  },
  {
    slug: "anthropic-hackathon-2025",
    name: "Anthropic Hackathon 2025",
    project: "ScholarMatch AI",
    date: "November 2025",
    outcome: "Honorable Mention",
    git: "https://github.com/Elliot-Sones/Anthropic_Hackathon_2025",
    link: "https://youtu.be/JhZocIzI3QA",
    logo: "/experience/anthropic_logo.png",
    image: "/experience/anthropic_image.png",
    description:
      "Multi-agent platform that aligns scholarship applications with what committees actually value — RAG-powered matching against past winners, human-in-the-loop interviews to extract authentic stories, and essay/resume drafting with Claude.",
  },
  {
    slug: "utmist-ai2",
    name: "UTMIST AI² Tournament",
    project: "RL Agent for a 2D Fighting Game",
    date: "October 2025",
    git: "https://github.com/Elliot-Sones/AI_2",
    logo: "/experience/ai2_logo.png",
    image: "/experience/ai2_image.png",
    description:
      "PPO agent trained entirely through self-play for the UTMIST AI² fighting-game tournament — opponent modeling via action-history context and a 9-phase curriculum from navigation to full combat.",
  },
  {
    slug: "mues-2025",
    name: "MUES Hackathon 2025",
    project: "Magic Studio Paint",
    date: "October 2025",
    outcome: "1st Place",
    git: "https://github.com/Elliot-Sones/MUESHACK",
    link: "https://magicspace.vercel.app/",
    logo: "/experience/mues_logo.png",
    image: "/experience/mues_image.png",
    description:
      "A canvas you can draw on, then choose a character and interact with the drawing.",
  },
  {
    slug: "pond-2025",
    name: "Pond Hackathon 2025",
    project: "Nodelet",
    date: "July 2025",
    outcome: "20,000+ votes",
    git: "https://github.com/Elliot-Sones/Pond-Hackathon",
    link: "https://nodelet-web.vercel.app/",
    logo: "/experience/pond_logo.svg",
    description: "Educational interactive learning platform for crypto literacy.",
  },
];

export interface ExperienceItem {
  role: string;
  org: string;
  period: string;
  start: string; // "YYYY-MM"
  end?: string; // "YYYY-MM", exclusive; omit = present
  detail: string;
  more?: string;
  link?: string;
  short?: string; // compact label for narrow timeline bars
  current?: boolean;
  logo?: string;
  logoDark?: boolean;
}

export const experience: ExperienceItem[] = [
  {
    role: "Operations Intern",
    org: "Trajekt Sports",
    period: "May 2026 — present",
    start: "2026-05",
    current: true,
    logo: "/experience/trajekt_icon.png",
    link: "https://www.trajektsports.com/",
    detail:
      "Toronto sports-tech company behind the Trajekt Arc pitching robot, used by MLB teams to replicate real pitchers in batting practice.",
    more: "The Trajekt Arc replicates any pitcher's delivery from tracking data — 120+ systems deployed, used daily by pros across the MLB and NPB.",
  },
  {
    role: "Machine Learning Research Intern",
    org: "NTangible",
    short: "ML Research Intern",
    period: "Nov 2025 — present",
    start: "2025-11",
    current: true,
    logo: "/experience/ntangible_logo.png",
    logoDark: true,
    detail:
      "Exploring real-world applications of AI/ML in sports psychology, combining technical development with performance analytics.",
  },
  {
    role: "BSc Computer Science",
    org: "Toronto Metropolitan University",
    period: "Sep 2025 — present · proj. 2029",
    start: "2025-09",
    current: true,
    logo: "/experience/tmu_logo.svg",
    link: "https://www.torontomu.ca/",
    detail:
      "Focused on reinforcement learning, transformer architectures, and applied AI.",
    more: "Current GPA 3.7. Projected graduation 2029.",
  },
  {
    role: "Bachelor of Commerce",
    org: "Athabasca University",
    period: "May 2024 — Sep 2025",
    start: "2024-05",
    end: "2025-09",
    logo: "/experience/athabasca_logo.png",
    link: "https://www.athabascau.ca/",
    detail: "Business foundations before transferring into computer science. GPA 3.7.",
  },
  {
    role: "Professional Academy Soccer Player (U19)",
    org: "Lank Vilaverdense SC — Vila Verde, Portugal",
    short: "Academy Soccer Player (U19)",
    period: "Aug 2023 — May 2024",
    start: "2023-08",
    end: "2024-05",
    logo: "/experience/lank_logo.png",
    link: "https://www.playmakerstats.com/player/elliot-sones/1259756",
    detail:
      "Trained and competed in a professional academy environment; developed discipline, resilience, and teamwork under pressure.",
  },
];

export interface MoreRepo {
  name: string;
  description: string;
  language: string;
  url: string;
}

export const moreRepos: MoreRepo[] = [
  {
    name: "whisper-flow",
    description: "Personal push-to-talk dictation for macOS",
    language: "Python",
    url: "https://github.com/Elliot-Sones/whisper-flow",
  },
  {
    name: "AgentGate",
    description:
      "Scans AI agents before deployment — sandboxes them, compares actual vs. declared behavior, returns an allow/block trust verdict",
    language: "Python",
    url: "https://github.com/Elliot-Sones/AgentGate",
  },
  {
    name: "probabilistic-pitcher-physics",
    description: "Probabilistic pitcher physics modeling and validation from public Statcast data",
    language: "Python",
    url: "https://github.com/Elliot-Sones/probabilistic-pitcher-physics",
  },
  {
    name: "lanki",
    description:
      "Anki for LeetCode — evaluates your code and explanations to schedule spaced repetition",
    language: "Java",
    url: "https://github.com/Elliot-Sones/lanki",
  },
];

export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  link: string;
  image: string;
  skills: string[];
}

export const certificates: Certificate[] = [
  {
    title: "Machine Learning Specialization",
    issuer: "Stanford Online & DeepLearning.AI",
    date: "2024",
    link: "https://coursera.org/share/c11e6b7d48feb1562c4f00e27cc5a918",
    image: "/certificates/ml-certificate.png",
    skills: ["NumPy", "scikit-learn", "TensorFlow"],
  },
  {
    title: "Python for Everybody",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/01bb7c66747ac3c22eb8dee7bf0ee71f",
    image: "/certificates/python-certificate.png",
    skills: ["Web Scraping", "SQL", "Data Processing"],
  },
  {
    title: "JavaScript Certificate",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/bbff1834c39f1aecfd3a04b534eee3d1",
    image: "/certificates/js-certificate.png",
    skills: ["JavaScript"],
  },
  {
    title: "HTML5 Certificate",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/5acc063d1324a5f2105e65e168f8f70b",
    image: "/certificates/html-certificate.png",
    skills: ["HTML5"],
  },
  {
    title: "CSS3 Certificate",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/b34968314e48535fe5bb123884f16711",
    image: "/certificates/css-certificate.png",
    skills: ["CSS3"],
  },
];
