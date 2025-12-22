# Zeina Health - Premium Setup Instructions

This project is a React-based web application with premium animations.

### 1. Prerequisite
Ensure you have [Node.js](https://nodejs.org/) installed on your computer.

### 2. Local Setup in VS Code
1. Open Visual Studio Code.
2. Open the folder containing these files.
3. Open a new Terminal in VS Code (`Ctrl + ` or `Terminal > New Terminal`).
4. Run the following command to install all dependencies (including `framer-motion`):
   ```bash
   npm install
   ```
5. Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   API_KEY=your_gemini_api_key_here
   ```

### 3. Run the App
Run this command to start the development server:
```bash
npm run dev
```

### 4. Troubleshooting Framer Motion
If you still see errors related to `framer-motion`, run this specific command:
```bash
npm install framer-motion lucide-react react-router-dom @google/genai
```
