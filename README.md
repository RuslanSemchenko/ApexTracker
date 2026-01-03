# ApexTracker: Real-Time Currency Dashboard

ApexTracker is a sleek, modern, and real-time currency and cryptocurrency monitoring dashboard. It provides up-to-the-minute price information, historical data charts, and a personalized watchlist to keep track of your favorite currencies.

The application leverages AI to simulate dynamic market data, providing a realistic experience without requiring external API keys for financial data.

![ApexTracker Screenshot](https://user-images.githubusercontent.com/12345/placeholder.png) <!-- TODO: Replace with an actual screenshot -->

---

## Features

- **Real-Time Price Updates**: View live prices for a comprehensive list of cryptocurrencies and fiat currencies.
- **Interactive Price Charts**: Analyze historical price trends over various time ranges (24h, 7d, 1M, 1Y).
- **Personalized Watchlist**: Curate a custom list of currencies you want to monitor closely.
- **Price Alerts**: Set up percentage-based price change notifications to stay informed of significant market movements.
- **Responsive Design**: A clean and intuitive interface that works seamlessly on both desktop and mobile devices.
- **AI-Powered Data**: Uses Genkit to simulate realistic, real-time market fluctuations.

---

## Tech Stack

This project is built with a modern, production-ready tech stack:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Charting**: [Recharts](https://recharts.org/)
- **AI/Generative**: [Genkit (Google AI)](https://firebase.google.com/docs/genkit)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) or any other package manager

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/apextracker.git
   cd apextracker
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root of your project and add your Google AI API key. You can get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey).
   ```.env.local
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   ```
   *Note: While the app currently simulates data locally to avoid rate-limiting on the free tier, the API key is configured for potential future use with Genkit flows.*

4. **Run the development server:**
   ```sh
   npm run dev
   ```

The application should now be running at [http://localhost:9002](http://localhost:9002).

---

## How It Works

The application uses an AI flow defined in `src/ai/flows/market-data-flow.ts` to simulate real-time market data. Instead of hitting a live financial API on every update, it uses a pre-defined list of currencies and simulates price fluctuations locally. This provides a dynamic user experience while staying within the limits of free-tier AI services.

The frontend is built with React Server Components and Client Components, ensuring a fast and interactive UI.
