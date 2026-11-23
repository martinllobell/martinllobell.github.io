export const profile = {
  name: "Martín Llobell",
  role: "Backend and AI engineer",
  pitch: "I build production systems where failures cost money: LLM gateways, agent platforms, exchange risk engines and event-driven services.",
  location: "Mendoza, Argentina",
  email: "martinllobell3.0@gmail.com",
  github: "https://github.com/martinllobell",
  linkedin: "https://www.linkedin.com/in/martin-llobell-devel0per",
  calendarUrl: "",
};

export const approach = [
  "Five years building backend systems for enterprise, fintech, telecom, Web3 and AI teams, mostly in Go, TypeScript, Python and Rust.",
  "I start from the product. Before picking a stack I want to know who depends on the system, what it has to guarantee and which failures the business can live with. The architecture comes out of those answers.",
  "I also go after the slow parts of how a team ships, like manual release steps or long review loops, and automate them so more of the week goes into the product.",
];

export type SceneKind = "gateway" | "exchange" | "stream" | "web" | "docs" | "deploy" | "ledger" | "finance" | "chain";

export type Role = {
  title: string;
  company: string;
  when: string;
  scene: SceneKind;
  points: string[];
  impact: string;
  tech: string[];
  logo?: string;
  url?: string;
  viaAvenga?: boolean;
};

export const experience: Role[] = [
  {
    title: "AI Engineer",
    company: "EOS",
    when: "Sep 2026 – Oct 2026",
    scene: "gateway",
    points: [
      "Built an enterprise AI agent platform that lets companies run agents on top of the tools they already use.",
      "Worked on the core LLM gateway, an OpenRouter-style API that routes requests across model providers and tracks usage and cost per agent.",
      "Implemented 20+ connectors, including Jira, Linear, GitHub, Slack and a Snowflake connector for enterprise data warehouses.",
    ],
    impact: "Agents worked inside the tools each team already used, and every request was tracked for usage and cost per agent.",
    tech: ["Claude", "Anthropic", "Snowflake", "Jira", "Linear"],
  },
  {
    title: "Blockchain Engineer",
    company: "Nexus",
    when: "Mar 2026 – Aug 2026",
    scene: "exchange",
    logo: "nexus.svg",
    url: "https://nexus.xyz",
    points: [
      "Owned the oracle and risk services of a centralized exchange on a Layer 1 network: mark price, liquidations and pre-trade risk checks.",
      "Built the services between off-chain logic and on-chain execution, handling transaction flows, gas and execution reliability.",
      "Integrated smart contracts over JSON-RPC and Ethers.js and designed REST APIs used across the platform.",
    ],
    impact: "Ran the services that set mark price and trigger liquidations, where a wrong value moves real money. Took part in the scalability and fault tolerance decisions behind them.",
    tech: ["Node.js", "Rust", "Go", "Ethers.js", "Docker", "Kubernetes", "Google Cloud"],
  },
  {
    title: "Senior Backend Developer",
    company: "Wind River",
    when: "Sep 2024 – Jan 2026",
    scene: "stream",
    logo: "windriver.svg",
    url: "https://www.windriver.com",
    viaAvenga: true,
    points: [
      "Built APIs, microservices and gRPC services in Go, Node.js and TypeScript for enterprise systems.",
      "Produced and consumed Kafka events with idempotent consumers and retry handling.",
      "Tuned SQL for consistency under load and automated backend regression testing with Pytest.",
    ],
    impact: "Releases shipped with automated regression coverage and Jenkins checks on every pull request, and consumers could retry events safely.",
    tech: ["Go", "Node.js", "TypeScript", "gRPC", "Kafka", "PostgreSQL", "Python", "Kubernetes", "Terraform", "Jenkins", "Angular"],
  },
  {
    title: "Senior Frontend Developer",
    company: "Accenture",
    when: "Sep 2023 – Sep 2024",
    scene: "web",
    logo: "accenture.svg",
    url: "https://www.accenture.com",
    viaAvenga: true,
    points: [
      "Delivered enterprise web applications in Vue.js and JavaScript, from mockups to production.",
      "Built reusable components and tuned frontend performance for large applications.",
      "Shipped backend features in C# and .NET behind complex business rules.",
    ],
    impact: "Took enterprise screens from mockup to production and covered the backend side in .NET when a feature needed it.",
    tech: ["Vue.js", "JavaScript", ".NET"],
  },
  {
    title: "Frontend Team Lead",
    company: "iDocket",
    when: "Feb 2022 – Sep 2023",
    scene: "docs",
    logo: "idocket.svg",
    url: "https://www.idocket.com",
    viaAvenga: true,
    points: [
      "Led four engineers on a judicial records platform used by local governments in Texas.",
      "Turned regulatory, compliance and accessibility requirements into architecture before implementation.",
      "Shipped e-Filing, e-Recording and public records features with React, Redux and TypeScript.",
    ],
    impact: "A team of four shipped a compliance-bound platform that local governments in Texas use in production, with code review and agile delivery as the standard.",
    tech: ["React", "Redux", "TypeScript", "JavaScript"],
  },
  {
    title: "Full Stack Developer",
    company: "CloudValley Telecom",
    when: "Jul 2021 – Feb 2022",
    scene: "deploy",
    viaAvenga: true,
    points: [
      "Built deployment automation that let telecom teams ship without going through another team.",
      "Implemented React frontend and TypeScript and PostgreSQL backend features.",
    ],
    impact: "Telecom teams could deploy on their own, which shortened their time to market.",
    tech: ["React", "TypeScript", "Node.js", "PostgreSQL"],
  },
];

