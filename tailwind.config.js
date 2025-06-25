/** @type {import('tailwindcss').Config} */
export const content = [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
    extend: {
        minHeight: {
            'calendar-cell': '90px',
            'calendar-cell-sm': '60px',
        },
        maxWidth: {
            'calendar': '48rem',
        },
        animation: {
            'fadeIn': 'fadeIn 0.2s ease-in-out',
            'gradient-x': 'gradient-x 15s ease infinite',
            'slide-up': 'slide-up 0.2s ease-out',
            'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
        },
        keyframes: {
            fadeIn: {
                '0%': { opacity: '0', transform: 'scale(0.95)' },
                '100%': { opacity: '1', transform: 'scale(1)' },
            },
            'gradient-x': {
                '0%, 100%': {
                    'background-size': '200% 200%',
                    'background-position': 'left center'
                },
                '50%': {
                    'background-size': '200% 200%',
                    'background-position': 'right center'
                },
            },
            'slide-up': {
                from: {
                    opacity: '0',
                    transform: 'translateY(10px)'
                },
                to: {
                    opacity: '1',
                    transform: 'translateY(0)'
                }
            },
            'pulse-gentle': {
                '0%, 100%': {
                    opacity: '1',
                },
                '50%': {
                    opacity: '.8',
                },
            }
        },
    },
};
export const plugins = [];
export const darkMode = 'class'; // Enable class-based dark mode
