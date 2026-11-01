"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Download,
  Trash2,
  RefreshCw,
  MapPin,
  Calendar,
  Clock,
  History,
  Users,
  Activity,
  Repeat,
  CalendarCheck,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { deleteReport, clearAllReports } from "@/app/actions/reports";
import { useRouter } from "next/navigation";

interface VisitReportItem {
  id: string;
  visitorId: string;
  userName: string;
  userPhone: string | null;
  address: string;
  ipAddress: string | null;
  pageVisited: string;
  currentVisit: Date | string;
  previousVisit: Date | string | null;
  visitDate: Date | string;
  userAgent: string | null;
  createdAt: Date | string;
}

interface ReportsTableProps {
  initialReports: VisitReportItem[];
  stats: {
    totalVisits: number;
    uniqueVisitors: number;
    returningVisits: number;
    todayVisits: number;
  };
}

export function ReportsTable({ initialReports, stats }: ReportsTableProps) {
  const router = useRouter();
  const [reports, setReports] = useState<VisitReportItem[]>(initialReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "REGISTERED" | "GUEST" | "RETURNING">("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.pageVisited.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.userPhone && r.userPhone.includes(searchTerm));

    if (!matchesSearch) return false;

    if (filterType === "REGISTERED") {
      return r.userName.toLowerCase() !== "guest visitor" && !r.userName.toLowerCase().startsWith("guest");
    }
    if (filterType === "GUEST") {
      return r.userName.toLowerCase() === "guest visitor" || r.userName.toLowerCase().startsWith("guest");
    }
    if (filterType === "RETURNING") {
      return r.previousVisit !== null;
    }
    return true;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this visit report record?")) return;
    setDeletingId(id);
    const res = await deleteReport(id);
    if (res.success) {
      setReports((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert("Failed to delete record.");
    }
    setDeletingId(null);
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear all visit records? This action cannot be undone.")) return;
    setIsRefreshing(true);
    const res = await clearAllReports();
    if (res.success) {
      setReports([]);
      router.refresh();
    } else {
      alert("Failed to clear records.");
    }
    setIsRefreshing(false);
  };

  const handleExportCSV = () => {
    if (filteredReports.length === 0) {
      alert("No report data to export.");
      return;
    }

    const headers = [
      "User Who Visited",
      "Phone",
      "Address",
      "Date",
      "Current Timestamp",
      "Previous Timestamp",
      "Page Visited",
      "Visitor Type",
    ];

    const rows = filteredReports.map((r) => {
      const isRegistered = r.userName.toLowerCase() !== "guest visitor" && !r.userName.toLowerCase().startsWith("guest");
      const dateStr = format(new Date(r.visitDate), "dd/MM/yyyy");
      const currentStr = format(new Date(r.currentVisit), "dd/MM/yyyy, hh:mm a");
      const previousStr = r.previousVisit
        ? format(new Date(r.previousVisit), "dd/MM/yyyy, hh:mm a")
        : "First Visit";

      return [
        `"${r.userName.replace(/"/g, '""')}"`,
        `"${r.userPhone || ""}"`,
        `"${r.address.replace(/"/g, '""')}"`,
        `"${dateStr}"`,
        `"${currentStr}"`,
        `"${previousStr}"`,
        `"${r.pageVisited}"`,
        `"${isRegistered ? "Registered User" : "Guest"}"`,
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BKV_Visitor_Reports_${format(new Date(), "dd-MM-yyyy")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Visits
            </CardTitle>
            <Activity className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{stats.totalVisits}</div>
            <p className="text-xs text-muted-foreground mt-1">Logged impressions & sessions</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Unique Visitors
            </CardTitle>
            <Users className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{stats.uniqueVisitors}</div>
            <p className="text-xs text-muted-foreground mt-1">Distinct devices & athletes</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Returning Visitors
            </CardTitle>
            <Repeat className="w-5 h-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{stats.returningVisits}</div>
            <p className="text-xs text-muted-foreground mt-1">Users with previous visit timestamp</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Today's Visits
            </CardTitle>
            <CalendarCheck className="w-5 h-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{stats.todayVisits}</div>
            <p className="text-xs text-muted-foreground mt-1">Activity recorded today</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-muted overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-6 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
              <Input
                placeholder="Search user, address, route..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-11 bg-white"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="h-11 px-3 rounded-md border border-input bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">All Visits ({reports.length})</option>
              <option value="REGISTERED">Registered Users Only</option>
              <option value="GUEST">Guest Visitors Only</option>
              <option value="RETURNING">Returning Visitors (Has Previous)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-11 font-semibold"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="h-11 font-semibold text-primary border-primary/30 hover:bg-primary/5"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            {reports.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-11 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 font-semibold"
              >
                Clear Logs
              </Button>
            )}
          </div>
        </div>

        {/* Reports Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-100/70">
              <TableRow>
                <TableHead className="font-bold text-slate-900 py-4">User Who Visited</TableHead>
                <TableHead className="font-bold text-slate-900 py-4">Address</TableHead>
                <TableHead className="font-bold text-slate-900 py-4">Date</TableHead>
                <TableHead className="font-bold text-slate-900 py-4">Current Timestamp</TableHead>
                <TableHead className="font-bold text-slate-900 py-4">Previous Timestamp</TableHead>
                <TableHead className="font-bold text-slate-900 py-4">Page Visited</TableHead>
                <TableHead className="font-bold text-slate-900 py-4 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Users className="w-10 h-10 text-muted-foreground/40" />
                      <p className="font-bold text-base text-slate-700">No visit records found</p>
                      <p className="text-xs text-muted-foreground">
                        {searchTerm ? "Try adjusting your search criteria." : "Visitor logs will appear here in real time as users visit the site."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => {
                  const isRegistered =
                    report.userName.toLowerCase() !== "guest visitor" &&
                    !report.userName.toLowerCase().startsWith("guest");

                  const dateFormatted = format(new Date(report.visitDate), "dd/MM/yyyy");
                  const currentFormatted = format(new Date(report.currentVisit), "dd/MM/yyyy, hh:mm a");
                  const previousFormatted = report.previousVisit
                    ? format(new Date(report.previousVisit), "dd/MM/yyyy, hh:mm a")
                    : null;

                  return (
                    <TableRow key={report.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* User Who Visited */}
                      <TableCell className="py-4 font-medium">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm ${
                              isRegistered
                                ? "bg-primary text-white ring-2 ring-primary/20"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {isRegistered ? report.userName.substring(0, 2) : "G"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">
                                {report.userName}
                              </span>
                              {isRegistered ? (
                                <Badge variant="default" className="text-[10px] px-2 py-0 bg-emerald-600 font-bold flex items-center gap-1">
                                  <UserCheck className="w-2.5 h-2.5" /> Registered
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-[10px] px-2 py-0 text-slate-600 font-medium">
                                  Visitor
                                </Badge>
                              )}
                            </div>
                            {report.userPhone && (
                              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                📞 {report.userPhone}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Address */}
                      <TableCell className="py-4">
                        <div className="flex items-start gap-1.5 max-w-xs">
                          <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span
                            className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-2"
                            title={report.address}
                          >
                            {report.address}
                          </span>
                        </div>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{dateFormatted}</span>
                        </div>
                      </TableCell>

                      {/* Current Timestamp */}
                      <TableCell className="py-4">
                        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1 rounded-md text-xs font-bold font-mono">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>{currentFormatted}</span>
                        </div>
                      </TableCell>

                      {/* Previous Timestamp */}
                      <TableCell className="py-4">
                        {previousFormatted ? (
                          <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 border border-slate-300 px-2.5 py-1 rounded-md text-xs font-bold font-mono">
                            <History className="w-3.5 h-3.5 text-slate-500" />
                            <span>{previousFormatted}</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-bold">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>First Visit</span>
                          </div>
                        )}
                      </TableCell>

                      {/* Page Visited */}
                      <TableCell className="py-4">
                        <code className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-1 rounded border">
                          {report.pageVisited}
                        </code>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={deletingId === report.id}
                          onClick={() => handleDelete(report.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                          title="Delete visit record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t bg-slate-50/60 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-slate-900">{filteredReports.length}</strong> of{" "}
            <strong className="text-slate-900">{reports.length}</strong> total visit logs
          </span>
          <span>Date format: dd/MM/yyyy • Indian Standard Time (IST)</span>
        </div>
      </div>
    </div>
  );
}
