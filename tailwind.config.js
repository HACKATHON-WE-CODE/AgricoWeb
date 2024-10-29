/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Chemin vers tous vos fichiers dans le dossier src (y compris TypeScript)
    "./pages/**/*.{js,ts,jsx,tsx}", // Chemin vers les pages
    "./components/**/*.{js,ts,jsx,tsx}" // Chemin vers les composants
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
