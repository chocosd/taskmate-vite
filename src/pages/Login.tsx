import { useAuth } from "@hooks/useAuth.hooks";
import Button from "@ui/Button";
import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(email);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-white">
      {/* Left Side - Branding */}
      <div className="hidden md:flex relative w-3/5 text-white overflow-hidden">
        {/* Skewed background layer */}
        <div className="absolute inset-0 z-0 clip-right bg-[#00aeff] clip-reveal"></div>

        {/* Actual content inside */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-10">
            <h1 className="text-4xl font-bold mb-4">Welcome to Taskmate</h1>
            <p className="text-lg max-w-md text-center">
            Manage your tasks with your mate. Stay productive. Stay on track.
            </p>
            <div className="mt-8">
            <img src="/taskmate-logo.png" alt="Taskmate logo" className="w-32 h-auto" />
            </div>
        </div>
        </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 py-16">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-semibold mb-6">Log in to Taskmate</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <Button type="submit">
                Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
