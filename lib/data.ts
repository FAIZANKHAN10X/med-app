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

// Optional dynamic sorting for future medicines
export const sortedMedicines = [...medicines].sort((a, b) =>
  a.name.localeCompare(b.name),
);
