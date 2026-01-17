# Steak Timer

A smart companion app for cooking the perfect steak. This application allows you to configure multiple steaks with different preferences and helps you time the cooking process perfectly. It features a synchronization mode to ensure all steaks finish cooking at the exact same time, regardless of their individual cooking requirements.

## Features

- **Multiple Steak Configuration:** Set up multiple steaks with different thickness and doneness preferences.
- **Synchronized Cooking:** Intelligent timer calculation to start thinner or rarer steaks later, so everything is ready to serve simultaneously.
- **Individual Timers:** Option to cook steaks independently with their own timers.
- **Step-by-Step Guidance:** Visual cues for flipping, searing, and resting.
- **Material UI Design:** Clean, modern, and responsive interface suitable for kitchen use.
- **PWA Support:** Installable on mobile devices as a Progressive Web App.

## Tech Stack

- React 19
- TypeScript
- Vite
- Material UI (@mui/material)
- Vite PWA Plugin

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm (Node Package Manager)

### Installation

1. Clone the repository (if you haven't already):
   ```bash
   git clone <repository-url>
   cd steak-timer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running on PC

### Development Mode
To start the application in development mode with hot-reloading:

```bash
npm run dev
```
Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

### Production Build
To build the application for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Running on Android

There are two main ways to run this application on your Android device:

### Method 1: Progressive Web App (PWA) - Recommended
This app is configured as a PWA, meaning you can install it directly from your mobile browser without an app store.

1. **Host the App:**
   - Run the app on your PC using `npm run dev -- --host` (the `--host` flag exposes it to your local network).
   - Or deploy the `dist` folder to a static host (like Vercel, Netlify, or GitHub Pages).

2. **Access on Android:**
   - Ensure your Android device is on the **same Wi-Fi network** as your PC.
   - Open Chrome on Android and enter your PC's local IP address and port (e.g., `http://192.168.1.X:5173`).
   
3. **Install:**
   - Tap the browser menu (three dots in the top right).
   - Select **"Add to Home Screen"** or **"Install App"**.
   - The Steak Timer will now appear in your app drawer and run like a native app.

### Method 2: Local Network Access (Temporary)
If you just want to use it once without installing:

1. On your PC terminal, run:
   ```bash
   npm run dev -- --host
   ```
2. The terminal will display a "Network" URL (e.g., `http://192.168.1.5:5173`).
3. Open this URL in your Android browser.