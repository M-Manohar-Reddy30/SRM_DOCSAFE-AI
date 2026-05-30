import { useEffect, useState } from "react";
import API from "../services/api";

import {
  MessageSquare,
  Clock,
  Plus,
  MoreVertical,
  Pencil,
  Pin,
  Trash2,
} from "lucide-react";

import toast from "react-hot-toast";

export default function ChatHistory({
  onSelectChat,
  onNewChat,
}) {
  const [history, setHistory] =
    useState([]);

  const [selectedId, setSelectedId] =
    useState(null);

  const [menuOpen, setMenuOpen] =
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

    const interval = setInterval(
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

  const renameChat = async (
    chatId
  ) => {
    const title = prompt(
      "Enter new chat title"
    );

    if (!title) return;

    try {
      await API.put(
        `/chat/${chatId}/rename`,
        {
          title,
        }
      );

      toast.success(
        "Chat renamed"
      );

      loadHistory();
    } catch (err) {
      console.error(err);

      toast.error(
        "Rename failed"
      );
    }
  };

  const pinChat = async (
    chatId
  ) => {
    try {
      await API.put(
        `/chat/${chatId}/pin`
      );

      toast.success(
        "Chat updated"
      );

      loadHistory();
    } catch (err) {
      console.error(err);

      toast.error(
        "Action failed"
      );
    }
  };

  const deleteChat = async (
    chatId
  ) => {
    if (
      !window.confirm(
        "Delete this chat?"
      )
    ) {
      return;
    }

    try {
      await API.delete(
        `/chat/${chatId}`
      );

      toast.success(
        "Chat deleted"
      );

      if (selectedId === chatId) {
        onSelectChat(null);
      }

      loadHistory();
    } catch (err) {
      console.error(err);

      toast.error(
        "Delete failed"
      );
    }
  };

  const pinnedChats =
    history.filter(
      (chat) =>
        chat.is_pinned
    );

  const recentChats =
    history.filter(
      (chat) =>
        !chat.is_pinned
    );

  const renderChat = (
    chat
  ) => (
    <div
      key={chat.id}
      className={`
        relative
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
      <div
        onClick={() =>
          handleSelectChat(chat)
        }
        className="cursor-pointer"
      >
        <p className="font-semibold text-slate-900 truncate">
          {chat.title ||
            chat.query}
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

      <button
        onClick={() =>
          setMenuOpen(
            menuOpen ===
              chat.id
              ? null
              : chat.id
          )
        }
        className="
          absolute
          top-3
          right-3
          p-1
          rounded-lg
          hover:bg-slate-100
        "
      >
        <MoreVertical
          size={16}
          className="text-violet-600"
        />
      </button>

      {menuOpen ===
        chat.id && (
        <div
          className="
            absolute
            right-3
            top-12
            bg-white
            border
            border-slate-200
            rounded-xl
            shadow-xl
            z-50
            overflow-hidden
            min-w-[180px]
            text-black
          "
        >
          <button
            onClick={() =>
              renameChat(
                chat.id
              )
            }
            className="
              flex
              items-center
              gap-2
              px-4
              py-3
              hover:bg-slate-50
              w-full
              text-left
            "
          >
            <Pencil
              size={14}
              className="text-black"
            />

            <span className="text-black">
              Rename
            </span>
          </button>

          <button
            onClick={() =>
              pinChat(
                chat.id
              )
            }
            className="
              flex
              items-center
              gap-2
              px-4
              py-3
              hover:bg-slate-50
              w-full
              text-left
            "
          >
            <Pin
              size={14}
              className="text-black"
            />

            <span className="text-black">
              {chat.is_pinned
                ? "Unpin"
                : "Pin"}
            </span>
          </button>

          <button
            onClick={() =>
              deleteChat(
                chat.id
              )
            }
            className="
              flex
              items-center
              gap-2
              px-4
              py-3
              text-red-500
              hover:bg-red-50
              w-full
              text-left
            "
          >
            <Trash2
              size={14}
            />
            Delete
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] h-full shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">
          Chat History
        </h2>

        <p className="text-slate-500 mt-1">
          Previous AI conversations
        </p>

        <button
          onClick={() => {
            onNewChat();

            setSelectedId(null);

            toast.success(
              "New chat started"
            );
          }}
          className="
            mt-4
            w-full
            flex
            items-center
            justify-center
            gap-2
            bg-gradient-to-r
            from-violet-600
            to-indigo-600
            text-white
            py-3
            rounded-2xl
            font-semibold
            shadow-lg
          "
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100%-140px)]">
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
          <>
            {pinnedChats.length >
              0 && (
              <>
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">
                  📌 Pinned
                </h3>

                {pinnedChats.map(
                  renderChat
                )}
              </>
            )}

            <h3 className="text-xs font-bold text-slate-400 uppercase mt-4 mb-3">
              Recent
            </h3>

            {recentChats.map(
              renderChat
            )}
          </>
        )}
      </div>
    </div>
  );
}