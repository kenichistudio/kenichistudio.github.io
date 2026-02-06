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
                hand: ['Kalam', 'cursive'],
            },
            colors: {
                // Site Colors (Marketing Pages)
                site: {
                    bg: {
                        primary: 'var(--site-bg-primary)',
                        secondary: 'var(--site-bg-secondary)',
                        tertiary: 'var(--site-bg-tertiary)',
                    },
                    text: {
                        primary: 'var(--site-text-primary)',
                        secondary: 'var(--site-text-secondary)',
                        tertiary: 'var(--site-text-tertiary)',
                    },
                    border: {
                        primary: 'var(--site-border-primary)',
                        secondary: 'var(--site-border-secondary)',
                    },
                    accent: {
                        primary: 'var(--site-accent-primary)',
                        hover: 'var(--site-accent-hover)',
                        light: 'var(--site-accent-light)',
                    },
                    'accent-secondary': {
                        DEFAULT: 'var(--site-accent-secondary)',
                        light: 'var(--site-accent-secondary-light)',
                    },
                },
                
                // App Colors (Studio Applications)
                app: {
                    bg: {
                        primary: 'var(--app-bg-primary)',
                        secondary: 'var(--app-bg-secondary)',
                        tertiary: 'var(--app-bg-tertiary)',
                    },
                    text: {
                        primary: 'var(--app-text-primary)',
                        secondary: 'var(--app-text-secondary)',
                        tertiary: 'var(--app-text-tertiary)',
                    },
                    border: {
                        primary: 'var(--app-border-primary)',
                        secondary: 'var(--app-border-secondary)',
                    },
                    accent: {
                        primary: 'var(--app-accent-primary)',
                        hover: 'var(--app-accent-hover)',
                    },
                    'accent-secondary': {
                        DEFAULT: 'var(--app-accent-secondary)',
                        hover: 'var(--app-accent-secondary-hover)',
                    },
                },
                
                // Legacy tokens (backward compatibility)
                primary: {
                    DEFAULT: 'var(--site-accent-primary)',
                    hover: 'var(--site-accent-hover)',
                    light: 'var(--site-accent-light)',
                },
                accent: {
                    DEFAULT: 'var(--app-accent-secondary)',
                    hover: 'var(--app-accent-secondary-hover)',
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
