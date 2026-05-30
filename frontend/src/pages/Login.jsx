import { useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { login } from "../services/authService";
import toast from "react-hot-toast";

export default function Login() {
  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error(
        "Please enter email and password"
      );
      return;
    }

    try {
      setLoading(true);

      const data =
        await login(
          email,
          password
        );

      localStorage.setItem(
        "token",
        data.access_token
      );

      toast.success(
        "Login successful"
      );

      navigate(
        "/dashboard"
      );

    } catch (err) {

      console.error(err);

      toast.error(
        err?.response?.data?.detail ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Left Side */}

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 text-white p-16 flex-col justify-between">

        <div>

          <div className="flex items-center gap-3">

            <ShieldCheck
              size={34}
            />

            <h1 className="text-3xl font-bold">
              SrmDocSafe AI
            </h1>

          </div>

          <p className="mt-6 text-xl opacity-90 leading-8">
            Transform your documents into intelligent knowledge.
          </p>

        </div>

        <div>

          <h2 className="text-5xl font-bold leading-tight">
            Smart Document
            <br />
            Intelligence Platform
          </h2>

          <p className="mt-6 text-lg opacity-90">
            Upload, summarize, search, chat and learn from documents using AI.
          </p>

        </div>

      </div>

      {/* Right Side */}

      <div className="flex-1 flex items-center justify-center p-8">

        <div className="w-full max-w-md">

          <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-xl">

            <h2 className="text-4xl font-bold text-slate-900">
              Welcome Back
            </h2>

            <p className="text-slate-500 mt-3">
              Sign in to continue using SrmDocSafe AI.
            </p>

            <div className="mt-8">

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
                placeholder="Enter your email"
                className="
                  w-full
                  p-4
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                  text-slate-900
                  placeholder:text-slate-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-violet-500
                  focus:border-violet-500
                  transition-all
                  duration-300
                "
              />

            </div>

            <div className="mt-5">

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter your password"
                  className="
                    w-full
                    p-4
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    text-slate-900
                    placeholder:text-slate-400
                    focus:outline-none
                    focus:ring-2
                    focus:ring-violet-500
                    focus:border-violet-500
                    transition-all
                    duration-300
                  "
                />

            </div>

            <button
              onClick={
                handleLogin
              }
              disabled={
                loading
              }
              className="
                mt-8
                w-full
                bg-violet-600
                hover:bg-violet-700
                text-white
                py-4
                rounded-2xl
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition-all
              "
            >

              {loading
                ? "Signing In..."
                : "Sign In"}

              {!loading && (
                <ArrowRight
                  size={18}
                />
              )}

            </button>

            <p className="text-center text-slate-500 mt-6">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="text-violet-600 font-semibold"
              >
                Create Account
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}