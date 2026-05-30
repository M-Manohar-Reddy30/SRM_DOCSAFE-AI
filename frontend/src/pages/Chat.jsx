import { useState } from "react";

import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import ChatHistory from "../components/ChatHistory";

export default function Chat() {
  const [
    selectedChat,
    setSelectedChat,
  ] = useState(null);

  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar />

      <main className="flex-1 overflow-auto">

        <div className="p-10">

          {/* Hero Section */}

          <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm p-8 mb-8">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div>

                <h1 className="text-5xl font-bold text-slate-900">
                  AI Assistant 🤖
                </h1>

                <p className="text-slate-500 text-lg mt-3">
                  Chat with your documents, ask questions,
                  generate insights, and discover information instantly.
                </p>

              </div>

              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-3xl px-8 py-6 shadow-xl">

                <p className="text-sm opacity-90">
                  AI Powered
                </p>

                <h3 className="text-2xl font-bold mt-1">
                  Document Intelligence
                </h3>

              </div>

            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[75vh]">

            <div className="lg:col-span-3">

              <ChatHistory
                onSelectChat={
                  setSelectedChat
                }
                onNewChat={() =>
                  setSelectedChat(null)
                }
              />

            </div>

            <div className="lg:col-span-9">

              <ChatBox
                selectedChat={
                  selectedChat
                }
              />

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}