export interface Question {
  question: string;
  answers: string[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in seconds
}

export const categories = [
  'Coffee',
  'Morning Routine',
  'Food & Drink',
  'General Knowledge'
];

export const questions: Question[] = [
  {
    question: "Name something people do first thing in the morning",
    answers: ["Brush teeth", "Check phone", "Drink coffee", "Shower", "Eat breakfast"],
    category: "Morning Routine",
    difficulty: "easy",
    timeLimit: 30
  },
  {
    question: "Name a popular coffee drink",
    answers: ["Espresso", "Latte", "Cappuccino", "Americano", "Mocha"],
    category: "Coffee",
    difficulty: "easy",
    timeLimit: 25
  },
  {
    question: "Name a fruit often used in coffee drinks",
    answers: ["Banana", "Coconut", "Raspberry", "Orange", "Cherry"],
    category: "Food & Drink",
    difficulty: "medium",
    timeLimit: 20
  },
  {
    question: "Name a country that produces coffee beans",
    answers: ["Brazil", "Colombia", "Vietnam", "Ethiopia", "Indonesia"],
    category: "Coffee",
    difficulty: "medium",
    timeLimit: 25
  },
  {
    question: "Name a type of coffee preparation method",
    answers: ["French Press", "Pour Over", "Aeropress", "Moka Pot", "Cold Brew"],
    category: "Coffee",
    difficulty: "hard",
    timeLimit: 20
  },
  {
    question: "Name a common coffee additive",
    answers: ["Milk", "Sugar", "Cinnamon", "Chocolate", "Vanilla"],
    category: "Coffee",
    difficulty: "easy",
    timeLimit: 20
  },
  {
    question: "Name a famous coffee shop chain",
    answers: ["Starbucks", "Dunkin'", "Costa Coffee", "Tim Hortons", "Peet's Coffee"],
    category: "Coffee",
    difficulty: "easy",
    timeLimit: 20
  },
  {
    question: "Name a health benefit of coffee",
    answers: ["Boosts energy", "Improves focus", "Contains antioxidants", "May reduce disease risk", "Enhances physical performance"],
    category: "General Knowledge",
    difficulty: "medium",
    timeLimit: 30
  }
];
