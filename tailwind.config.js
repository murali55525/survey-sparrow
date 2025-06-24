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
        },
        keyframes: {
            fadeIn: {
                '0%': { opacity: '0', transform: 'scale(0.95)' },
                '100%': { opacity: '1', transform: 'scale(1)' },
            },
        },
    },
};
export const plugins = [];
