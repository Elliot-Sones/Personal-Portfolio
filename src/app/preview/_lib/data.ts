export const socials = [
  { label: "GitHub", href: "https://github.com/Elliot-Sones" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/elliot-sones/" },
  { label: "Resume", href: "https://drive.google.com/file/d/1mv1yrWGmZp0d1NJmM8x8mINL1LVgvNuF/view?usp=drive_link" },
  { label: "Instagram", href: "https://www.instagram.com/_elliot.sones_/" },
  { label: "Discord", href: "https://discordapp.com/users/1362890550428176466" },
  { label: "Email", href: "mailto:soneselliot@gmail.com" },
];

export const focuses = [
  {
    title: "AI Agents",
    detail:
      "Building autonomous agents that can reason, plan, and take actions -- from RL-based game agents to tool-using LLM agents that solve real problems.",
  },
  {
    title: "Deep Learning & MLOps",
    detail:
      "Training models from scratch (transformers, CNNs, RNNs) and deploying them -- with a focus on reinforcement learning and attention mechanisms.",
  },
];

export interface Hackathon {
  slug: string;
  name: string;
  project: string;
  date: string;
  logo?: string;
  image?: string;
  outcome?: string;
  git?: string;
  description: string;
  link?: string;
}

export const hackathons: Hackathon[] = [
  {
    slug: "splxutspan-2026",
    name: "SPLxUTSPAN 2026 Data Challenge",
    project: "Free Throw Prediction from Motion Capture",
    date: "February 2026",
    logo: "/experience/spl_logo.png",
    image: "/experience/spl_image.png",
    outcome: "Won 1st Place",
    git: "https://github.com/Elliot-Sones/SPLxUTSPAN-2026-Data-Challenge",
    description:
      "Kaggle competition predicting basketball free throw outcomes from 69-joint motion capture data. Built per-player biomechanical models, temporal commitment analysis, kinetic chain features, and CNN ensembles to achieve 0.006148 MSE.",
    link: "https://www.kaggle.com/competitions/spl-utspan-data-challenge-2026",
  },
  {
    slug: "hack-canada-2026",
    name: "Hack Canada 2026",
    project: "CoCivil — Land Development Due Diligence Platform",
    date: "March 2026",
    logo: "/experience/cocivil_logo.svg",
    outcome: "Won Google Studio AI",
    git: "https://github.com/Elliot-Sones/Hack_Canada",
    description:
      "Built a full-stack due diligence platform for Toronto land development. Generates planning submission packages from a plain-English query using AI, zoning analysis, 3D massing, and RAG-powered policy search.",
    link: "https://cocivils.com",
  },
  {
    slug: "ntangible",
    name: "NTangible",
    project: "Machine Learning Research Intern",
    date: "November 2025",
    logo: "/experience/ntangible_logo.png",
    description:
      "Supporting the technical team on exploring real-world applications of AI/ML in sports psychology, combining technical development with performance analytics.",
  },
  {
    slug: "uoft-anthropic",
    name: "UofT Anthropic Hackathon",
    project: "Reinforcement Learning Agent 2D Fighting Game",
    date: "October 2025",
    logo: "/experience/anthropic_logo.png",
    image: "/experience/anthropic_image.png",
    git: "https://github.com/Elliot-Sones/AI_2",
    description:
      "Developed a reinforcement learning agent that learns to play a 2D fighting game through self-play and neural network training.",
  },
  {
    slug: "mues-2025",
    name: "MUES Hackathon 2025",
    project: "Magic Studio Paint",
    date: "October 2025",
    logo: "/experience/mues_logo.png",
    image: "/experience/mues_image.png",
    outcome: "Won 1st place",
    git: "https://github.com/Elliot-Sones/MUESHACK",
    description:
      "Built a website that allows you to draw on a canvas and choose your character and interact with the drawing",
    link: "https://magicspace.vercel.app/",
  },
  {
    slug: "pond-2025",
    name: "Pond Hackathon 2025",
    project: "Nodelet",
    date: "July 2025",
    outcome: "Over 20,000 votes",
    git: "https://github.com/Elliot-Sones/Pond-Hackathon",
    description: "Built an educational interactive learning platform for crypto literacy",
    link: "https://nodelet-web.vercel.app/",
  },
];

export interface Certificate {
  slug: string;
  title: string;
  image: string;
  issuer: string;
  date: string;
  link: string;
  skills: string[];
  description: string;
}

export const certificates: Certificate[] = [
  {
    slug: "ml-specialization",
    title: "Machine Learning Specialization",
    image: "/certificates/ml-certificate.png",
    issuer: "Stanford Online & DeepLearning.AI",
    date: "2024",
    link: "https://coursera.org/share/c11e6b7d48feb1562c4f00e27cc5a918",
    skills: ["NumPy", "scikit-learn", "TensorFlow"],
    description:
      "Supervised learning, Advanced learning algorithms, Unsupervised learning, Recommenders, Reinforcement learning",
  },
  {
    slug: "python-for-everybody",
    title: "Python for Everybody",
    image: "/certificates/python-certificate.png",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/01bb7c66747ac3c22eb8dee7bf0ee71f",
    skills: ["Web Scraping", "SQL", "Data Processing"],
    description: "Python data structures, Web scraping, SQL, Data retrieval, processing, and visualization",
  },
  {
    slug: "javascript-certificate",
    title: "JavaScript Certificate",
    image: "/certificates/js-certificate.png",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/bbff1834c39f1aecfd3a04b534eee3d1",
    skills: ["JavaScript"],
    description: "Front-end dynamic websites development",
  },
  {
    slug: "html5-certificate",
    title: "HTML5 Certificate",
    image: "/certificates/html-certificate.png",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/5acc063d1324a5f2105e65e168f8f70b",
    skills: ["HTML5"],
    description: "Front-end web development fundamentals",
  },
  {
    slug: "css3-certificate",
    title: "CSS3 Certificate",
    image: "/certificates/css-certificate.png",
    issuer: "University of Michigan",
    date: "2024",
    link: "https://coursera.org/share/b34968314e48535fe5bb123884f16711",
    skills: ["CSS3"],
    description: "Styling and layout for modern web pages",
  },
];

export interface Project {
  title: string;
  description: string;
  tech: string[];
  link: string;
  repo: string;
  image?: string;
  slug?: string;
}

export const fallbackProjects: Project[] = [
  {
    slug: "neural-networks-fundamentals",
    title: "Neural Network Fundamentals",
    description:
      "MLP, CNN, and RNN architectures built from scratch to demystify every layer and gradient.",
    tech: ["Python", "NumPy", "TensorFlow"],
    link: "https://github.com/Elliot-Sones/Neural_Networks_Fundamentals",
    repo: "Elliot-Sones/Neural_Networks_Fundamentals",
  },
  {
    slug: "transformers",
    title: "Machine Translator",
    description: "Re-implemented 'Attention is all you need' end-to-end to translate English to French.",
    tech: ["Transformer", "Self Attention", "TensorFlow", "Python"],
    link: "https://github.com/Elliot-Sones/Transformers",
    repo: "Elliot-Sones/Transformers",
  },
  {
    slug: "rl-fighting-agent",
    title: "RL AI 2D Fighting Agent",
    description: "PPO trained through self-play against a 2D fighting game environment.",
    tech: ["Machine Learning", "Python", "Neural Networks"],
    link: "https://github.com/Elliot-Sones/AI_2",
    repo: "Elliot-Sones/AI_2",
  },
];

export const pages = [
  { slug: "about", label: "About", number: "01" },
  { slug: "experience", label: "Experience", number: "02" },
  { slug: "projects", label: "Projects", number: "03" },
  { slug: "certificates", label: "Certificates", number: "04" },
  { slug: "contact", label: "Contact", number: "05" },
];
