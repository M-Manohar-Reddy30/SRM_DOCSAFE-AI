import { useState } from "react";
import API from "../services/api";

export default function ChatPage() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] =
    useState(false);

  const askQuestion = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      const res = await API.post(
        "/chat/",
        {
          query: query
        }
      );

      setAnswer(
        res.data.answer ||
        "No answer found"
      );

    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.detail ||
        "Chat failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">

      <h1 className="text-4xl font-bold text-white mb-8">
        AI Chat
      </h1>

      <div className="bg-slate-800 p-6 rounded-xl">

        <textarea
          rows={4}
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          placeholder="Ask anything about your uploaded documents..."
          className="w-full bg-slate-900 text-white p-4 rounded"
        />

        <button
          onClick={askQuestion}
          disabled={loading}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded text-white"
        >
          {loading
            ? "Thinking..."
            : "Ask AI"}
        </button>

      </div>

      {answer && (
        <div className="bg-slate-800 mt-8 p-6 rounded-xl">

          <h2 className="text-xl text-green-400 mb-4">
            Answer
          </h2>

          <p className="text-white whitespace-pre-wrap">
            {answer}
          </p>

        </div>
      )}

    </div>
  );
}