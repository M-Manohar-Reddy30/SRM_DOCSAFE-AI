import { useState } from "react";
import API from "../services/api";

export default function UploadBox({
  onUploadSuccess,
}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] =
    useState(false);

  const uploadDocument = async () => {
    if (!file) {
      alert("Select a file first");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);

      await API.post(
        "/documents/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(
        "Document uploaded successfully!"
      );

      setFile(null);

      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.detail ||
          "Upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl">

      <h2 className="text-white text-xl font-semibold mb-4">
        Upload Document
      </h2>

      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
        className="text-white mb-4 block"
      />

      <button
        onClick={uploadDocument}
        disabled={uploading}
        className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2 rounded text-white"
      >
        {uploading
          ? "Uploading..."
          : "Upload"}
      </button>

    </div>
  );
}