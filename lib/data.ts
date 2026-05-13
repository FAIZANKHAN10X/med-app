export interface Medicine {
  id: string;
  name: string;
  strength: string;
  company: string;
  category: string;
}

export const categories = [
  "All",
  "Acidity",
  "Constipation",
  "Cough & Cold",
  "Fever",
  "First Aid",
  "Pain",
  "Parkinsons",
  "Piles",
  "Sedatives",
  "Vitamins",
];

// Map a category to its accent color token + a soft background
export function categoryStyle(category: string): { fg: string; bg: string } {
  const map: Record<string, { fg: string; bg: string }> = {
    Acidity: { fg: "var(--color-cat-acidity)", bg: "rgba(20,184,166,.10)" },
    Fever: { fg: "var(--color-cat-fever)", bg: "rgba(245,158,11,.12)" },
    Pain: { fg: "var(--color-cat-pain)", bg: "rgba(244,63,94,.10)" },
    "Cough & Cold": { fg: "var(--color-cat-cold)", bg: "rgba(6,182,212,.10)" },
    "First Aid": { fg: "var(--color-cat-firstaid)", bg: "rgba(239,68,68,.10)" },
    Vitamins: { fg: "var(--color-cat-vitamins)", bg: "rgba(132,204,22,.12)" },
    Parkinsons: {
      fg: "var(--color-cat-parkinsons)",
      bg: "rgba(139,92,246,.10)",
    },
    Sedatives: { fg: "var(--color-cat-sedatives)", bg: "rgba(99,102,241,.10)" },
    Piles: { fg: "var(--color-cat-piles)", bg: "rgba(219,39,119,.10)" },
    Constipation: {
      fg: "var(--color-cat-constipation)",
      bg: "rgba(161,98,7,.12)",
    },
  };
  return (
    map[category] ?? {
      fg: "var(--color-cat-default)",
      bg: "rgba(100,116,139,.10)",
    }
  );
}

export const medicines: Medicine[] = [
  {
    id: "15",
    name: "Aciloc",
    strength: "150mg",
    company: "Cadila Pharmaceuticals",
    category: "Acidity",
  },
  {
    id: "14",
    name: "Aciloc RD",
    strength: "30mg",
    company: "Cadila Pharmaceuticals",
    category: "Acidity",
  },
  {
    id: "3",
    name: "Augmentin",
    strength: "625mg",
    company: "GSK",
    category: "First Aid",
  },
  {
    id: "16",
    name: "Clonafit MD",
    strength: "0.50mg",
    company: "Mankind",
    category: "Sedatives",
  },
  {
    id: "9",
    name: "Combiflam",
    strength: "Ibuprofen 400mg + Paracetamol 325mg",
    company: "Sanofi",
    category: "Pain",
  },
  {
    id: "18",
    name: "Cremaffin Plus Syrup",
    strength: "200ml",
    company: "Abbott",
    category: "Constipation",
  },
  {
    id: "1",
    name: "Dolo",
    strength: "650mg",
    company: "Micro Labs",
    category: "Fever",
  },
  {
    id: "2",
    name: "Paracetamol",
    strength: "500mg",
    company: "Generic",
    category: "Fever",
  },
  {
    id: "10",
    name: "Parkitidin ER",
    strength: "129mg",
    company: "Sun Pharma",
    category: "Parkinsons",
  },
  {
    id: "17",
    name: "Pilex Forte",
    strength: "Tablet",
    company: "Himalaya",
    category: "Piles",
  },
  {
    id: "13",
    name: "Rasalect",
    strength: "0.5mg",
    company: "Sun Pharma",
    category: "Parkinsons",
  },
  {
    id: "11",
    name: "Syndopa Plus",
    strength: "125mg",
    company: "Sun Pharma",
    category: "Parkinsons",
  },
  {
    id: "12",
    name: "Syndopa CR",
    strength: "250mg",
    company: "Sun Pharma",
    category: "Parkinsons",
  },
];

export const sortedMedicines = [...medicines].sort((a, b) =>
  a.name.localeCompare(b.name),
);
