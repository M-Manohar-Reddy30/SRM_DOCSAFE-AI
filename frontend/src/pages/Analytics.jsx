import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/DashboardCards";
import AnalyticsCharts from "../components/AnalyticsCharts";

import API from "../services/api";

export default function Analytics() {
  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const loadAnalytics = async () => {
    try {
      const res = await API.get(
        "/analytics/dashboard"
      );

      setAnalytics(res.data);

    } catch (err) {

      console.error(
        "Analytics loading failed:",
        err
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    loadAnalytics();

    const interval =
      setInterval(
        loadAnalytics,
        5000
      );

    return () =>
      clearInterval(interval);

  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">

        <Sidebar />

        <main className="flex-1 p-10">

          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-10">

            <h1 className="text-5xl font-bold text-slate-900">
              Analytics 📊
            </h1>

            <p className="text-slate-500 mt-3">
              Loading analytics dashboard...
            </p>

          </div>

        </main>

      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex min-h-screen bg-slate-50">

        <Sidebar />

        <main className="flex-1 p-10">

          <div className="bg-white rounded-[32px] border border-red-200 shadow-sm p-10">

            <h1 className="text-5xl font-bold text-slate-900">
              Analytics 📊
            </h1>

            <p className="text-red-500 mt-3">
              Failed to load analytics data.
            </p>

          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar />

      <main className="flex-1 overflow-auto">

        <div className="p-10">

          {/* Hero Section */}

          <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm p-8 mb-8">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div>

                <h1 className="text-5xl font-bold text-slate-900">
                  Analytics 📊
                </h1>

                <p className="text-slate-500 text-lg mt-3">
                  Monitor document intelligence, AI activity,
                  storage usage and processing performance.
                </p>

              </div>

              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-3xl px-8 py-6 shadow-xl">

                <p className="text-sm opacity-90">
                  AI Insights
                </p>

                <h3 className="text-2xl font-bold mt-1">
                  Real-Time Analytics
                </h3>

              </div>

            </div>

          </div>

          {/* Statistics Cards */}

          <div className="mb-8">

            <DashboardCards />

          </div>

          {/* Charts */}

          <AnalyticsCharts
            analytics={analytics}
          />

          {/* Insights Section */}

          <div className="grid lg:grid-cols-3 gap-6 mt-8">

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Total Documents
              </h3>

              <p className="text-4xl font-bold text-violet-600">
                {analytics.total_documents ?? 0}
              </p>

            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Storage Used
              </h3>

              <p className="text-4xl font-bold text-indigo-600">
                {analytics.storage_used_mb ?? 0} MB
              </p>

            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">

              <h3 className="text-lg font-bold text-slate-900 mb-2">
                AI Activity
              </h3>

              <p className="text-4xl font-bold text-emerald-600">
                {(analytics.total_chats ?? 0) +
                  (analytics.total_notes ?? 0)}
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}