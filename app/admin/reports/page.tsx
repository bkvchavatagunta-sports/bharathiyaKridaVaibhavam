import { getReportsData } from "@/app/actions/reports";
import { ReportsTable } from "./ReportsTable";
import { FileBarChart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const data = await getReportsData();

  return (
    <div className="p-8 space-y-8 bg-muted/10 min-h-full">
      {/* Top Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-muted flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <FileBarChart className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-yellow-600 bg-clip-text text-transparent">
              Visitor Reports
            </h1>
          </div>
          <p className="text-muted-foreground mt-2 font-medium text-sm sm:text-base">
            Detailed log of users who visited the platform, address, visit dates, and current & previous timestamps.
          </p>
        </div>
      </div>

      {/* Reports Table Component */}
      <ReportsTable initialReports={data.reports} stats={data.stats} />
    </div>
  );
}
