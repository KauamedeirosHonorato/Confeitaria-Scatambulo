/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
        colors: {
            scatambulo: {
                red: '#7f1d1d',
                dark: '#450a0a',
                gold: '#d4af37',
                goldlight: '#f3e5ab',
                cream: '#fffbf7'
            }
        },
        backgroundImage: {
            'paper-texture': "linear-gradient(to bottom right, #fffbf7, #fff0f0)",
            'shimmer': "linear-gradient(45deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 60%)"
        },
        animation: {
            'float': 'float 6s ease-in-out infinite',
            'fade-in-down': 'fadeInDown 1s ease-out forwards',
            'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        keyframes: {
            float: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' },
            },
            fadeInDown: {
                '0%': { opacity: '0', transform: 'translateY(-20px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' },
            }
        },
        screens: {
            'xs': '375px',
        }
    }
  },
  plugins: [],
}
