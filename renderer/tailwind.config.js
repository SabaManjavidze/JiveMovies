const withOpacity = (varName) => {
  return ({ opacityValue }) => {
    if (opacityValue) return `rgba(var(${varName}),${opacityValue})`;
    return `rgba(var(${varName}))`;
  };
};
module.exports = {
  content: [
    "./renderer/pages/**/*.{js,ts,jsx,tsx}",
    "./renderer/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        wiggle: "wiggle 0.4s ease-in-out",
        scale: "scale 0.7s ease-in-out",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-9deg)" },
          "50%": { transform: "rotate(9deg)" },
        },
        scale: {
          "0%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      },
      colors: {
        primary: withOpacity("--color-palette-primary"),
        "light-primary": withOpacity("--color-palette-light-primary"),
        "light-secondary": withOpacity("--color-palette-light-secondary"),
        secondary: withOpacity("--color-palette-secondary"),
        danger: withOpacity("--color-palette-danger"),
        disable: withOpacity("--color-palette-disable"),
      },
      textColor: {
        skin: {
          base: withOpacity("--color-text-base"),
          like: withOpacity("--color-palette-primary"),
          dislike: withOpacity("--color-palette-danger"),
          "button-accent": withOpacity("--color-palette-primary"),
          "submit-btn": withOpacity("--color-palette-light-primary"),
          "attach-btn": withOpacity("--color-palette-light-secondary"),
        },
      },
      backgroundColor: {
        skin: {
          main: withOpacity("--color-background-main"),
          "loading-bar": withOpacity("--color-palette-primary"),
          "post-card": withOpacity("--color-background-secondary"),
          "comment-card": withOpacity("--color-background-secondary"),
          "input-field": withOpacity("--color-background-secondary"),
          navbar: withOpacity("--color-background-secondary"),
          secondary: withOpacity("--color-background-secondary"),
          "submit-btn": withOpacity("--color-palette-primary"),
          "attach-btn": withOpacity("--color-palette-secondary"),
        },
      },
      borderColor: {
        skin: {
          "input-field": withOpacity("--color-palette-primary"),
          button: withOpacity("--color-palette-primary"),
          "submit-btn": withOpacity("--color-palette-primary"),
          "attach-btn": withOpacity("--color-palette-secondary"),
        },
      },
      fontFamily: {
        sans: ["Virgil"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
