"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TerminalLine {
  type: "input" | "output" | "system";
  text: string;
}

interface InteractiveTerminalProps {
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const TYPE_SPEED = 40;

const WELCOME_LINES = [
  "Welcome to Elliot's terminal.",
  "Type 'help' to see what you can ask me.",
];

/* ------------------------------------------------------------------ */
/*  Command definitions                                                */
/* ------------------------------------------------------------------ */

const COMMANDS: Record<string, string[]> = {
  help: [
    "Available commands:",
    "",
    "  about       Who I am",
    "  skills      My tech stack",
    "  projects    Things I've built",
    "  experience  Work & hackathons",
    "  contact     How to reach me",
    "  focus       What I'm working on",
    "  soccer      The beautiful game",
    "  clear       Clear the terminal",
    "  help        Show this list",
  ],

  about: [
    "Hey! I'm Elliot Sones \u2014 a Computer Science student at Toronto Metropolitan University. I build intelligent agents and deep learning systems. When I'm not training models, I'm on the soccer field.",
  ],

  skills: [
    "ML/AI:     Python, TensorFlow, PyTorch, scikit-learn, NumPy, Pandas",
    "Frontend:  TypeScript, React, Next.js, Tailwind CSS, Framer Motion",
    "Backend:   Node.js, PostgreSQL, Prisma, GraphQL",
    "Tools:     Git, GitHub Actions, Jupyter, Docker",
  ],

  projects: [
    "1. Neural Network Fundamentals \u2014 Built MLP, CNN, and RNN architectures from scratch",
    "2. Machine Translator \u2014 Replicated the Transformer model from \"Attention Is All You Need\"",
    "3. RL Fighting Agent \u2014 Trained a PPO agent to play a 2D fighting game",
    "4. Magic Studio Paint (1st place at MUES Hackathon) \u2014 Interactive drawing app with AI characters",
  ],

  experience: [
    "ML Research Intern @ NTangible \u2014 AI/ML in sports psychology",
    "UofT Anthropic Hackathon \u2014 Built an RL agent for 2D fighting games",
    "MUES Hackathon 2025 \u2014 Won 1st place with Magic Studio Paint",
    "Pond Hackathon \u2014 Built an educational crypto literacy platform (20k+ votes)",
  ],

  contact: [
    "You can reach me at soneselliot@gmail.com or find me on GitHub (Elliot-Sones), LinkedIn (/in/elliot-sones/), or Discord.",
  ],

  focus: [
    "Currently deep into AI agents and reinforcement learning. Building autonomous systems that can reason, plan, and act. Also exploring transformer architectures and applied ML in sports analytics.",
  ],

  soccer: [
    "I've played soccer my whole life \u2014 even played a season in Portugal! Check out my stats on PlaymakerStats.",
  ],
};

/** Maps alternative inputs to canonical command names. */
const ALIASES: Record<string, string> = {
  "who are you": "about",
  whoami: "about",
  tech: "skills",
  stack: "skills",
  work: "experience",
  email: "contact",
  reach: "contact",
  interests: "focus",
  "what are you working on": "focus",
  football: "soccer",
};

function resolveCommand(raw: string): string | null {
  const input = raw.trim().toLowerCase();
  if (input === "") return null;
  if (input in COMMANDS) return input;
  if (input in ALIASES) return ALIASES[input];
  return undefined as unknown as string | null; // not found
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function InteractiveTerminal({
  className,
}: InteractiveTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ---- Welcome typing effect ------------------------------------ */

  useEffect(() => {
    let cancelled = false;
    const systemLines: TerminalLine[] = [];
    let charTimeout: ReturnType<typeof setTimeout>;

    const typeLines = async () => {
      for (const line of WELCOME_LINES) {
        if (cancelled) return;

        const entry: TerminalLine = { type: "system", text: "" };
        systemLines.push(entry);

        for (let i = 0; i < line.length; i++) {
          if (cancelled) return;

          await new Promise<void>((resolve) => {
            charTimeout = setTimeout(() => {
              entry.text = line.slice(0, i + 1);
              setLines([...systemLines]);
              resolve();
            }, TYPE_SPEED);
          });
        }

        // Small pause between lines
        if (line !== WELCOME_LINES[WELCOME_LINES.length - 1]) {
          await new Promise<void>((resolve) => {
            charTimeout = setTimeout(resolve, 200);
          });
        }
      }

      if (!cancelled) {
        setIsTyping(false);
        inputRef.current?.focus();
      }
    };

    void typeLines();

    return () => {
      cancelled = true;
      clearTimeout(charTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- Auto-scroll ---------------------------------------------- */

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [lines]);

  /* ---- Process command ------------------------------------------ */

  const processCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (trimmed === "") return;

      // Special case: clear
      if (trimmed.toLowerCase() === "clear") {
        setLines([]);
        setInputValue("");
        setCommandHistory((prev) => [...prev, trimmed]);
        setHistoryIndex(-1);
        return;
      }

      const resolved = resolveCommand(trimmed);

      const newLines: TerminalLine[] = [...lines];

      // Echo the input
      newLines.push({ type: "input", text: `$ ${trimmed}` });

      if (resolved && COMMANDS[resolved]) {
        for (const responseLine of COMMANDS[resolved]) {
          if (responseLine === "") {
            newLines.push({ type: "output", text: "" });
          } else {
            newLines.push({ type: "output", text: responseLine });
          }
        }
      } else {
        newLines.push({
          type: "output",
          text: `Command not found: ${trimmed}. Type 'help' to see available commands.`,
        });
      }

      setLines(newLines);
      setInputValue("");
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);

      // Refocus input
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    [lines],
  );

  /* ---- Key handling --------------------------------------------- */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        processCommand(inputValue);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length === 0) return;

        const nextIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);

        setHistoryIndex(nextIndex);
        setInputValue(commandHistory[nextIndex]);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex === -1) return;

