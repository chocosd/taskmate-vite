import ProximityCanvasOverlay from '@components/ProximityCanvasOverlay.tsx';
import ToastRenderer from '@components/ui/ToastRenderer.tsx';
import AuthProvider from '@context/AuthProvider.tsx';
import { SharedWindowProvider } from '@context/SharedWindowProvider.tsx';
import ThemeProvider from '@context/ThemeProvider.tsx';
import { ToastProvider } from '@context/ToastProvider.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SharedWindowProvider>
            <ThemeProvider>
                <ToastProvider>
                    <AuthProvider>
                        <ToastRenderer />
                        <ProximityCanvasOverlay />

                        <App />
                    </AuthProvider>
                </ToastProvider>
            </ThemeProvider>
        </SharedWindowProvider>
    </StrictMode>
);
