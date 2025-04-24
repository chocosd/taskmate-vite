import TaskView from '@components/tasks/task-view/TaskView';
import Root from '@layouts/Root';
import About from '@pages/About';
import Dashboard from '@pages/Dashboard';
import Login from '@pages/Login';
import Profile from '@pages/Profile';
import ProtectedRoute from '@routes/ProtectedRoute';
import { Routes } from '@routes/routes.enum';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Navigate,
    Route,
} from 'react-router-dom';

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root />}>
            <Route
                index
                element={
                    <Navigate to={`/${Routes.Dashboard}`} replace />
                }
            />
            <Route path={Routes.About} element={<About />} />
            <Route path={Routes.Login} element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route
                    path={Routes.Dashboard}
                    element={<Dashboard />}
                >
                    <Route index element={<TaskView />} />
                    <Route path=":taskId" element={<TaskView />} />
                </Route>
            </Route>
            <Route path={Routes.Profile} element={<Profile />} />
        </Route>
    )
);