        const nextIndex = historyIndex + 1;
        if (nextIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInputValue("");
        } else {
          setHistoryIndex(nextIndex);
          setInputValue(commandHistory[nextIndex]);
        }
      }
    },
    [inputValue, commandHistory, historyIndex, processCommand],
  );

  /* ---- Render line ---------------------------------------------- */

  const renderLine = (line: TerminalLine, index: number) => {
    if (line.text === "") {
      return <div key={index} className="h-[1.2em]" />;
    }

    if (line.text.startsWith("$")) {
      return (
        <div key={index} className="whitespace-pre-wrap break-all">
          <span style={{ color: "var(--accent)" }}>$</span>
          {line.text.slice(1)}
        </div>
      );
    }

    if (line.text.startsWith(">")) {
      return (
        <div
          key={index}
          className="whitespace-pre-wrap break-all"
          style={{ color: "var(--muted)" }}
        >
          {line.text}
        </div>
      );
    }

    if (line.type === "system") {
      return (
        <div
          key={index}
          className="whitespace-pre-wrap break-all"
          style={{ color: "var(--muted)" }}
        >
          {line.text}
        </div>
      );
    }

    return (
      <div
        key={index}
        className="whitespace-pre-wrap break-all"
        style={{ color: "var(--foreground)" }}
      >
        {line.text}
      </div>
    );
  };

  /* ---- JSX ------------------------------------------------------ */

  return (
    <div
      className={`pixel-card ${className ?? ""}`}
      style={{
        background: "rgba(20, 38, 30, 0.92)",
        border: "2px solid rgba(244, 234, 213, 0.5)",
        boxShadow: "2px 2px 0 0 rgba(26, 48, 40, 0.6)",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-2"
        style={{
          borderBottom: "2px solid rgba(244, 234, 213, 0.15)",
          background: "rgba(15, 30, 22, 0.5)",
        }}
      >
        <span
          className="inline-block w-[10px] h-[10px]"
          style={{
            background: "#ff5f57",
            boxShadow: "1px 1px 0 rgba(0,0,0,0.2)",
          }}
        />
        <span
          className="inline-block w-[10px] h-[10px]"
          style={{
            background: "#ffbd2e",
            boxShadow: "1px 1px 0 rgba(0,0,0,0.2)",
          }}
        />
        <span
          className="inline-block w-[10px] h-[10px]"
          style={{
            background: "#28c840",
            boxShadow: "1px 1px 0 rgba(0,0,0,0.2)",
          }}
        />
        <span
          className="ml-3 text-xs tracking-wider"
          style={{ color: "var(--muted)" }}
        >
          elliot@portfolio ~ %
        </span>
      </div>

      {/* Terminal body (scrollable) */}
      <div
        ref={scrollRef}
        className="font-mono px-4 py-3 text-sm leading-relaxed overflow-y-auto"
        style={{
          color: "var(--foreground)",
          maxHeight: "320px",
        }}
      >
        {lines.map((line, i) => renderLine(line, i))}

        {/* Blinking cursor while typing welcome message */}
        {isTyping && (
          <motion.span
            className="inline-block ml-[1px]"
            style={{ color: "var(--accent)" }}
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              times: [0, 0.5, 0.5, 1],
            }}
          >
            &#9610;
          </motion.span>
        )}
      </div>

      {/* Input area */}
      {!isTyping && (
        <div
          className="flex items-center gap-2 px-4 py-2 font-mono text-sm"
          style={{
            borderTop: "2px solid rgba(244, 234, 213, 0.15)",
          }}
        >
          <span style={{ color: "var(--accent)" }}>$</span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setHistoryIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none outline-none font-mono text-sm caret-transparent"
              style={{ color: "var(--foreground)" }}
              spellCheck={false}
              autoComplete="off"
              autoFocus
              aria-label="Terminal input"
            />
            {/* Custom blinking cursor */}
            <motion.span
              className="absolute top-0 pointer-events-none font-mono text-sm"
              style={{
                color: "var(--accent)",
                left: `${inputValue.length}ch`,
              }}
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                times: [0, 0.5, 0.5, 1],
              }}
            >
              &#9610;
            </motion.span>
          </div>
        </div>
      )}
    </div>
  );
}
