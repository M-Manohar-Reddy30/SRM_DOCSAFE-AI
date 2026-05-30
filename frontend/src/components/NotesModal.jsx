import { useEffect, useState } from "react";
import API from "../services/api";

import {
BookOpen,
GraduationCap,
Brain,
X,
Copy,
Check,
} from "lucide-react";

export default function NotesModal({
documentId,
onClose,
}) {
const [notes, setNotes] =
useState([]);

const [loading, setLoading] =
useState(true);

const [copied, setCopied] =
useState(false);

useEffect(() => {
loadNotes();

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

const loadNotes = async () => {
try {

  const res = await API.get(
    `/ai/${documentId}/notes`
  );

  setNotes(res.data);

} catch (err) {

  console.error(err);

} finally {

  setLoading(false);

}

};

const copyNotes = async () => {
const text = notes
.map(
(note) =>
`${note.note_type}\n\n${note.content}`
)
.join("\n\n----------------\n\n");

await navigator.clipboard.writeText(
  text
);

setCopied(true);

setTimeout(() => {
  setCopied(false);
}, 2000);

};

const getIcon = (type) => {
const lower =
type?.toLowerCase() || "";

if (
  lower.includes("exam")
) {
  return (
    <GraduationCap
      size={22}
      className="text-blue-600"
    />
  );
}

if (
  lower.includes("revision")
) {
  return (
    <Brain
      size={22}
      className="text-violet-600"
    />
  );
}

return (
  <BookOpen
    size={22}
    className="text-emerald-600"
  />
);

};

return ( <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50 p-4">

  <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[32px] shadow-2xl border border-slate-200">

    {/* Header */}

    <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">

      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">

          <BookOpen
            className="text-white"
            size={24}
          />

        </div>

        <div>

          <h2 className="text-3xl font-bold text-slate-900">
            AI Study Notes
          </h2>

          <p className="text-slate-500">
            Smart revision material generated from your document
          </p>

        </div>

      </div>

      <div className="flex items-center gap-3">

        {!loading &&
          notes.length > 0 && (
            <button
              onClick={
                copyNotes
              }
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-xl
                bg-emerald-100
                text-emerald-700
                hover:bg-emerald-200
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

    {/* Body */}

    <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-8">

      {loading ? (

        <div className="flex flex-col items-center justify-center py-20">

          <div className="w-14 h-14 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>

          <p className="text-slate-500 mt-6">
            Generating AI Notes...
          </p>

        </div>

      ) : notes.length === 0 ? (

        <div className="text-center py-20">

          <BookOpen
            size={70}
            className="mx-auto text-slate-300 mb-5"
          />

          <h3 className="text-2xl font-bold text-slate-900">
            Notes Not Available
          </h3>

          <p className="text-slate-500 mt-3">
            AI notes have not been generated for this document.
          </p>

        </div>

      ) : (

        <div className="space-y-8">

          {notes.map(
            (
              note,
              index
            ) => (
              <div
                key={index}
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-3xl
                  overflow-hidden
                  shadow-sm
                "
              >

                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">

                  {getIcon(
                    note.note_type
                  )}

                  <h3 className="text-xl font-bold text-slate-900">
                    {note.note_type}
                  </h3>

                </div>

                <div className="p-6">

                  <div
                    className="
                      text-slate-700
                      whitespace-pre-wrap
                      leading-8
                    "
                  >
                    {note.content}
                  </div>

                </div>

              </div>
            )
          )}

        </div>

      )}

    </div>

  </div>

</div>

);
}
