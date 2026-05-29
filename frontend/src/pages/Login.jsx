import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const data = await login(email, password);

      localStorage.setItem(
        "token",
        data.access_token
      );

      alert("Login Successful");

      navigate("/dashboard");

    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.detail ||
        "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center">

      <div className="bg-slate-800 p-8 rounded-2xl w-96 shadow-xl">

        <h1 className="text-3xl font-bold text-white mb-2">
          SrmDocSafe AI
        </h1>

        <p className="text-slate-400 mb-6">
          Login to your account
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-slate-700 text-white outline-none"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-slate-700 text-white outline-none"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 p-3 rounded text-white font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-slate-400 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-400"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}