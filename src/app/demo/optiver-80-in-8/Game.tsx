"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CATEGORIES,
  Category,
  Question,
  QUESTION_COUNT,
  fmt,
  generatePaper,
  isCorrect,
  parseAnswer,
} from "./questions";

const DURATION_MS = 8 * 60 * 1000;
const DEFAULT_SEED = "80-in-8";
const BEST_KEY = "optiver-80-in-8:best";

interface Attempt {
  given: string | null; // null = skipped / never reached
  correct: boolean;
  ms: number;
}

type Phase = "intro" | "playing" | "done";

const mmss = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

function band(score: number) {
  if (score >= 60) return "Elite pace";
  if (score >= 40) return "Strong";
  if (score >= 20) return "Solid start";
  return "Warming up";
}

export default function Game() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [paper, setPaper] = useState<Question[]>([]);
  const [seed, setSeed] = useState(DEFAULT_SEED);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [remaining, setRemaining] = useState(DURATION_MS);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [best, setBest] = useState<number | null>(null);

  const deadline = useRef(0);
  const questionStart = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  // Mirror of state so the timer callback never reads a stale closure.
  const attemptsRef = useRef<Attempt[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(BEST_KEY);
      if (raw) setBest(Number(raw));
    } catch {}
  }, []);

  const finish = useCallback(() => {
    setAttempts([...attemptsRef.current]);
    setPhase("done");
    const score = attemptsRef.current.filter((a) => a.correct).length;
    try {
      const prev = Number(localStorage.getItem(BEST_KEY) ?? "-1");
      if (score > prev) {
        localStorage.setItem(BEST_KEY, String(score));
        setBest(score);
      }
    } catch {}
  }, []);

  const start = useCallback((useSeed: string) => {
    setSeed(useSeed);
    setPaper(generatePaper(useSeed));
    attemptsRef.current = [];
    setAttempts([]);
    setIndex(0);
    setValue("");
    const now = performance.now();
    deadline.current = now + DURATION_MS;
    questionStart.current = now;
    setRemaining(DURATION_MS);
    setPhase("playing");
  }, []);

  const startFromUrl = () => {
    const fromUrl = new URLSearchParams(window.location.search).get("seed");
    start(fromUrl || DEFAULT_SEED);
  };

  const startFresh = () => start(Math.random().toString(36).slice(2, 8));

  // Timer driven by an absolute deadline, so tab throttling can't stretch the 8 minutes.
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      const left = deadline.current - performance.now();
      if (left <= 0) {
        setRemaining(0);
        clearInterval(id);
        finish();
      } else {
        setRemaining(left);
      }
    }, 100);
    return () => clearInterval(id);
  }, [phase, finish]);

  useEffect(() => {
    if (phase === "playing") inputRef.current?.focus();
  }, [phase, index]);

  const record = (given: string | null) => {
    const q = paper[index];
    const now = performance.now();
    const parsed = given === null ? null : parseAnswer(given);
    attemptsRef.current.push({
      given,
      correct: isCorrect(parsed, q.answer),
      ms: now - questionStart.current,
    });
    questionStart.current = now;
    setValue("");
    if (index + 1 >= paper.length) finish();
    else setIndex(index + 1);
  };

  const submit = () => {
    if (!value.trim()) return;
    record(value);
  };

  const stats = useMemo(() => {
    const score = attempts.filter((a) => a.correct).length;
    const answered = attempts.filter((a) => a.given !== null);
    const wrong = answered.length - score;
    const avgMs = answered.length
      ? answered.reduce((s, a) => s + a.ms, 0) / answered.length
      : 0;
    const perCat = CATEGORIES.map((c) => {
      const rows = attempts
        .map((a, i) => ({ a, q: paper[i] }))
        .filter((r) => r.q?.category === c && r.a.given !== null);
      const right = rows.filter((r) => r.a.correct).length;
      const ms = rows.length ? rows.reduce((s, r) => s + r.a.ms, 0) / rows.length : 0;
      return { category: c as Category, attempted: rows.length, right, avgMs: ms };
    });
    return { score, answered: answered.length, wrong, avgMs, perCat };
  }, [attempts, paper]);

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center px-4 sm:px-6 py-8">
      <div className="w-full max-w-3xl flex items-center justify-between text-sm mb-6">
        <Link href="/" className="text-neutral-500 hover:text-black no-underline">
          ← Back to site
        </Link>
        <span className="text-neutral-400">Unofficial practice clone · not affiliated with Optiver</span>
      </div>

      {phase === "intro" && (
        <section className="details-container color-container w-full max-w-3xl !items-center gap-4">
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Mental maths</p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-black">80 in 8</h1>
          <p className="max-w-md leading-relaxed">
            80 arithmetic questions. 8 minutes. That&apos;s 6 seconds each. No calculator, no
            pen — just your head.
          </p>
          <ul className="text-sm text-neutral-600 text-left list-disc pl-5 space-y-1">
            <li>Type your answer and press <b>Enter</b> to move on.</li>
            <li>Fractions are answered as decimals (e.g. 3/4 → 0.75).</li>
            <li>Every question scores 1 point if right, 0 if wrong. You see no feedback until the end.</li>
            <li>Questions get harder as you go. Everyone in the room gets the same paper.</li>
          </ul>
          <button type="button" onClick={startFromUrl} className="btn btn-color-1 mt-2">
            Start
          </button>
          {best !== null && (
            <p className="text-sm text-neutral-500">Your best on this device: {best}/{QUESTION_COUNT}</p>
          )}
        </section>
      )}

      {phase === "playing" && paper[index] && (
        <section className="w-full max-w-3xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">
              Question {index + 1} / {QUESTION_COUNT}
            </span>
            <span
              className={`text-3xl font-semibold tabular-nums ${
                remaining < 60_000 ? "text-red-600" : "text-black"
              }`}
              aria-label="Time remaining"
            >
              {mmss(remaining)}
            </span>
          </div>

          <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-800 transition-[width] duration-200"
              style={{ width: `${(index / QUESTION_COUNT) * 100}%` }}
            />
          </div>

          <div className="details-container color-container !py-12 gap-8">
            <p className="text-4xl sm:text-6xl font-medium text-black tabular-nums !text-black">
              {paper[index].text}
            </p>
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/,/g, ".").replace(/[^0-9./-]/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="Answer"
              aria-label="Your answer"
              className="mx-auto w-full max-w-xs text-center text-3xl py-3 rounded-2xl border-2 border-neutral-300 focus:border-neutral-800 outline-none bg-white tabular-nums"
            />
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => record(null)}
                className="btn btn-color-2"
              >
                Skip
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={submit}
                className="btn btn-color-1"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      )}

      {phase === "done" && (
        <Results
          paper={paper}
          attempts={attempts}
          stats={stats}
          best={best}
          seed={seed}
          onRetrySame={() => start(seed)}
          onRetryFresh={startFresh}
        />
      )}
    </main>
  );
}

