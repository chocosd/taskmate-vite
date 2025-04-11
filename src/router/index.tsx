import Root from "@layouts/Root";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

export const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}/>
    )
  )