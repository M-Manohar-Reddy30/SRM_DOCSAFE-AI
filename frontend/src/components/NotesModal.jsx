import { useEffect, useState } from "react";
import API from "../services/api";

export default function NotesModal({
  documentId,
  onClose,
}) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const res = await API.get(
        `/ai/${documentId}/notes`
      );

      setNotes(res.data);

    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.detail ||
        "Notes not available"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

      <div className="bg-slate-800 w-[800px] max-h-[85vh] overflow-y-auto rounded-xl p-6">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl text-white font-bold">
            AI Study Notes
          </h2>

          <button
            onClick={onClose}
            className="text-red-400 text-xl"
          >
            ✕
          </button>

        </div>

        {loading ? (
          <p className="text-white">
            Loading...
          </p>
        ) : (
          notes.map((note, index) => (
            <div
              key={index}
              className="mb-8"
            >

              <h3 className="text-green-400 text-xl font-semibold mb-3">
                {note.note_type}
              </h3>

              <div className="bg-slate-900 p-4 rounded text-slate-200 whitespace-pre-wrap">
                {note.content}
              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
}