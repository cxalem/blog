import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "CV | @cxalem",
  description:
    "Alejandro Mena — Design Engineer and Solana developer focused on building polished, high-performance interfaces and developer tools.",
  openGraph: {
    title: "Alejandro Mena — CV",
    description:
      "Design Engineer and Solana developer. Core contributor to Solana Foundation open-source projects.",
    type: "profile",
  },
};

function CVLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-3 decoration-1 decoration-zinc-400 dark:decoration-zinc-500 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors duration-200"
    >
      {children}
    </a>
  );
}

function Section({
  title,
  delay,
  children,
}: {
  title: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <section
      className="mb-16 animate-fade-in opacity-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <h2 className="text-base font-medium text-zinc-400 dark:text-zinc-500 mb-6 lowercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function TimelineItem({
  role,
  company,
  period,
  location,
  children,
  isSolana,
}: {
  role: string;
  company: string;
  period: string;
  location: string;
  children: React.ReactNode;
  isSolana?: boolean;
}) {
  return (
    <div className="relative pl-6 pb-10 last:pb-0 border-l border-zinc-200 dark:border-zinc-700">
      <div
        className={`absolute -left-[5px] top-[6px] h-[9px] w-[9px] rounded-full border-2 ${
          isSolana
            ? "border-purple-400/70 bg-purple-400/20 dark:border-purple-400/60 dark:bg-purple-400/10"
            : "border-zinc-300 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800"
        }`}
      />
      <div className="mb-3">
        <h3 className="text-sm font-medium">{role}</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {company}
          <span className="mx-1.5 text-zinc-300 dark:text-zinc-600">·</span>
          {period}
          <span className="mx-1.5 text-zinc-300 dark:text-zinc-600">·</span>
          {location}
        </p>
      </div>
      <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {children}
      </ul>
    </div>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function ProjectListItem({
  title,
  href,
  github,
  description,
  tech,
}: {
  title: string;
  href?: string;
  github?: string;
  description: string;
  tech: string;
}) {
  return (
    <div className="py-3">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-zinc-300 dark:text-zinc-600">·</span>
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="flex items-center gap-2">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              aria-label={`${title} on GitHub`}
            >
              <GitHubIcon className="h-3 w-3" />
            </a>
          )}
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              aria-label={`Visit ${title}`}
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed ml-6">
        {description}
      </p>
      <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mt-1 ml-6">
        {tech}
      </p>
    </div>
  );
}

export default function CVPage() {
  return (
    <div className="min-h-screen">
      <main className="max-w-2xl mx-auto px-6 py-20">
        <header className="flex items-center justify-between mb-16">
          <Link
            href="/"
            className="group flex items-center gap-2 text-zinc-600 dark:text-zinc-100 hover:text-zinc-900 dark:hover:text-zinc-400 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Back
          </Link>
          <ThemeToggle />
        </header>

        {/* Name & Contact */}
        <div
          className="mb-16 animate-fade-in opacity-0"
          style={{ animationDelay: "0ms" }}
        >
          <h1 className="text-2xl font-medium tracking-tight mb-3">
            Alejandro Mena
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Madrid, Spain
            </span>
            <a
              href="mailto:smarketing.cuz@gmail.com"
              className="flex items-center gap-1.5 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              smarketing.cuz@gmail.com
            </a>
            <CVLink href="https://www.cxalem.blog/">blog</CVLink>
            <CVLink href="https://github.com/cxalem">github</CVLink>
            <CVLink href="https://www.linkedin.com/in/alejandro-jose-mena/">
              linkedin
            </CVLink>
          </div>
        </div>

        {/* About */}
        <Section title="about" delay={50}>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Design Engineer and Solana developer focused on building polished,
            high-performance interfaces and developer tools for the Solana
            ecosystem. Core contributor to Solana Foundation open-source
            projects, published SDK author, and former DevRel Engineer at
            ConsenSys. I care deeply about UX, visual craft, and making complex
            blockchain interactions feel simple.
          </p>
        </Section>

        {/* Skills */}
        <Section title="skills" delay={100}>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-zinc-400 dark:text-zinc-500">
                languages
              </span>
              <span className="mx-2 text-zinc-300 dark:text-zinc-600">—</span>
              <span className="font-mono text-[13px] text-zinc-700 dark:text-zinc-300">
                TypeScript, Rust, Solidity
              </span>
            </div>
            <div>
              <span className="text-purple-400/80 dark:text-purple-400/70">
                solana
              </span>
              <span className="mx-2 text-zinc-300 dark:text-zinc-600">—</span>
              <span className="font-mono text-[13px] text-zinc-700 dark:text-zinc-300">
                Anchor, @solana/kit, Token-2022 Extensions, Metaplex
              </span>
            </div>
            <div>
              <span className="text-zinc-400 dark:text-zinc-500">
                frontend & design
              </span>
              <span className="mx-2 text-zinc-300 dark:text-zinc-600">—</span>
              <span className="font-mono text-[13px] text-zinc-700 dark:text-zinc-300">
                Next.js, React, React Native, Tailwind, Framer Motion, Three.js,
                Radix UI, Figma
              </span>
            </div>
            <div>
              <span className="text-zinc-400 dark:text-zinc-500">
                infrastructure
              </span>
              <span className="mx-2 text-zinc-300 dark:text-zinc-600">—</span>
              <span className="font-mono text-[13px] text-zinc-700 dark:text-zinc-300">
                Node.js, Supabase, Redis, Firebase, MongoDB, Vercel
              </span>
            </div>
            <div>
              <span className="text-zinc-400 dark:text-zinc-500">evm</span>
              <span className="mx-2 text-zinc-300 dark:text-zinc-600">—</span>
              <span className="font-mono text-[13px] text-zinc-700 dark:text-zinc-300">
                Wagmi, Viem, Foundry, Hardhat, Infura
              </span>
            </div>
          </div>
        </Section>

        {/* Experience */}
        <Section title="experience" delay={150}>
          <div>
            <TimelineItem
              role="Software Engineer (Contract)"
              company="Solana Foundation"
              period="Aug 2025 – Present"
              location="Remote"
              isSolana
            >
              <li>
                Maintainer of the official{" "}
                <CVLink href="https://github.com/solana-foundation/templates">
                  templates
                </CVLink>{" "}
                repo powering{" "}
                <span className="font-mono text-[13px]">
                  create-solana-dapp
                </span>{" "}
                — the primary scaffolding tool for new Solana projects.
                Second-highest contributor with 64+ commits.
              </li>
              <li>
                Create and maintain project templates across Next.js, Vite,
                Expo, and Anchor using both @solana/kit and web3.js, covering
                30+ templates.
              </li>
              <li>
                Own the repository CI pipeline, review community PRs, and ensure
                template quality and consistency.
              </li>
              <li>
                Contributed a{" "}
                <CVLink href="https://github.com/solana-foundation/framework-kit/pull/155">
                  useClassifiedTransactions
                </CVLink>{" "}
                hook to the Solana Foundation&apos;s framework-kit — integrating
                tx-indexer for automatic transaction classification, protocol
                detection, and spam filtering.
              </li>
            </TimelineItem>

            <TimelineItem
              role="DevRel Engineer"
              company="ConsenSys"
              period="Feb 2023 – Jun 2025"
              location="Remote"
            >
              <li>
                Designed and developed sample dApps used as official learning
                resources for MetaMask SDK, Infura, and Truffle — owning both UX
                design and full-stack implementation.
              </li>
              <li>
                Built a{" "}
                <CVLink href="https://www.npmjs.com/package/@consensys/create-web3-app">
                  CLI tool
                </CVLink>{" "}
                that generates ready-to-deploy React/Node projects with MetaMask
                SDK pre-configured, cutting developer onboarding from minutes to
                seconds.
              </li>
              <li>
                Implemented the Factory Pattern for smart contracts in
                Form-XChange, deploying Factory Contracts and modular Template
                Contracts for scalable dApp architecture.
              </li>
              <li>
                Created{" "}
                <CVLink href="https://www.youtube.com/watch?v=OkhV2Dl_7Z8&t=787s">
                  video tutorials
                </CVLink>
                ,{" "}
                <CVLink href="https://docs.metamask.io/sdk/quickstart/javascript-dynamic/">
                  documentation
                </CVLink>
                , and{" "}
                <CVLink href="https://metamask.io/news/how-to-build-gasless-dapps">
                  technical guides
                </CVLink>{" "}
                adopted by MetaMask DevRel as the go-to onboarding path.
              </li>
              <li>
                Organized the{" "}
                <CVLink href="https://www.hackquest.io/hackathons/MetaMask-Dev-Cook-Off-Feb-March">
                  MetaMask Dev Cook-Off
                </CVLink>{" "}
                hackathon — created bounty guides, supported participants, and
                produced educational content.
              </li>
              <li>
                Conducted code reviews across the team, maintaining code quality
                and enforcing best practices.
              </li>
            </TimelineItem>

            <TimelineItem
              role="Educational Consultant"
              company="Chainlink Labs"
              period="May 2024 – Aug 2024"
              location="Remote"
            >
              <li>
                Developed the{" "}
                <CVLink href="https://dev.chain.link/certification">
                  educational curriculum
                </CVLink>{" "}
                for blockchain, smart contract, and Chainlink oracle
                technologies.
              </li>
              <li>
                Created certification exams to assess developer proficiency
                across blockchain and oracle concepts.
              </li>
            </TimelineItem>

            <TimelineItem
              role="Front-End Engineer"
              company="Globant"
              period="Oct 2022 – Feb 2023"
              location="Lima, Peru"
            >
              <li>
                Built mobile applications with React Native and Expo, focusing
                on performance and platform-specific best practices.
              </li>
              <li>
                Designed and implemented UI components using Styled Components
                with a focus on intuitive, polished user experiences.
              </li>
              <li>
                Wrote tests with React Testing Library to ensure application
                stability.
              </li>
            </TimelineItem>
          </div>
        </Section>

        {/* Projects */}
        <Section title="projects & open source" delay={200}>
          {/* Featured: tx-indexer */}
          <div className="relative rounded-lg border border-zinc-200 dark:border-zinc-700/70 overflow-hidden mb-8">
            {/* Solana gradient left accent */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#00FFA3] to-[#DC1FFF]" />
            {/* Faint gradient background wash */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00FFA3]/[0.03] to-[#DC1FFF]/[0.03] dark:from-[#00FFA3]/[0.04] dark:to-[#DC1FFF]/[0.04]" />

            <div className="relative p-5 pl-6">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-base font-medium tracking-tight">
                  tx-indexer
                </h3>
                <div className="flex items-center gap-2.5 shrink-0">
                  <a
                    href="https://github.com/cxalem/tx-indexer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    aria-label="tx-indexer on GitHub"
                  >
                    <GitHubIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.npmjs.com/package/tx-indexer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    aria-label="tx-indexer on npm"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                TypeScript SDK that transforms raw Solana transactions into
                classified, human-readable financial data with automatic protocol
                detection and spam filtering.
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-3">
                <span>v1.5.0</span>
                <span>25 releases</span>
                <span>1,100+ dl/mo</span>
                <span>@solana/kit</span>
                <span>Zod</span>
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-br from-[#00FFA3] to-[#DC1FFF] shrink-0" />
                Being integrated into the Solana Foundation&apos;s framework-kit
              </p>
            </div>
          </div>

          {/* Other projects */}
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            <ProjectListItem
              title="ITX Dashboard"
              href="https://dashboard.itx-indexer.com/home"
              github="https://github.com/cxalem/tx-indexer/tree/main/apps/dashboard"
              description="Solana transaction dashboard — designed the full UX with 3D visualizations, privacy features, and wallet-based authentication."
              tech="Next.js 16 · React Three Fiber · Framer Motion · Radix UI · Supabase"
            />
            <ProjectListItem
              title="2022 Wizard"
              href="https://www.2022wizard.com/"
              github="https://github.com/Kronos-Guild/2022-wizard"
              description="Code generator for Token-2022 Anchor programs from audited building blocks. Configure extensions through the UI and export a complete project."
              tech="Anchor · Rust · Next.js 16 · Radix UI · Framer Motion"
            />
            <ProjectListItem
              title="ConsenSys Sample Projects"
              href="https://github.com/Consensys/eventsea"
              description="Production-grade example dApps showcasing advanced patterns in AI agents, Solidity smart contracts, and Rust programs."
              tech="Official learning resources for the Web3 developer community"
            />
          </div>
        </Section>

        {/* Education */}
        <Section title="education" delay={250}>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium">
                Universidad Católica Andrés Bello
              </p>
              <p className="text-zinc-500 dark:text-zinc-400">
                Telecommunications Engineering (incomplete) · Caracas, Venezuela
                · 2015 – 2017
              </p>
            </div>
            <div>
              <p className="font-medium">Certifications</p>
              <p className="text-zinc-500 dark:text-zinc-400">
                <CVLink href="https://platzi.com/p/Alejose/curso/2467-frontend-developer/diploma/detalle/">
                  Full-Stack Developer — Platzi
                </CVLink>
              </p>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
