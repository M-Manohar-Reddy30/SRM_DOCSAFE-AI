import { useState, useEffect, useRef } from "react";
import API from "../services/api";

import {
  Send,
  Bot,
  User,
  FileText,
} from "lucide-react";

export default function ChatBox({
  selectedChat,
}) {
  const [query, setQuery] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [documents, setDocuments] =
    useState([]);

  const [
    selectedDocument,
    setSelectedDocument,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    if (!selectedChat) return;

    setMessages([
      {
        role: "user",
        content:
          selectedChat.query,
      },
      {
        role: "assistant",
        content:
          selectedChat.response,
      },
    ]);
  }, [selectedChat]);

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const loadDocuments = async () => {
    try {
      const res = await API.get(
        "/documents/"
      );

      const readyDocs =
        res.data.filter(
          (doc) =>
            doc.status === "ready"
        );

      setDocuments(readyDocs);

    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {

    if (
      !query.trim() ||
      loading
    ) {
      return;
    }

    const userMessage = {
      role: "user",
      content: query,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setLoading(true);

    try {

      const response =
        await API.post(
          "/chat/",
          {
            query,
            document_ids:
              selectedDocument
                ? [selectedDocument]
                : [],
          }
        );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            response.data.answer,
          sources:
            response.data
              .sources || [],
        },
      ]);

    } catch (err) {

      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, an error occurred while generating the response.",
        },
      ]);

    } finally {

      setLoading(false);

      setQuery("");

    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] h-full shadow-sm flex flex-col overflow-hidden">

      {/* Header */}

      <div className="border-b border-slate-200 p-6">

        <h2 className="text-2xl font-bold text-slate-900">
          AI Assistant
        </h2>

        <p className="text-slate-500 mt-1">
          Ask questions about your uploaded documents.
        </p>

      </div>

      {/* Document Selector */}

      <div className="p-6 border-b border-slate-200">

        <label className="block text-sm font-medium text-slate-700 mb-2">
          Document Context
        </label>

        <select
          value={selectedDocument}
          onChange={(e) =>
            setSelectedDocument(
              e.target.value
            )
          }
          className="
            w-full
            p-3
            rounded-2xl
            border
            border-slate-200
            bg-slate-50
            text-slate-800
            focus:outline-none
            focus:ring-2
            focus:ring-violet-500
          "
        >
          <option value="">
            All Ready Documents
          </option>

          {documents.map((doc) => (
            <option
              key={doc.id}
              value={doc.id}
            >
              {doc.original_filename}
            </option>
          ))}
        </select>

      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">

        {messages.length === 0 && (

          <div className="flex flex-col items-center justify-center h-full text-center">

            <Bot
              size={70}
              className="text-violet-500 mb-5"
            />

            <h3 className="text-2xl font-bold text-slate-900">
              AI Document Assistant
            </h3>

            <p className="text-slate-500 mt-2 max-w-md">
              Ask questions, summarize documents,
              extract information, and discover insights.
            </p>

          </div>

        )}

        {messages.map(
          (msg, index) => (
            <div
              key={index}
              className={`mb-6 flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`
                  max-w-[80%]
                  rounded-3xl
                  p-5
                  shadow-sm
                  ${
                    msg.role === "user"
                      ? "bg-violet-600 text-white"
                      : "bg-white border border-slate-200 text-slate-800"
                  }
                `}
              >

                <div className="flex items-center gap-2 mb-3">

                  {msg.role ===
                  "user" ? (
                    <User size={18} />
                  ) : (
                    <Bot size={18} />
                  )}

                  <span className="font-semibold">
                    {msg.role ===
                    "user"
                      ? "You"
                      : "SrmDocSafe AI"}
                  </span>

                </div>

                <div className="whitespace-pre-wrap leading-7">
                  {msg.content}
                </div>

                {msg.sources &&
                  msg.sources.length >
                    0 && (

                    <div className="mt-4 border-t border-slate-200 pt-3">

                      <div className="text-sm font-semibold mb-2">
                        Sources
                      </div>

                      <div className="space-y-2">

                        {msg.sources.map(
                          (
                            source,
                            i
                          ) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-xs"
                            >
                              <FileText
                                size={14}
                              />

                              Chunk{" "}
                              {
                                source.chunk_index
                              }
                            </div>
                          )
                        )}

                      </div>

                    </div>

                  )}

              </div>

            </div>
          )
        )}

        {loading && (

          <div className="flex items-center gap-3 text-slate-500">

            <Bot size={18} />

            <span className="animate-pulse">
              AI is thinking...
            </span>

          </div>

        )}

        <div ref={bottomRef}></div>

      </div>

      {/* Input */}

      <div className="border-t border-slate-200 p-5">

        <div className="flex gap-3">

          <input
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === "Enter" &&
              sendMessage()
            }
            placeholder="Ask anything about your documents..."
            className="
              flex-1
              px-5
              py-4
              rounded-2xl
              border
              border-slate-200
              bg-white
              text-slate-900
              placeholder:text-slate-400
              focus:outline-none
              focus:ring-2
              focus:ring-violet-500
              focus:border-violet-500
            "
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="
              px-6
              rounded-2xl
              bg-violet-600
              hover:bg-violet-700
              text-white
              transition-all
              flex
              items-center
              gap-2
            "
          >
            <Send size={18} />
            Send
          </button>

        </div>

      </div>

    </div>
  );
}