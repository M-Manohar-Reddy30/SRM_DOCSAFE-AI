import Sidebar from "../components/Sidebar";
import DocumentsTable from "../components/DocumentsTable";

export default function Documents() {
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
                  Documents 📄
                </h1>

                <p className="text-slate-500 text-lg mt-3">
                  Upload, organize, analyze, and interact with your
                  AI-powered document library.
                </p>

              </div>

              <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-3xl px-8 py-6 shadow-xl">

                <p className="text-sm opacity-90">
                  AI Workspace
                </p>

                <h3 className="text-2xl font-bold mt-1">
                  Smart Document Intelligence
                </h3>

              </div>

            </div>

          </div>

          {/* Documents Section */}

          <DocumentsTable />

        </div>

      </main>

    </div>
  );
}