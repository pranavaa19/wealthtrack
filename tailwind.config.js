/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'gold-main': '#D4AF37',       // Classic Gold
                'gold-light': '#F4E5B0',      // Light Gold background/accent
                'gold-dim': '#BFA356',        // Muted Gold
                'sidebar-bg': '#2C3E50',      // Dark Slate Blue/Grey for sidebar
                'sidebar-hover': '#34495E',
                'bg-main': '#F8F9FA',         // Light Grey/White for main content
                'text-dark': '#2C3E50',       // Main text color
                'text-light': '#95A5A6',      // Secondary text color
                'success-green': '#2ECC71',
                'bg-white': '#FFFFFF',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'gold': '0 4px 14px 0 rgba(212, 175, 55, 0.39)',
            },
        },
    },
    plugins: [],
}
