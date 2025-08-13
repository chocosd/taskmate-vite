import { I18nProvider } from '@providers/I18nProvider';
import { router } from '@router/index';
import { RouterProvider } from 'react-router-dom';
import './App.css';

export default function App() {
    return (
        <I18nProvider>
            <RouterProvider router={router} />
        </I18nProvider>
    );
}
