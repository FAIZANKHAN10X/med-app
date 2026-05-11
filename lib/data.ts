export interface Medicine {
  id: string;
  name: string;
  strength: string;
  company: string;
  category: string;
  price?: number;
}

export const categories = [
  "All",
  "Fever",
  "Pain",
  "Cough & Cold",
  "Vitamins",
  "First Aid",
];

export const medicines: Medicine[] = [
  {
    id: "1",
    name: "Dolo",
    strength: "650mg",
    company: "Micro Labs",
    category: "Fever",
    price: 30,
  },
  {
    id: "2",
    name: "Paracetamol",
    strength: "500mg",
    company: "Generic",
    category: "Fever",
    price: 15,
  },
  {
    id: "3",
    name: "Augmentin",
    strength: "625mg",
    company: "GSK",
    category: "First Aid",
    price: 200,
  },
  {
    id: "4",
    name: "Cetirizine",
    strength: "10mg",
    company: "Cipla",
    category: "Cough & Cold",
    price: 25,
  },
  {
    id: "5",
    name: "Azithromycin",
    strength: "500mg",
    company: "Sun Pharma",
    category: "First Aid",
    price: 110,
  },
  {
    id: "6",
    name: "Volini Gel",
    strength: "30g",
    company: "Sun Pharma",
    category: "Pain",
    price: 95,
  },
  {
    id: "7",
    name: "Vitamin C",
    strength: "500mg",
    company: "Limcee",
    category: "Vitamins",
    price: 40,
  },
  {
    id: "8",
    name: "Vicks VapoRub",
    strength: "50g",
    company: "P&G",
    category: "Cough & Cold",
    price: 85,
  },
  {
    id: "9",
    name: "Combiflam",
    strength: "400mg",
    company: "Sanofi",
    category: "Pain",
    price: 35,
  },
];
