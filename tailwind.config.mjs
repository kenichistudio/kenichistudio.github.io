/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                hand: ['Kalam', 'cursive'], // For that hand-drawn feel
            },
            colors: {
                primary: '#3b82f6',
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
