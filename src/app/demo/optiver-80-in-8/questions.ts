export type Category =
  | "Addition"
  | "Subtraction"
  | "Multiplication"
  | "Division"
  | "Mixed"
  | "Decimals"
  | "Fractions & %";

export interface Question {
  text: string;
  answer: number;
  category: Category;
}

export const CATEGORIES: Category[] = [
  "Addition",
  "Subtraction",
  "Multiplication",
  "Division",
  "Mixed",
  "Decimals",
  "Fractions & %",
];

export const QUESTION_COUNT = 80;

const MIX: Record<Category, number> = {
  Addition: 12,
  Subtraction: 12,
  Multiplication: 16,
  Division: 12,
  Mixed: 12,
  Decimals: 8,
  "Fractions & %": 8,
};

type Rng = () => number;

function mulberry32(a: number): Rng {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const round2 = (x: number) => Math.round(x * 100) / 100;
export const fmt = (x: number) => String(round2(x));

type Gen = (ri: (lo: number, hi: number) => number, d: number) => { text: string; answer: number };

const generators: Record<Category, Gen> = {
  Addition: (ri, d) => {
    const k = 2 + (d > 0.35 ? 1 : 0) + (d > 0.8 ? 1 : 0);
    const lo = 10 ** (k - 1);
    const a = ri(lo, lo * 10 - 1);
    const b = ri(lo, lo * 10 - 1);
    return { text: `${a} + ${b}`, answer: a + b };
  },

  Subtraction: (ri, d) => {
    const k = 2 + (d > 0.35 ? 1 : 0) + (d > 0.8 ? 1 : 0);
    const lo = 10 ** (k - 1);
    const x = ri(lo, lo * 10 - 1);
    const y = ri(lo, lo * 10 - 1);
    const a = Math.max(x, y);
    const b = Math.min(x, y);
    return { text: `${a} − ${b}`, answer: a - b };
  },

  Multiplication: (ri, d) => {
    if (d < 0.3) {
      const a = ri(12, 99);
      const b = ri(3, 9);
      return { text: `${a} × ${b}`, answer: a * b };
    }
    if (d < 0.7) {
      const a = ri(11, 49);
      const b = ri(11, 25);
      return { text: `${a} × ${b}`, answer: a * b };
    }
    const a = ri(101, 499);
    const b = ri(6, 19);
    return { text: `${a} × ${b}`, answer: a * b };
  },

  Division: (ri, d) => {
    const q = ri(3, Math.round(12 + d * 30));
    const b = ri(3, Math.round(9 + d * 15));
    return { text: `${q * b} ÷ ${b}`, answer: q };
  },

  Mixed: (ri) => {
    switch (ri(0, 3)) {
      case 0: {
        const a = ri(10, 99);
        const b = ri(2, 12);
        const c = ri(2, 12);
        return { text: `${a} + ${b} × ${c}`, answer: a + b * c };
      }
      case 1: {
        const a = ri(1, 30);
        const b = ri(1, 30);
        const c = ri(2, 9);
        return { text: `(${a} + ${b}) × ${c}`, answer: (a + b) * c };
      }
      case 2: {
        const a = ri(3, 15);
        const b = ri(3, 15);
        const c = ri(1, a * b - 1);
        return { text: `${a} × ${b} − ${c}`, answer: a * b - c };
      }
      default: {
        const a = ri(3, 12);
        const b = ri(3, 12);
        const c = ri(3, 12);
        const e = ri(3, 12);
        return { text: `${a} × ${b} + ${c} × ${e}`, answer: a * b + c * e };
      }
    }
  },

  Decimals: (ri) => {
    const t = (n: number) => n / 10;
    switch (ri(0, 4)) {
      case 0: {
        const a = ri(11, 199);
        const b = ri(11, 199);
        return { text: `${t(a)} + ${t(b)}`, answer: round2((a + b) / 10) };
      }
      case 1: {
        const a = ri(11, 99);
        const b = ri(3, 9);
        return { text: `${t(a)} × ${b}`, answer: round2((a * b) / 10) };
      }
      case 2: {
        const a = ri(11, 99);
        const b = ri(11, 99);
        return { text: `${t(a)} × ${t(b)}`, answer: round2((a * b) / 100) };
      }
      case 3: {
        const a = ri(11, 99);
        const d = [0.5, 0.25, 0.2][ri(0, 2)];
        return { text: `${a} ÷ ${d}`, answer: round2(a / d) };
      }
      default: {
        const x = ri(101, 999);
        const y = ri(101, 999);
        const a = Math.max(x, y);
        const b = Math.min(x, y);
        return { text: `${a / 100} − ${b / 100}`, answer: round2((a - b) / 100) };
      }
    }
  },

  "Fractions & %": (ri) => {
    // Denominators chosen so every answer terminates within 2 decimal places.
    const dens = [2, 4, 5, 10, 20, 25];
    switch (ri(0, 3)) {
      case 0: {
        const b = dens[ri(0, dens.length - 1)];
        const d = dens[ri(0, dens.length - 1)];
        const a = ri(1, b - 1 || 1);
        const c = ri(1, d - 1 || 1);
        return { text: `${a}/${b} + ${c}/${d}`, answer: round2(a / b + c / d) };
      }
      case 1: {
        const b = dens[ri(1, dens.length - 1)];
        const a = ri(1, b - 1);
        const n = b * ri(2, 12);
        return { text: `${a}/${b} of ${n}`, answer: round2((a * n) / b) };
      }
      case 2: {
        const p = [5, 10, 15, 20, 25, 30, 40, 60, 75][ri(0, 8)];
        const n = 20 * ri(2, 30);
        return { text: `${p}% of ${n}`, answer: round2((p * n) / 100) };
      }
      default: {
        const b = dens[ri(1, dens.length - 1)];
        const d = dens[ri(1, dens.length - 1)];
        const na = ri(1, b - 1);
        const nc = ri(1, d - 1);
        const x = na / b;
        const y = nc / d;
        const [hi, lo, hiT, loT] =
          x >= y ? [x, y, `${na}/${b}`, `${nc}/${d}`] : [y, x, `${nc}/${d}`, `${na}/${b}`];
        return { text: `${hiT} − ${loT}`, answer: round2(hi - lo) };
      }
    }
  },
};

/** Builds the 80-question paper. Same seed → same paper, ramping in difficulty. */
export function generatePaper(seed: string): Question[] {
  const rng = mulberry32(hashSeed(seed));
  const ri = (lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));

  const slots: Category[] = [];
  for (const c of CATEGORIES) for (let i = 0; i < MIX[c]; i++) slots.push(c);
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }

  return slots.map((category, i) => {
    const { text, answer } = generators[category](ri, i / (slots.length - 1));
    return { text, answer: round2(answer), category };
  });
}

/** Accepts "12", "12.5", ".5", "3/4". Returns null when unparseable. */
export function parseAnswer(raw: string): number | null {
  const s = raw.trim();
  if (!s) return null;
  const frac = s.match(/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/);
  if (frac) {
    const den = parseFloat(frac[2]);
    return den === 0 ? null : parseFloat(frac[1]) / den;
  }
  if (/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return parseFloat(s);
  return null;
}

export const isCorrect = (given: number | null, answer: number) =>
  given !== null && Math.abs(given - answer) < 0.005;
