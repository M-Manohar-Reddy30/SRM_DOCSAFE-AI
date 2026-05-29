import { useEffect, useState } from "react";
import API from "../services/api";

export default function DashboardCards() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await API.get("/analytics/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) {
    return <p className="text-white">Loading...</p>;
  }

  return (
    <div className="grid grid-cols-4 gap-6">

      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-slate-400">Documents</h3>
        <p className="text-3xl font-bold text-white">
          {stats.total_documents}
        </p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-slate-400">Storage</h3>
        <p className="text-3xl font-bold text-white">
          {stats.storage_used_mb} MB
        </p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-slate-400">Notes</h3>
        <p className="text-3xl font-bold text-white">
          {stats.total_notes}
        </p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-slate-400">Chats</h3>
        <p className="text-3xl font-bold text-white">
          {stats.total_chats}
        </p>
      </div>

    </div>
  );
}