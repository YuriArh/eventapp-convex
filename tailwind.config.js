import { heroui } from '@heroui/theme'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './app/shared/**/*.{js,ts,jsx,tsx,mdx}',
    './app/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './app/routes/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [heroui()],
}
