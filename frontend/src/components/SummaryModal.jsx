import { useEffect, useState } from "react";
import API from "../services/api";

import {
Sparkles,
FileText,
ListChecks,
X,
Copy,
Check,
} from "lucide-react";

export default function SummaryModal({
documentId,
onClose,
}) {
const [summary, setSummary] =
useState(null);

const [loading, setLoading] =
useState(true);

const [copied, setCopied] =
useState(false);

useEffect(() => {
loadSummary();

const handleEscape = (e) => {
  if (e.key === "Escape") {
    onClose();
  }
};

window.addEventListener(
  "keydown",
  handleEscape
);

return () =>
  window.removeEventListener(
    "keydown",
    handleEscape
  );

}, []);

const loadSummary = async () => {
try {
const res = await API.get(
`/ai/${documentId}/summary`
);

  setSummary(res.data);

} catch (err) {

  console.error(err);

} finally {

  setLoading(false);

}

};

const copySummary = async () => {
if (!summary) return;

const text =
  `
Executive Summary:

${summary.short_summary}

Detailed Summary:

${summary.detailed_summary}

Key Points:

${summary.bullet_points?.join("\n")}
`;

await navigator.clipboard.writeText(
  text
);

setCopied(true);

setTimeout(() => {
  setCopied(false);
}, 2000);

};

return ( <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">

  <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[32px] border border-slate-200 shadow-2xl">

    {/* Header */}

    <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">

      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center">

          <Sparkles
            size={24}
            className="text-white"
          />

        </div>

        <div>

          <h2 className="text-3xl font-bold text-slate-900">
            AI Summary
          </h2>

          <p className="text-slate-500">
            Intelligent document insights
          </p>

        </div>

      </div>

      <div className="flex items-center gap-3">

        {!loading &&
          summary && (
            <button
              onClick={
                copySummary
              }
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-xl
                bg-violet-100
                text-violet-700
                hover:bg-violet-200
                transition-all
              "
            >
              {copied ? (
                <Check
                  size={16}
                />
              ) : (
                <Copy
                  size={16}
                />
              )}

              {copied
                ? "Copied"
                : "Copy"}
            </button>
          )}

        <button
          onClick={
            onClose
          }
          className="
            w-10
            h-10
            rounded-xl
            bg-slate-100
            hover:bg-red-100
            hover:text-red-600
            flex
            items-center
            justify-center
            transition-all
          "
        >
          <X size={18} />
        </button>

      </div>

    </div>

    {/* Content */}

    <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-8">

      {loading ? (

        <div className="flex flex-col items-center justify-center py-20">

          <div className="w-14 h-14 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin"></div>

          <p className="text-slate-500 mt-6">
            Generating AI Summary...
          </p>

        </div>

      ) : !summary ? (

        <div className="text-center py-20">

          <FileText
            size={70}
            className="mx-auto text-slate-300 mb-5"
          />

          <h3 className="text-2xl font-bold text-slate-900">
            Summary Not Available
          </h3>

          <p className="text-slate-500 mt-3">
            AI summary has not been generated for this document.
          </p>

        </div>

      ) : (

        <div className="space-y-8">

          {/* Executive Summary */}

          <div className="bg-violet-50 border border-violet-100 rounded-3xl p-6">

            <div className="flex items-center gap-3 mb-4">

              <Sparkles
                size={22}
                className="text-violet-600"
              />

              <h3 className="text-xl font-bold text-slate-900">
                Executive Summary
              </h3>

            </div>

            <p className="text-slate-700 leading-8">
              {summary.short_summary}
            </p>

          </div>

          {/* Detailed Summary */}

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">

            <div className="flex items-center gap-3 mb-4">

              <FileText
                size={22}
                className="text-blue-600"
              />

              <h3 className="text-xl font-bold text-slate-900">
                Detailed Analysis
              </h3>

            </div>

            <p className="text-slate-700 whitespace-pre-wrap leading-8">
              {summary.detailed_summary}
            </p>

          </div>

          {/* Key Points */}

          <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6">

            <div className="flex items-center gap-3 mb-4">

              <ListChecks
                size={22}
                className="text-amber-600"
              />

              <h3 className="text-xl font-bold text-slate-900">
                Key Takeaways
              </h3>

            </div>

            <div className="space-y-3">

              {summary.bullet_points?.map(
                (
                  point,
                  index
                ) => (
                  <div
                    key={index}
                    className="
                      bg-white
                      border
                      border-amber-100
                      rounded-2xl
                      p-4
                      text-slate-700
                    "
                  >
                    {point}
                  </div>
                )
              )}

            </div>

          </div>

        </div>

      )}

    </div>

  </div>

</div>

);
}
