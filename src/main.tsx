import ToastRenderer from '@components/ui/ToastRenderer.tsx';
import AuthProvider from '@context/auth/AuthProvider.tsx';
import ThemeProvider from '@context/theme/ThemeProvider.tsx';
import { ToastProvider } from '@context/toast/ToastProvider.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        {/* <SharedWindowProvider> */}
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <ToastRenderer />
                    {/* <ProximityCanvasOverlay /> */}

                    <App />
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
        {/* </SharedWindowProvider> */}
    </StrictMode>
);
