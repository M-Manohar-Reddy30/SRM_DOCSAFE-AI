import { useEffect, useState } from "react";
import API from "../services/api";

export default function SummaryModal({
  documentId,
  onClose,
}) {
  const [summary, setSummary] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const res = await API.get(
        `/ai/${documentId}/summary`
      );

      setSummary(res.data);

    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.detail ||
        "Summary not found"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">

      <div className="bg-slate-800 p-6 rounded-xl w-[700px] max-h-[80vh] overflow-y-auto">

        <div className="flex justify-between mb-4">

          <h2 className="text-2xl text-white">
            AI Summary
          </h2>

          <button
            onClick={onClose}
            className="text-red-400"
          >
            X
          </button>

        </div>

        {loading ? (
          <p className="text-white">
            Loading...
          </p>
        ) : summary ? (
          <>

            <h3 className="text-green-400 font-bold">
              Short Summary
            </h3>

            <p className="text-white mb-4">
              {summary.short_summary}
            </p>

            <h3 className="text-blue-400 font-bold">
              Detailed Summary
            </h3>

            <p className="text-white mb-4">
              {summary.detailed_summary}
            </p>

            <h3 className="text-yellow-400 font-bold">
              Key Points
            </h3>

            <ul className="list-disc pl-6 text-white">

              {summary.bullet_points?.map(
                (point, index) => (
                  <li key={index}>
                    {point}
                  </li>
                )
              )}

            </ul>

          </>
        ) : null}

      </div>

    </div>
  );
}