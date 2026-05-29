import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

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
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await register(
        fullName,
        email,
        password
      );

      alert(
        "Account created successfully"
      );

      navigate("/");

    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.detail ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center">

      <div className="bg-slate-800 p-8 rounded-2xl w-96">

        <h1 className="text-3xl font-bold text-white mb-2">
          Create Account
        </h1>

        <p className="text-slate-400 mb-6">
          Join SrmDocSafe AI
        </p>

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) =>
            setFullName(
              e.target.value
            )
          }
          className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 p-3 rounded text-white font-semibold"
        >
          {loading
            ? "Creating Account..."
            : "Register"}
        </button>

        <p className="text-center text-slate-400 mt-4">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-indigo-400"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}