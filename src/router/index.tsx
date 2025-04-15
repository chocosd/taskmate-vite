import Root from '@layouts/Root';
import About from '@pages/About';
import Dashboard from '@pages/Dashboard';
import Login from '@pages/Login';
import ProtectedRoute from '@routes/ProtectedRoute';
import { Routes } from '@routes/routes.enum';
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root />}>
            <Route path={Routes.About} element={<About />} />
            <Route path={Routes.Login} element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route path={Routes.Dashboard} element={<Dashboard />} />
            </Route>
        </Route>
    )
);
