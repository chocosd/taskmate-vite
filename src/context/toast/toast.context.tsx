import { createContext } from "react";
import { ToastContextType } from "./toast-context.model";

export const ToastContext = createContext<ToastContextType | undefined>(undefined);