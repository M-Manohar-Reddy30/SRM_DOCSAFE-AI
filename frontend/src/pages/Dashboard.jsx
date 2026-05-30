import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/DashboardCards";
import UploadBox from "../components/UploadBox";
import DocumentsTable from "../components/DocumentsTable";

import { motion } from "framer-motion";

export default function Dashboard() {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  return (
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar />

      <main className="flex-1 overflow-auto">

        {/* Hero */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="px-10 pt-10"
        >

          <div
            className="
              relative
              overflow-hidden
              rounded-[36px]
              bg-gradient-to-r
              from-violet-600
              via-indigo-600
              to-blue-600
              text-white
              p-10
              shadow-2xl
            "
          >

            <div className="relative z-10">

              <p className="text-white/80 text-lg">
                {greeting}
              </p>

              <h1 className="text-5xl font-bold mt-2">
                Welcome Back 👋
              </h1>

              <p className="mt-4 text-lg text-white/90 max-w-2xl">
                Manage, analyze, summarize and chat with
                your documents using powerful AI tools.
              </p>

            </div>

            <div
              className="
                absolute
                -right-16
                -top-16
                w-72
                h-72
                bg-white/10
                rounded-full
              "
            />

            <div
              className="
                absolute
                right-20
                bottom-0
                w-40
                h-40
                bg-white/10
                rounded-full
              "
            />

          </div>

        </motion.div>

        {/* Stats */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
            duration: 0.5,
          }}
          className="px-10 mt-8"
        >
          <DashboardCards />
        </motion.div>

        {/* Upload */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
            duration: 0.5,
          }}
          className="px-10 mt-8"
        >
          <UploadBox />
        </motion.div>

        {/* Documents */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
            duration: 0.5,
          }}
          className="px-10 mt-8 pb-10"
        >
          <DocumentsTable />
        </motion.div>

      </main>

    </div>
  );
}