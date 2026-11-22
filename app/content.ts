// Source: career-ops/cv.md (kept in sync with LinkedIn).
export const profile = {
  name: "Martín Llobell",
  role: "Backend and AI engineer",
  pitch:
    "I build production systems where failures cost money: LLM gateways, agent platforms, exchange risk engines and event-driven services.",
  location: "Mendoza, Argentina. Working remotely with US teams.",
  email: "martinllobell3.0@gmail.com",
  github: "https://github.com/martinllobell",
  linkedin: "https://www.linkedin.com/in/martin-llobell-devel0per",
};

export const about = [
  "Five years building and operating backend systems across enterprise, fintech, telecom, Web3 and AI. Most of my work runs in Go, TypeScript, Python and Rust, on PostgreSQL, Redis, Kafka and Kubernetes.",
  "I start from constraints, not from a stack: expected volume, latency and consistency needs, which failures are acceptable and what the system must guarantee versus what it can retry. The architecture follows from those answers.",
  "Day to day I run an agentic engineering workflow: parallel Claude Code sessions coordinated by an orchestrator, with tests, CI and human review as the merge gates.",
];

export type Role = {
  title: string;
  company: string;
  when: string;
  points: string[];
};

export const experience: Role[] = [
  {
    title: "AI Engineer",
    company: "EOS (formerly Nexus)",
    when: "Sep 2026 – Oct 2026",
    points: [
      "Built an enterprise AI agent platform that lets companies run agents on top of the tools they already use.",
      "Worked on the core LLM gateway: an OpenRouter-style API that routes requests across model providers with per-agent usage and cost tracking.",
      "Added a Snowflake connector to the gateway so agents can query enterprise data warehouses.",
    ],
  },
  {
    title: "Blockchain Engineer",
    company: "Nexus",
    when: "Mar 2026 – Aug 2026",
    points: [
      "Owned the oracle and risk services of a centralized exchange on a Layer 1 network: mark price, liquidations and pre-trade risk checks.",
      "Built services connecting off-chain logic with on-chain execution, handling transaction flows, gas and execution reliability.",
      "Integrated smart contracts over JSON-RPC and Ethers.js, shipped on Kubernetes on Google Cloud.",
    ],
  },
  {
    title: "Senior Backend Developer",
    company: "Avenga, for Wind River",
    when: "Sep 2024 – Jan 2026",
    points: [
      "Built APIs, microservices and gRPC services in Go, Node.js and TypeScript for enterprise systems.",
      "Produced and consumed Kafka events with idempotent consumers and retry handling.",
      "Tuned SQL for consistency under load and automated backend regression testing with Pytest.",
    ],
  },
  {
    title: "Senior Frontend Developer",
    company: "Avenga, for Accenture",
    when: "Sep 2023 – Sep 2024",
    points: [
      "Delivered enterprise web applications in Vue.js, from mockups to production.",
      "Contributed backend features in C# and .NET behind complex business rules.",
    ],
  },
  {
    title: "Frontend Team Lead",
    company: "Avenga, for iDocket",
    when: "Feb 2022 – Sep 2023",
    points: [
      "Led a team of four engineers on a judicial records platform used in production by local governments in Texas.",
      "Turned regulatory, compliance and accessibility requirements into architecture before implementation.",
      "Shipped e-Filing, e-Recording and public records features with React, Redux and TypeScript.",
    ],
  },
  {
    title: "Full Stack Developer",
    company: "Avenga, for CloudValley Telecom",
    when: "Jul 2021 – Feb 2022",
    points: [
      "Built deployment automation that let telecom teams ship without intermediaries.",
      "Implemented React frontend and TypeScript and PostgreSQL backend features.",
    ],
  },
];

export const projects = [
  {
    name: "Fincancer",
    when: "2025 – present",
    text: "Personal finance platform. FastAPI and PostgreSQL backend with bank and Mercado Pago ingestion plus CSV, PDF and OFX importers. Runs in production on AWS with Docker and Caddy.",
  },
  {
    name: "P2P Betting",
    when: "Chainlink Block Magic hackathon, 2024",
    text: "Led four developers. Solidity contracts that settle NBA bets with Chainlink Functions, Automation and the ETH/USD Data Feed, deployed on Avalanche Fuji.",
    href: "https://github.com/martinllobell/P2PBetting",
  },
];

export const stack: [string, string][] = [
  ["Languages", "Go, TypeScript, Python, Rust, Solidity, C#, SQL"],
  ["Backend", "Node.js, FastAPI, .NET, gRPC, REST, JSON-RPC, microservices"],
  ["AI", "LLM gateways, agents, multi-provider routing"],
  ["Data and messaging", "PostgreSQL, Redis, MongoDB, Snowflake, Kafka"],
  ["Infrastructure", "Docker, Kubernetes, AWS, Google Cloud, Terraform, CI/CD"],
  ["Frontend", "React, Next.js, Vue.js, Angular"],
];
