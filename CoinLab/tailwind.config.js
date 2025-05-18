/** @type {import('tailwindcss').Config} */
module.exports = {
  // Include the paths to all of your component files
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#26318A',
        background: '#FFFFFF',
        text: '#000000',
        navBar: '#24252A',
        white: '#FFFFFF',
        lightGray: '#F5F5F5',
        mediumGray: '#AAAAAA',
        error: '#FF3B30',
        danger: '#FF3B30',
        success: '#34C759',
        warning: '#FFCC00',
        textLight: '#666666',
      }
    },
  },
  plugins: [],
}

