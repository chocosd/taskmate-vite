import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@components': resolve(__dirname, 'src/components'),
            '@ui': resolve(__dirname, 'src/components/ui'),
            '@layouts': resolve(__dirname, 'src/layouts'),
            '@pages': resolve(__dirname, 'src/pages'),
            '@enums': resolve(__dirname, 'src/enums'),
            '@hooks': resolve(__dirname, 'src/hooks'),
            '@lib': resolve(__dirname, 'src/lib'),
            '@state': resolve(__dirname, 'src/state'),
            '@models': resolve(__dirname, 'src/models'),
            '@router': resolve(__dirname, 'src/router'),
            '@routes': resolve(__dirname, 'src/routes'),
            '@utils': resolve(__dirname, 'src/utils'),
            '@context': resolve(__dirname, 'src/context'),
            '@styles': resolve(__dirname, 'src/styles'),
            '@services': resolve(__dirname, 'src/services'),
        },
    },
});