export type Project = {
  name: string;
  status: string;
  scene: SceneKind;
  text: string;
  detail: string;
  tech: string[];
  href?: string;
};

export const projects: Project[] = [
  {
    name: "Tramo",
    status: "Building now",
    scene: "ledger",
    text: "Bank reconciliation for small businesses in Argentina. It matches bank and Mercado Pago statements against invoices and the ERP, stores the rule behind every match and sends only the real exceptions to a person for approval.",
    detail: "Go monolith with sqlc and River jobs, a separate gRPC gateway that alone holds the tax authority certificate, and Postgres with row level security per tenant.",
    tech: ["Go", "PostgreSQL", "gRPC", "Next.js", "Terraform"],
    href: "https://tramo-web-beta.vercel.app",
  },
  {
    name: "Financer",
    status: "Personal project",
    scene: "finance",
    text: "Personal finance dashboard. Connects Mercado Pago over OAuth and banks through Belvo, reads Santander and Brubank PDF statements, and keeps balances current with webhooks.",
    detail: "FastAPI and PostgreSQL on AWS, with Docker and Caddy.",
    tech: ["FastAPI", "PostgreSQL", "Mercado Pago", "Docker", "AWS"],
  },
  {
    name: "P2P Betting",
    status: "Chainlink hackathon",
    scene: "chain",
    text: "Peer to peer sports betting on Avalanche Fuji. I led four developers, and the contracts settle NBA bets with Chainlink Functions, Automation and the ETH/USD Data Feed.",
    detail: "Solidity with reentrancy guards, Hardhat, and a React client over Ethers.js.",
    tech: ["Solidity", "Chainlink", "Ethereum", "React"],
    href: "https://martinllobell.github.io/dapp/",
  },
];

export const stack: [string, string[]][] = [
  ["Languages", ["JavaScript", "TypeScript", "Go", "Python", "Rust", "Solidity", "SQL"]],
  ["Backend", ["Node.js", "Express", "FastAPI", ".NET", "gRPC", "Kafka"]],
  ["Data", ["PostgreSQL", "MySQL", "Redis", "MongoDB", "Snowflake"]],
  ["Cloud and DevOps", ["AWS", "Google Cloud", "Docker", "Kubernetes", "Terraform", "Jenkins", "Nginx", "Linux"]],
  ["Frontend", ["React", "Next.js", "Redux", "Vue.js", "Angular", "Tailwind CSS"]],
  ["AI and Web3", ["Claude", "Anthropic", "Ethereum", "Ethers.js", "Hardhat", "Chainlink"]],
];

