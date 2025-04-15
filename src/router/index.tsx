import Root from "@layouts/Root";
import About from "@pages/About";
import Dashboard from "@pages/Dashboard";
import Login from "@pages/Login";
import ProtectedRoute from "@routes/ProtectedRoute";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
          <Route path="about" element={<About />}/>
          <Route path="login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
      </Route>
    )
  )