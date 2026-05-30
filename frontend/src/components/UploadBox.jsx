import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

import {
  UploadCloud,
  FileText,
  Sparkles,
} from "lucide-react";

export default function UploadBox({
  onUploadSuccess,
}) {
  const [file, setFile] =
    useState(null);

  const [uploading, setUploading] =
    useState(false);

  const [inputKey, setInputKey] =
    useState(Date.now());

  const uploadDocument = async () => {
    if (!file) {
      toast.error(
        "Please select a document."
      );
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      toast.error(
        "Only PDF, PNG and JPG files are allowed."
      );
      return;
    }

    try {
      setUploading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

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

      toast.success(
        "Document uploaded successfully!"
      );

      setFile(null);

      setInputKey(
        Date.now()
      );

      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (err) {

      console.error(err);

      toast.error(
        err?.response?.data?.detail ||
        "Upload failed"
      );

    } finally {

      setUploading(false);

    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">

      {/* Header */}

      <div className="flex items-center gap-3 mb-6">

        <div
          className="
            w-12
            h-12
            rounded-2xl
            bg-gradient-to-r
            from-violet-600
            to-indigo-600
            flex
            items-center
            justify-center
            shadow-lg
          "
        >
          <Sparkles
            size={22}
            className="text-white"
          />
        </div>

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            Upload Documents
          </h2>

          <p className="text-slate-500">
            AI will analyze, summarize,
            generate notes and index
            your files.
          </p>

        </div>

      </div>

      {/* Upload Area */}

      <div
        className="
          border-2
          border-dashed
          border-slate-300
          rounded-3xl
          p-10
          text-center
          hover:border-violet-500
          transition-all
          duration-300
        "
      >

        <UploadCloud
          size={56}
          className="
            mx-auto
            text-violet-600
            mb-4
          "
        />

        <h3
          className="
            text-xl
            font-semibold
            text-slate-900
          "
        >
          Upload Your Files
        </h3>

        <p
          className="
            text-slate-500
            mt-2
          "
        >
          Supported formats:
          PDF, PNG, JPG
        </p>

        <div className="mt-6">

          <label
            htmlFor="file-upload"
            className="
              inline-flex
              items-center
              gap-2
              px-6
              py-3
              rounded-2xl
              bg-violet-600
              hover:bg-violet-700
              text-white
              cursor-pointer
              transition-all
              duration-300
              shadow-lg
            "
          >

            <FileText size={18} />

            Browse Files

          </label>

          <input
            key={inputKey}
            id="file-upload"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
          />

        </div>

        {file && (

          <div
            className="
              mt-6
              bg-slate-100
              rounded-2xl
              p-4
            "
          >

            <p
              className="
                font-semibold
                text-slate-800
                break-all
              "
            >
              {file.name}
            </p>

            <p
              className="
                text-slate-500
                text-sm
                mt-1
              "
            >
              {(
                file.size / 1024
              ).toFixed(2)}{" "}
              KB
            </p>

          </div>

        )}

      </div>

      {/* Upload Button */}

      <button
        onClick={uploadDocument}
        disabled={
          uploading || !file
        }
        className="
          mt-6
          w-full
          bg-gradient-to-r
          from-violet-600
          to-indigo-600
          hover:from-violet-700
          hover:to-indigo-700
          text-white
          py-4
          rounded-2xl
          font-semibold
          shadow-lg
          transition-all
          duration-300
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >

        {uploading
          ? "Uploading & Processing..."
          : "Upload Document"}

      </button>

    </div>
  );
}