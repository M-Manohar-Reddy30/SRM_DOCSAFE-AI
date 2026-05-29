import { Link } from "react-router-dom";

export default function Sidebar() {

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="w-64 bg-slate-800 min-h-screen p-6 flex flex-col justify-between">

      <div>

        <h1 className="text-2xl font-bold text-white mb-10">
          SrmDocSafe AI
        </h1>

        <div className="space-y-4">

          <Link
            to="/dashboard"
            className="block text-slate-300 hover:text-white"
          >
            Dashboard
          </Link>

          <button
            className="w-full text-left text-slate-300 hover:text-white"
          >
            Documents
          </button>

          <button
            className="w-full text-left text-slate-300 hover:text-white"
          >
            AI Chat
          </button>

          <button
            className="w-full text-left text-slate-300 hover:text-white"
          >
            Analytics
          </button>

        </div>

      </div>

      <div>

        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 p-3 rounded text-white font-semibold"
        >
          Logout
        </button>

      </div>

    </div>
  );
}