import { useEffect, useState } from "react";
import API from "../services/api";

import {
Search,
FileText,
Download,
Trash2,
Sparkles,
BookOpen,
} from "lucide-react";

import SummaryModal from "./SummaryModal";
import NotesModal from "./NotesModal";

export default function DocumentsTable() {
const [documents, setDocuments] =
useState([]);

const [searchTerm, setSearchTerm] =
useState("");

const [selectedSummary, setSelectedSummary] =
useState(null);

const [selectedNotes, setSelectedNotes] =
useState(null);

const loadDocuments = async () => {
try {
const res = await API.get(
"/documents"
);

  setDocuments(res.data);

} catch (err) {

  console.error(err);

}

};

useEffect(() => {
  loadDocuments();
}, []);

const deleteDocument = async (
id
) => {

const confirmDelete =
  window.confirm(
    "Delete this document?"
  );

if (!confirmDelete) return;

try {

  await API.delete(
    `/documents/${id}`
  );

  loadDocuments();

} catch (err) {

  console.error(err);

}

};

const downloadDocument = async (
id,
filename
) => {

try {

  const response =
    await API.get(
      `/documents/${id}/download`,
      {
        responseType: "blob",
      }
    );

  const url =
    window.URL.createObjectURL(
      new Blob([
        response.data,
      ])
    );

  const link =
    document.createElement(
      "a"
    );

  link.href = url;

  link.setAttribute(
    "download",
    filename
  );

  document.body.appendChild(
    link
  );

  link.click();

  link.remove();

  window.URL.revokeObjectURL(
    url
  );

} catch (err) {

  console.error(err);

}

};

const getStatusBadge = (
status
) => {

switch (
  status?.toLowerCase()
) {

  case "ready":
    return "bg-green-100 text-green-700";

  case "processing":
    return "bg-yellow-100 text-yellow-700";

  case "failed":
    return "bg-red-100 text-red-700";

  case "pending":
    return "bg-blue-100 text-blue-700";

  default:
    return "bg-slate-100 text-slate-700";
}

};

const filteredDocuments =
documents.filter(
(doc) =>
doc.original_filename
?.toLowerCase()
.includes(
searchTerm.toLowerCase()
)
);

return (
<> <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

    <div className="flex justify-between items-center mb-8">

      <div>

        <h2 className="text-3xl font-bold text-slate-900">
          Documents
        </h2>

        <p className="text-slate-500 mt-1">
          Manage your AI-powered document library
        </p>

      </div>

    </div>

    <div className="relative mb-8">

      <Search
        size={18}
        className="absolute left-4 top-4 text-slate-400"
      />

      <input
        type="text"
        placeholder="Search documents..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(
            e.target.value
          )
        }
        className="
          w-full
          pl-12
          pr-4
          py-4
          rounded-2xl
          border
          border-slate-200
          bg-slate-50
          focus:outline-none
          focus:ring-2
          focus:ring-violet-500
        "
      />

    </div>

    {filteredDocuments.length ===
    0 ? (

      <div className="text-center py-16">

        <FileText
          size={60}
          className="mx-auto text-slate-300 mb-4"
        />

        <h3 className="text-2xl font-semibold text-slate-800">
          No Documents Found
        </h3>

        <p className="text-slate-500 mt-2">
          Upload your first document to unlock AI features.
        </p>

      </div>

    ) : (

      <div className="grid lg:grid-cols-2 gap-6">

        {filteredDocuments.map(
          (doc) => (
            <div
              key={doc.id}
              className="
                bg-white
                border
                border-slate-200
                rounded-3xl
                p-6
                shadow-sm
                hover:shadow-xl
                transition-all
                duration-300
              "
            >

              <div className="flex justify-between items-start">

                <div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {doc.original_filename}
                  </h3>

                  <p className="text-slate-500 mt-1">
                    {doc.category}
                  </p>

                </div>

                <span
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    ${getStatusBadge(
                      doc.status
                    )}
                  `}
                >
                  {doc.status}
                </span>

              </div>

              <div className="mt-6 flex flex-wrap gap-3">

                <button
                  onClick={() =>
                    setSelectedSummary(
                      doc.id
                    )
                  }
                  className="flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-xl"
                >
                  <Sparkles size={16} />
                  Summary
                </button>

                <button
                  onClick={() =>
                    setSelectedNotes(
                      doc.id
                    )
                  }
                  className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-xl"
                >
                  <BookOpen size={16} />
                  Notes
                </button>

                <button
                  onClick={() =>
                    downloadDocument(
                      doc.id,
                      doc.original_filename
                    )
                  }
                  className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl"
                >
                  <Download size={16} />
                  Download
                </button>

                <button
                  onClick={() =>
                    deleteDocument(
                      doc.id
                    )
                  }
                  className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-xl"
                >
                  <Trash2 size={16} />
                  Delete
                </button>

              </div>

            </div>
          )
        )}

      </div>

    )}

  </div>

  {selectedSummary && (
    <SummaryModal
      documentId={
        selectedSummary
      }
      onClose={() =>
        setSelectedSummary(
          null
        )
      }
    />
  )}

  {selectedNotes && (
    <NotesModal
      documentId={
        selectedNotes
      }
      onClose={() =>
        setSelectedNotes(
          null
        )
      }
    />
  )}
</>

);
}
