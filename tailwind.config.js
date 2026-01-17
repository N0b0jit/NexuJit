/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                heading: ['Plus Jakarta Sans', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
            },
            colors: {
                accent: "var(--accent)",
                "bg-primary": "var(--bg-primary)",
                "bg-secondary": "var(--bg-secondary)",
                "bg-tertiary": "var(--bg-tertiary)",
                "fg-primary": "var(--fg-primary)",
                "fg-secondary": "var(--fg-secondary)",
                "fg-tertiary": "var(--fg-tertiary)",
                "border-subtle": "var(--border-subtle)",
                "border-strong": "var(--border-strong)",
            },
            borderRadius: {
                none: "0",
                sm: "var(--radius-sm)",
                md: "var(--radius-md)",
                lg: "var(--radius-lg)",
                xl: "var(--radius-xl)",
            },
        },
    },
    plugins: [],
    darkMode: 'class',
}
