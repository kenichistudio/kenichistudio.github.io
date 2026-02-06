/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
        '!./src/**/node_modules/**'
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                hand: ['Kalam', 'cursive'], // For that hand-drawn feel
            },
            colors: {
                primary: {
                    DEFAULT: '#3B82F6', // Blue-500
                    hover: '#2563EB',   // Blue-600
                    light: '#60A5FA',   // Blue-400
                    subtle: '#93C5FD',  // Blue-300


















                },


                app: {
                    bg: 'hsl(var(--app-bg) / <alpha-value>)',
                    surface: 'hsl(var(--app-surface) / <alpha-value>)',
                    'surface-hover': 'hsl(var(--app-surface-hover) / <alpha-value>)',
                    border: 'hsl(var(--app-border) / <alpha-value>)',
                    text: {
                        primary: 'hsl(var(--app-text-primary) / <alpha-value>)',
                        secondary: 'hsl(var(--app-text-secondary) / <alpha-value>)',
                    },
                    // Light Mode Variants (specifically for Studio Light Mode)
                    light: {
                        bg: 'hsl(var(--app-light-bg) / <alpha-value>)',
                        surface: 'hsl(var(--app-light-surface) / <alpha-value>)',
                        border: 'hsl(var(--app-light-border) / <alpha-value>)',
                        'surface-hover': 'hsl(var(--app-light-surface-hover) / <alpha-value>)',
                        text: {
                            primary: 'hsl(var(--app-light-text-primary) / <alpha-value>)',
                            secondary: 'hsl(var(--app-light-text-secondary) / <alpha-value>)',
                        }
                    }
               },
                // Unified Accent System
                accent: {
                    DEFAULT: '#EAB308', // Yellow-500
                    hover: '#CA8A04',   // Yellow-600
                    light: '#FACC15',   // Yellow-400
                    subtle: '#FDE047',  // Yellow-300
                },
            },
            animation: {
                blob: "blob 7s infinite",
            },
            keyframes: {
                blob: {
                    "0%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                    "33%": {
                        transform: "translate(30px, -50px) scale(1.1)",
                    },
                    "66%": {
                        transform: "translate(-20px, 20px) scale(0.9)",
                    },
                    "100%": {
                        transform: "translate(0px, 0px) scale(1)",
                    },
                },
            },
        },
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities({
                ".animation-delay-2000": {
                    "animation-delay": "2s",
                },
                ".animation-delay-4000": {
                    "animation-delay": "4s",
                },
            });
        },
    ],
};