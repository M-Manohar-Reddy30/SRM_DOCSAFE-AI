import { useEffect, useState } from "react";
import API from "../services/api";
import SummaryModal from "./SummaryModal";
import NotesModal from "./NotesModal";

export default function DocumentsTable() {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedNotesDoc, setSelectedNotesDoc] = useState(null);

  const loadDocuments = async () => {
    try {
      const res = await API.get("/documents");
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDocument = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this document?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/documents/${id}`);
      loadDocuments();
    } catch (err) {
      console.error(err);
      alert("Failed to delete document");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "ready":
        return "text-green-400";

      case "processing":
        return "text-yellow-400";

      case "pending":
        return "text-blue-400";

      case "failed":
        return "text-red-400";

      default:
        return "text-gray-400";
    }
  };

  useEffect(() => {
    loadDocuments();

    const interval = setInterval(
      loadDocuments,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="bg-slate-800 rounded-xl p-6 mt-6">

        <h2 className="text-white text-xl font-semibold mb-4">
          My Documents
        </h2>

        {documents.length === 0 ? (
          <p className="text-slate-400">
            No documents uploaded yet.
          </p>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-white">

              <thead>
                <tr className="border-b border-slate-700">

                  <th className="text-left py-3">
                    Name
                  </th>

                  <th className="text-left py-3">
                    Category
                  </th>

                  <th className="text-left py-3">
                    Status
                  </th>

                  <th className="text-left py-3">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-slate-700"
                  >

                    <td className="py-3">
                      {doc.original_filename}
                    </td>

                    <td className="py-3">
                      {doc.category}
                    </td>

                    <td
                      className={`py-3 font-semibold ${getStatusColor(
                        doc.status
                      )}`}
                    >
                      {doc.status}
                    </td>

                    <td className="py-3 flex flex-wrap gap-4">

                      <button
                        onClick={() =>
                          setSelectedDoc(doc.id)
                        }
                        disabled={
                          doc.status !== "ready"
                        }
                        className={`${
                          doc.status === "ready"
                            ? "text-green-400 hover:text-green-300"
                            : "text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        Summary
                      </button>

                      <button
                        onClick={() =>
                          setSelectedNotesDoc(doc.id)
                        }
                        disabled={
                          doc.status !== "ready"
                        }
                        className={`${
                          doc.status === "ready"
                            ? "text-purple-400 hover:text-purple-300"
                            : "text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        Notes
                      </button>

                      <a
                        href={`http://127.0.0.1:8000/api/documents/${doc.id}/download`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Download
                      </a>

                      <button
                        onClick={() =>
                          deleteDocument(doc.id)
                        }
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {selectedDoc && (
        <SummaryModal
          documentId={selectedDoc}
          onClose={() =>
            setSelectedDoc(null)
          }
        />
      )}

      {selectedNotesDoc && (
        <NotesModal
          documentId={selectedNotesDoc}
          onClose={() =>
            setSelectedNotesDoc(null)
          }
        />
      )}
    </>
  );
}