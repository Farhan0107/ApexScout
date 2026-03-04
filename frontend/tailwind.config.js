/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#E2FF66', // Neon Lime
                    dark: '#CCFF00',
                },
                accent: {
                    DEFAULT: '#22D3EE', // Cyan
                },
                background: '#0a0a0c', // Darker, richer black for better contrast
                surface: '#121216',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 12s ease-in-out infinite',
                'float-delayed': 'float 12s ease-in-out 6s infinite',
                'glow': 'glow 3s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translate(0, 0)' },
                    '50%': { transform: 'translate(30px, -30px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 20px rgba(226, 255, 102, 0.2)' },
                    '100%': { boxShadow: '0 0 40px rgba(226, 255, 102, 0.4)' },
                }
            },
            boxShadow: {
                'neon-lime': '0 0 20px rgba(226, 255, 102, 0.3)',
                'neon-cyan': '0 0 20px rgba(34, 211, 238, 0.3)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            },
            backgroundImage: {
                'radial-gradient': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],



}