export const orbits = [
  ["JavaScript", "TypeScript", "Go", "Python", "Rust", "Solidity"],
  ["Node.js", "Express", "FastAPI", "gRPC", "Kafka", "PostgreSQL", "Redis", "MongoDB"],
  ["Docker", "Kubernetes", "AWS", "Google Cloud", "Terraform", "React", "Next.js", "Vue.js", "Angular", "Claude", "Ethereum", "Chainlink"],
];

export const techNotes: Record<string, string> = {
  JavaScript: "My first language and still daily: Node services, scripts and every frontend.",
  SQL: "Queries, schema design and tuning for consistency under load.",
  Express: "Minimal Node framework for REST APIs.",
  MySQL: "Relational database on several client systems.",
  Jenkins: "CI pipelines that validate every pull request before merge.",
  Nginx: "Reverse proxy and static serving in front of services.",
  Linux: "Where everything I ship runs.",
  Redux: "State management for large React apps like iDocket.",
  "Tailwind CSS": "Utility CSS for fast, consistent interfaces.",
  "Ethers.js": "Library for talking to EVM contracts over JSON-RPC.",
  Hardhat: "Ethereum toolchain to compile, test and deploy contracts.",
  Jira: "One of the 20+ connectors I built for the EOS agent platform.",
  Linear: "One of the 20+ connectors I built for the EOS agent platform.",
  Go: "Compiled language for fast, simple services. My default for APIs, gRPC and CLIs.",
  TypeScript: "JavaScript with types, for Node services, tooling and frontends.",
  Python: "FastAPI backends, test suites and automation scripts.",
  Rust: "Memory safe systems language. Used at Nexus for blockchain infrastructure.",
  Solidity: "Language for Ethereum smart contracts.",
  "Node.js": "JavaScript runtime for APIs, workers and event consumers.",
  FastAPI: "Python framework for typed REST APIs.",
  ".NET": "Microsoft platform for C# backends.",
  gRPC: "Binary calls between internal services, with protobuf contracts.",
  Kafka: "Event streaming between microservices, with idempotent consumers.",
  PostgreSQL: "The database I reach for first, row level security included.",
  Redis: "In-memory store for caching, rate limits and queues.",
  MongoDB: "Document database for flexible schemas.",
  Snowflake: "Cloud data warehouse. I built a connector so agents could query it.",
  Docker: "Containers for every service I ship.",
  Kubernetes: "Runs and scales those containers in production.",
  "Google Cloud": "Where the exchange services ran, on Kubernetes.",
  AWS: "Lightsail and Amplify, behind Docker and Caddy.",
  Terraform: "Infrastructure as code.",
  Anthropic: "Model provider behind much of my agent work.",
  Claude: "The model I build with, in products and in my own workflow.",
  Ethereum: "Smart contract platform, integrated over JSON-RPC and Ethers.js.",
  Chainlink: "Oracle network. Functions, Automation and Data Feeds in P2P Betting.",
  React: "UI library behind most of the frontends I have shipped.",
  "Next.js": "React framework. This site and the Tramo landing run on it.",
  "Vue.js": "Frontend framework I used at Accenture.",
  Angular: "Frontend framework for data visualization at Wind River.",
};

export const clientLogos = [
  { name: "Nexus", file: "nexus.svg" },
  { name: "Avenga", file: "avenga.svg" },
  { name: "Wind River", file: "windriver.svg" },
  { name: "Accenture", file: "accenture.svg" },
  { name: "iDocket", file: "idocket.svg" },
];
