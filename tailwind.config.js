/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0F',
        sur: '#13131A',
        sur2: '#1C1C28',
        bor: '#2A2A38',
        pri: '#5B4FE8',
        grn: '#10B981',
        mut: '#6B6B80',
        fg: '#F0F0F8',
        red: '#EF4444',
        amber: '#FBB147',
        emerald: '#34D399',
      },
    },
  },
};
