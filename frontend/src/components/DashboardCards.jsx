import { useEffect, useState } from "react";
import API from "../services/api";

import {
  FileText,
  CheckCircle,
  Loader,
  AlertCircle,
  HardDrive,
  MessageSquare,
  BookOpen,
  Tags,
} from "lucide-react";

export default function DashboardCards() {
  const [stats, setStats] = useState(null);

  const loadDashboard = async () => {
    try {
      const res = await API.get(
        "/analytics/dashboard"
      );

      setStats(res.data);
    } catch (err) {
      console.error(
        "Dashboard loading failed:",
        err
      );
    }
  };

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(
      loadDashboard,
      5000
    );

    return () =>
      clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl h-40 animate-pulse border border-slate-200"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Documents",
      value: stats.total_documents ?? 0,
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Ready",
      value: stats.ready_documents ?? 0,
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Processing",
      value:
        stats.processing_documents ?? 0,
      icon: Loader,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Failed",
      value: stats.failed_documents ?? 0,
      icon: AlertCircle,
      color: "from-red-500 to-pink-500",
    },
    {
      title: "Storage",
      value: `${stats.storage_used_mb ?? 0} MB`,
      icon: HardDrive,
      color: "from-violet-500 to-indigo-500",
    },
    {
      title: "Chats",
      value: stats.total_chats ?? 0,
      icon: MessageSquare,
      color: "from-sky-500 to-blue-500",
    },
    {
      title: "Study Notes",
      value: stats.total_notes ?? 0,
      icon: BookOpen,
      color: "from-teal-500 to-green-500",
    },
    {
      title: "AI Tags",
      value: stats.total_tags ?? 0,
      icon: Tags,
      color: "from-fuchsia-500 to-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="
              group
              bg-white
              rounded-3xl
              border
              border-slate-200
              p-6
              shadow-sm
              hover:shadow-2xl
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500 text-sm font-medium">
                  {card.title}
                </p>

                <h2 className="text-4xl font-bold text-slate-900 mt-3">
                  {card.value}
                </h2>

              </div>

              <div
                className={`
                  w-14
                  h-14
                  rounded-2xl
                  bg-gradient-to-r
                  ${card.color}
                  flex
                  items-center
                  justify-center
                  shadow-lg
                `}
              >
                <Icon
                  size={26}
                  className="text-white"
                />
              </div>

            </div>

            <div className="mt-5 h-1 w-full bg-slate-100 rounded-full overflow-hidden">

              <div
                className={`
                  h-full
                  bg-gradient-to-r
                  ${card.color}
                `}
              />

            </div>

          </div>
        );
      })}
    </div>
  );
}