

# Murali Karthik Portfolio

[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0.1-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.14-06b6d4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Google AI Studio](https://img.shields.io/badge/Google%20AI%20Studio-Vibe%20Coding-4285F4?style=for-the-badge&logo=google)](https://ai.google.com/)

A high-end developer portfolio and recruiter-facing experience for **Murali Karthik**. This app combines interactive project storytelling, an AI-powered recruiter console, data-driven skill matches, and an embedded personal WCMS that enables content updates without rebuilding the UI.

---

## 🚀 Project Overview

This portfolio app is built using:

- **React 19 + Vite** for fast development and polished UI
- **Tailwind CSS** for modern styling and glassmorphism theme
- **Google AI Studio with Vibe Coding** for AI-enabled experience and personal brand storytelling
- **Express.js** backend for content APIs and chatbot routing
- **Firebase / Firestore** optional data persistence and dynamic portfolio content
- **Netlify Functions** to support serverless AI chat when deployed to Netlify

---

## 🌟 Key Features

- Interactive **Hero section** with animated title and CTA links
- `ParticlesBackground` and `InteractiveCursor` for immersive visual atmosphere
- **AI Twin Chat Console** powered by Google Gemini or local fallback logic
- **Project showcase** with category filters and detailed spec cards
- **Interactive 3D Tic-Tac-Toe** canvas experience
- **Skill Bento grid** with hover focus and expertise categories
- **Certification cards** with modal verification details
- **Recruiter Matchmaker** calculator to evaluate role fit dynamically
- **Contact launchpad** with direct phone, LinkedIn, GitHub, and copy-email actions
- Built-in **WCMS portal** at `/cms` for managing portfolio content and AI training text

---

## 🧩 Personal WCMS Details

This website includes a private **web content management system** accessible through the hidden route `/cms`.

The WCMS allows:

- secure content updates for portfolio sections
- editing of hero text, project descriptions, certifications, and skills
- saving content to Firestore or local JSON fallback
- syncing unstructured knowledge for the AI chat persona

> The WCMS is designed to keep your portfolio dynamic, so content updates can be managed from the site without directly changing source files.

---

## 🛠 Installation

### Prerequisites

- Node.js (recommended latest LTS)
- npm

### Setup

1. Clone the repository:

```bash
git clone https://github.com/muralikarthikhugar-ai/Portfolio.git
cd Portfolio
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file and add your environment variables:

```env
GEMINI_API_KEY=your_gemini_api_key_here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password
JWT_SECRET=your_jwt_secret
```

4. Run locally:

```bash
npm run dev
```

5. Open the app in your browser at:

```text
http://localhost:3000
```

---

## 📦 Available Scripts

- `npm run dev` - start the local development server
- `npm run build` - build the React app and bundle the server
- `npm start` - run the production server bundle
- `npm run clean` - remove built files
- `npm run lint` - type-check the project with TypeScript

---

## 📁 Important Files and Structure

- `src/App.tsx` - main application and page layout
- `src/DataContext.tsx` - portfolio data loader and fallback logic
- `src/components/AiConsole.tsx` - interactive AI chat console
- `src/components/Interactive3DTicTacToe.tsx` - animated game canvas
- `src/components/TiltCard.tsx` - 3D tilt card wrapper
- `src/components/ParticlesBackground.tsx` - animated starfield canvas
- `src/components/ProposalGenerator.tsx` - recruiter matchmaker calculator
- `server.ts` - Express backend, API routes, Firestore support, Gemini chat
- `netlify/functions/chat.ts` - Netlify serverless chat function for deployed app
- `data.json` - portfolio content fallback with projects, skills, and certifications

---

## 📌 Dependencies

- `react`
- `react-dom`
- `react-router-dom`
- `vite`
- `@vitejs/plugin-react`
- `tailwindcss`
- `@tailwindcss/vite`
- `typescript`
- `express`
- `dotenv`
- `firebase`
- `firebase-admin`
- `jsonwebtoken`
- `@google/genai`
- `@netlify/functions`
- `esbuild`
- `tsx`

---

## 💡 Notes

- If `GEMINI_API_KEY` is missing, the AI console gracefully falls back to a rule-based static response system.
- The app supports both local development and serverless deployment paths.
- The portfolio is intentionally built for recruiters and hiring managers, combining visual storytelling with interactive AI-driven content.

---

## 📬 Contact

- Email: `muralikarthikhugar@gmail.com`
- GitHub: [github.com/muralikarthikhugar-ai](https://github.com/muralikarthikhugar-ai)
- LinkedIn: [linkedin.com/in/muralikarthikhugar](https://www.linkedin.com/in/muralikarthikhugar)

---

Made with **Google AI Studio** using **Vibe Coding** and modern front-end tooling. 🚀
