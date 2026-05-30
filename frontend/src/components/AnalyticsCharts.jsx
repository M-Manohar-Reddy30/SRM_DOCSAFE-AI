import {
Chart as ChartJS,
ArcElement,
Tooltip,
Legend,
CategoryScale,
LinearScale,
BarElement,
} from "chart.js";

import {
Pie,
Bar,
} from "react-chartjs-2";

ChartJS.register(
ArcElement,
Tooltip,
Legend,
CategoryScale,
LinearScale,
BarElement
);

export default function AnalyticsCharts({
analytics,
}) {
if (!analytics) {
return null;
}

const ready =
analytics.ready_documents ?? 0;

const processing =
analytics.processing_documents ?? 0;

const failed =
analytics.failed_documents ?? 0;

const totalStatusDocs =
ready +
processing +
failed;

const categoryLabels =
Object.keys(
analytics.documents_by_category || {}
);

const categoryValues =
Object.values(
analytics.documents_by_category || {}
);

const pieData = {
labels: [
"Ready",
"Processing",
"Failed",
],

datasets: [
  {
    data: [
      ready,
      processing,
      failed,
    ],

    backgroundColor: [
      "#10B981",
      "#F59E0B",
      "#EF4444",
    ],

    borderWidth: 0,
  },
],

};

const barData = {
labels: categoryLabels,

datasets: [
  {
    label: "Documents",

    data: categoryValues,

    backgroundColor:
      "#7C3AED",

    borderRadius: 12,

    borderSkipped: false,
  },
],

};

const pieOptions = {
responsive: true,

maintainAspectRatio: false,

plugins: {
  legend: {
    position: "bottom",

    labels: {
      color: "#334155",

      font: {
        size: 13,
        weight: "600",
      },
    },
  },
},

};

const barOptions = {
responsive: true,

maintainAspectRatio: false,

plugins: {
  legend: {
    display: false,
  },

  tooltip: {
    backgroundColor:
      "#0F172A",
  },
},

scales: {
  x: {
    grid: {
      display: false,
    },

    ticks: {
      color: "#64748B",
    },
  },

  y: {
    beginAtZero: true,

    grid: {
      color: "#E2E8F0",
    },

    ticks: {
      color: "#64748B",
    },
  },
},

};

return ( <div className="grid xl:grid-cols-2 gap-8">

  <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">

    <div className="mb-6">

      <h3 className="text-2xl font-bold text-slate-900">
        Document Status
      </h3>

      <p className="text-slate-500 mt-1">
        Processing overview of uploaded documents
      </p>

    </div>

    {totalStatusDocs === 0 ? (

      <div className="h-[350px] flex items-center justify-center">

        <p className="text-slate-400">
          No document analytics available
        </p>

      </div>

    ) : (

      <div className="h-[350px]">

        <Pie
          data={pieData}
          options={pieOptions}
        />

      </div>

    )}

  </div>

  <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">

    <div className="mb-6">

      <h3 className="text-2xl font-bold text-slate-900">
        Document Categories
      </h3>

      <p className="text-slate-500 mt-1">
        Category distribution across uploaded files
      </p>

    </div>

    {categoryLabels.length === 0 ? (

      <div className="h-[350px] flex items-center justify-center">

        <p className="text-slate-400">
          No category analytics available
        </p>

      </div>

    ) : (

      <div className="h-[350px]">

        <Bar
          data={barData}
          options={barOptions}
        />

      </div>

    )}

  </div>

</div>

);
}
