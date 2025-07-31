import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{ts,tsx}',
        './src/**/*.css',
        './src/**/*.module.css',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};

export default config;
