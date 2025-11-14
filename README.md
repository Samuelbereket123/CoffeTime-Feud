# ☕ Coffee Time Feud

A fun and interactive Family Feud style game with a coffee theme, built with Next.js and TypeScript.

## 🚀 Features

- Multiple categories of questions
- Timer for each question
- Score tracking for two teams
- Responsive design that works on all devices
- Fun animations and sound effects

## 🛠️ Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎮 How to Play

1. Select a category
2. Take turns with another team
3. Reveal answers by clicking on them
4. Score points for each correct answer
5. The team with the most points wins!

## 📝 Adding Questions

Edit the `data/questions.ts` file to add or modify questions. Each question should have:
- A question text
- An array of answers (in order of points)
- A category
- A difficulty level (easy, medium, hard)
- A time limit in seconds

## 🛠️ Built With

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
