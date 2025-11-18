module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      backgroundColor: {
        'black-theme': '#000000',
        'white-theme': '#ffffff',
      },
      textColor: {
        'black-theme': '#ffffff',
        'white-theme': '#222222',
      },
    },
  },
  plugins: [],
};
