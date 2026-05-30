import { useEffect, useState } from "react";
import API from "../services/api";

import {
  MessageSquare,
  Clock,
} from "lucide-react";

export default function ChatHistory({
  onSelectChat,
}) {
  const [history, setHistory] =
    useState([]);

  const [selectedId, setSelectedId] =
    useState(null);

  const loadHistory = async () => {
    try {
      const res = await API.get(
        "/chat/history"
      );

      setHistory(res.data);

    } catch (err) {

      console.error(
        "Failed to load chat history:",
        err
      );

    }
  };

  useEffect(() => {

    loadHistory();

    const interval =
      setInterval(
        loadHistory,
        5000
      );

    return () =>
      clearInterval(interval);

  }, []);

  const handleSelectChat = (
    chat
  ) => {

    setSelectedId(chat.id);

    onSelectChat(chat);

  };

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] h-full shadow-sm overflow-hidden">

      <div className="p-6 border-b border-slate-200">

        <h2 className="text-2xl font-bold text-slate-900">
          Chat History
        </h2>

        <p className="text-slate-500 mt-1">
          Previous AI conversations
        </p>

      </div>

      <div className="p-4 overflow-y-auto h-[calc(100%-100px)]">

        {history.length === 0 ? (

          <div className="flex flex-col items-center justify-center h-full text-center">

            <MessageSquare
              size={60}
              className="text-slate-300 mb-4"
            />

            <h3 className="text-lg font-semibold text-slate-800">
              No Conversations Yet
            </h3>

            <p className="text-slate-500 mt-2">
              Start chatting with your documents.
            </p>

          </div>

        ) : (

          history.map((chat) => (

            <div
              key={chat.id}
              onClick={() =>
                handleSelectChat(
                  chat
                )
              }
              className={`
                cursor-pointer
                rounded-2xl
                p-4
                mb-3
                border
                transition-all
                duration-300
                ${
                  selectedId ===
                  chat.id
                    ? "border-violet-500 bg-violet-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }
              `}
            >

              <p className="font-semibold text-slate-900 truncate">
                {chat.query}
              </p>

              <div className="flex items-center gap-2 mt-2 text-slate-500 text-xs">

                <Clock size={12} />

                <span>
                  {new Date(
                    chat.timestamp
                  ).toLocaleString()}
                </span>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}