function Results({
  paper,
  attempts,
  stats,
  best,
  seed,
  onRetrySame,
  onRetryFresh,
}: {
  paper: Question[];
  attempts: Attempt[];
  stats: {
    score: number;
    answered: number;
    wrong: number;
    avgMs: number;
    perCat: { category: Category; attempted: number; right: number; avgMs: number }[];
  };
  best: number | null;
  seed: string;
  onRetrySame: () => void;
  onRetryFresh: () => void;
}) {
  const accuracy = stats.answered ? Math.round((stats.score / stats.answered) * 100) : 0;
  const misses = attempts
    .map((a, i) => ({ a, q: paper[i], n: i + 1 }))
    .filter((r) => r.a.given !== null && !r.a.correct);

  return (
    <div className="w-full max-w-3xl flex flex-col gap-6">
      <section className="details-container color-container !items-center gap-2">
        <p className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Your score</p>
        <p className="text-7xl font-semibold text-black tabular-nums">
          {stats.score}
          <span className="text-3xl text-neutral-400"> / {QUESTION_COUNT}</span>
        </p>
        <p className="text-lg text-neutral-700">{band(stats.score)}</p>
        {best !== null && (
          <p className="text-sm text-neutral-500">Best on this device: {best}/{QUESTION_COUNT}</p>
        )}
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Attempted" value={`${stats.answered}`} />
        <Stat label="Accuracy" value={`${accuracy}%`} />
        <Stat label="Wrong" value={`${stats.wrong}`} />
        <Stat
          label="Avg per answer"
          value={stats.answered ? `${(stats.avgMs / 1000).toFixed(1)}s` : "–"}
          hint="target 6.0s"
        />
      </section>

      <section className="details-container !text-left gap-3">
        <h2 className="text-lg font-semibold">Question by question</h2>
        <div className="grid grid-cols-10 gap-1">
          {paper.map((_, i) => {
            const a = attempts[i];
            const state = !a || a.given === null ? "skip" : a.correct ? "ok" : "bad";
            const cls =
              state === "ok"
                ? "bg-neutral-800 text-white"
                : state === "bad"
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-neutral-100 text-neutral-400";
            return (
              <div
                key={i}
                title={`Q${i + 1}: ${state === "ok" ? "correct" : state === "bad" ? "wrong" : "not answered"}`}
                className={`aspect-square rounded-md flex items-center justify-center text-[10px] sm:text-xs ${cls}`}
              >
                {state === "ok" ? "✓" : state === "bad" ? "✗" : i + 1}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-neutral-500">
          ✓ correct · ✗ wrong · number = skipped or not reached
        </p>
      </section>

      <section className="details-container !text-left gap-3">
        <h2 className="text-lg font-semibold">By topic</h2>
        <div className="flex flex-col gap-3">
          {stats.perCat.map((c) => {
            const pct = c.attempted ? (c.right / c.attempted) * 100 : 0;
            return (
              <div key={c.category}>
                <div className="flex justify-between text-sm">
                  <span>{c.category}</span>
                  <span className="text-neutral-500 tabular-nums">
                    {c.right}/{c.attempted} correct
                    {c.attempted > 0 && ` · ${(c.avgMs / 1000).toFixed(1)}s avg`}
                  </span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-neutral-800" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {misses.length > 0 && (
        <section className="details-container !text-left gap-3">
          <h2 className="text-lg font-semibold">What you got wrong</h2>
          <ul className="divide-y divide-neutral-200 text-sm">
            {misses.map((m) => (
              <li key={m.n} className="py-2 flex justify-between gap-4">
                <span className="tabular-nums">
                  <span className="text-neutral-400">Q{m.n}</span> &nbsp;{m.q.text}
                </span>
                <span className="tabular-nums">
                  <span className="text-red-600 line-through">{m.a.given}</span>
                  &nbsp;→&nbsp;<b>{fmt(m.q.answer)}</b>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex justify-center gap-3 flex-wrap">
        <button type="button" onClick={onRetrySame} className="btn btn-color-2 !w-auto px-6">
          Retry same paper
        </button>
        <button type="button" onClick={onRetryFresh} className="btn btn-color-1 !w-auto px-6">
          New paper
        </button>
      </div>
      <p className="text-center text-xs text-neutral-400">
        Paper: {seed} · Performance bands are informal, not Optiver&apos;s own thresholds.
      </p>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="details-container color-container !p-4 !items-center">
      <span className="text-2xl font-semibold text-black tabular-nums">{value}</span>
      <span className="text-xs text-neutral-500">{label}</span>
      {hint && <span className="text-[10px] text-neutral-400">{hint}</span>}
    </div>
  );
}
