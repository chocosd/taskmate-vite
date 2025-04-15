import { ReactNode } from "react"

type ButtonProps = {
    children: ReactNode,
    action?: () => void,
    classes?: string,
    type?: "button" | "submit" | "reset"
  }
  
  export default function Button({ action, classes = "", type = "button", children }: ButtonProps) {
    const baseClasses =
      "px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
  
    return (
      <button className={`${baseClasses} ${classes}`} onClick={action} type={type}>
        {children}
      </button>
    )
  }