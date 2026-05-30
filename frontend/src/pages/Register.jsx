import { useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  UserPlus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import { register } from "../services/authService";
import toast from "react-hot-toast";

export default function Register() {
  const navigate =
    useNavigate();

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleRegister = async () => {
    if (
      !fullName ||
      !email ||
      !password
    ) {
     toast.error(
        "Please fill all fields"
      );
      return;
    }

    try {
      setLoading(true);

      await register(
        fullName,
        email,
        password
      );

      toast.success(
        "Account created successfully"
      );

      navigate("/");

    } catch (err) {

      console.error(err);

      toast.error(
        err?.response?.data
          ?.detail ||
          "Registration failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Left Section */}

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white p-16 flex-col justify-between">

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
            Your intelligent document companion.
          </p>

        </div>

        <div>

          <h2 className="text-5xl font-bold leading-tight">
            Create
            <br />
            Your AI Workspace
          </h2>

          <p className="mt-6 text-lg opacity-90">
            Upload, organize, summarize and interact with documents using AI.
          </p>

        </div>

      </div>

      {/* Right Section */}

      <div className="flex-1 flex items-center justify-center p-8">

        <div className="w-full max-w-md">

          <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-xl">

            <div className="flex items-center gap-3 mb-3">

              <UserPlus
                size={30}
                className="text-emerald-600"
              />

              <h2 className="text-4xl font-bold text-slate-900">
                Create Account
              </h2>

            </div>

            <p className="text-slate-500 mb-8">
              Start your AI-powered document journey.
            </p>

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) =>
                  setFullName(
                    e.target.value
                  )
                }
                placeholder="Enter your full name"
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
                  focus:ring-emerald-500
                  focus:border-emerald-500
                  transition-all
                  duration-300
                "
              />

            </div>

            <div className="mt-5">

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
                  focus:ring-emerald-500
                  focus:border-emerald-500
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
                placeholder="Create a password"
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
                  focus:ring-emerald-500
                  focus:border-emerald-500
                  transition-all
                  duration-300
                "
              />

            </div>

            <button
              onClick={
                handleRegister
              }
              disabled={
                loading
              }
              className="
                mt-8
                w-full
                bg-emerald-600
                hover:bg-emerald-700
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
                ? "Creating Account..."
                : "Create Account"}

              {!loading && (
                <ArrowRight
                  size={18}
                />
              )}

            </button>

            <p className="text-center text-slate-500 mt-6">

              Already have an account?{" "}

              <Link
                to="/"
                className="text-emerald-600 font-semibold"
              >
                Sign In
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}