/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Be Vietnam Pro"', 'sans-serif'],
                serif: ['"Be Vietnam Pro"', 'sans-serif'], // Override serif to avoid font errors
            },
            colors: {
                primary: '#C5A059',      // Gold
                secondary: '#8B0000',    // Dark Red
                'neutral-brown': '#4A3B32', // Earth Brown
                dark: '#1A1A1A',         // Black text
                light: '#FFFFFF',        // White bg
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
