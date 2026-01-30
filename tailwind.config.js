/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            borderRadius: {
                DEFAULT: '0px',
                'sm': '2px',
                'md': '0px',
                'lg': '0px',
                'xl': '0px',
                '2xl': '0px',
                '3xl': '0px',
                'full': '9999px', // Keep full for avatars/circles
            },
            fontFamily: {
                sans: ['"Be Vietnam Pro"', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
            },
            colors: {
                primary: '#C5A059',      // Gold
                secondary: '#8B0000',    // Dark Red
                'neutral-brown': '#4A3B32', // Earth Brown
                dark: '#1A1A1A',         // Black text
                light: '#FFFFFF',        // White bg
                paper: '#F9F9F7',        // Magazine Paper
                ink: '#1a1a1a',          // Printing Ink
                'border-light': '#e5e5e5' // Hairline
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
