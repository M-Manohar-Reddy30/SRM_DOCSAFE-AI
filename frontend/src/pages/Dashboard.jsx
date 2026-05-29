import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/DashboardCards";
import UploadBox from "../components/UploadBox";
import DocumentsTable from "../components/DocumentsTable";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-slate-950">

      <Sidebar />

      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold text-white mb-6">
          Dashboard
        </h1>

        <DashboardCards />

        <UploadBox />

        <DocumentsTable />

      </div>

    </div>
  );
}