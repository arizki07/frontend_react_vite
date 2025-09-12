import { AuditApi, type AuditLog } from "@/api/audit/AuditApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  UserIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";

export function AuditLogsLayouts() {
  const [sortBy, setSortBy] = useState<"created_at" | "">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AuditLog[]>([]);
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAudit, setSelectedAudit] = useState<AuditLog | null>(null);

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const res = await AuditApi.getAudits({
        page: currentPage,
        limit: rowsPerPage,
        q: search || undefined,
        sortBy,
        sortDir: sortOrder,
      });
      setData(res.data);
      setTotalData(res.meta.totalData);
      setTotalPages(res.meta.totalPage);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, [currentPage, rowsPerPage, sortBy, sortOrder, search]);

  const handleSort = (column: "created_at") => {
    if (sortBy === column) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else setSortBy(column);
    setCurrentPage(1);
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = Number(e.target.value);
    if (!isNaN(page) && page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const toggleDetail = (audit: AuditLog) => {
    if (selectedAudit?.id === audit.id) setSelectedAudit(null);
    else setSelectedAudit(audit);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-lg font-semibold m-1 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-muted-foreground" />
          Data Audit Logs
        </h2>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          onClick={fetchAudits}
        >
          <RefreshCw />
        </Button>
        <Input
          placeholder="Search entity"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[250px]"
        />
        <Select
          onValueChange={(value) => setRowsPerPage(Number(value))}
          defaultValue={rowsPerPage.toString()}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Rows" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <Table className="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-separate border border-gray-400 rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1 text-center">Actions</TableHead>
              <TableHead className="text-center">Actor ID</TableHead>
              <TableHead className="text-center">Entity</TableHead>
              <TableHead className="text-center">Entity ID</TableHead>
              <TableHead className="w-1 text-center">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowsPerPage }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="flex gap-1 border">
                  <Skeleton className="h-8 w-8 rounded-md" />
                </TableCell>
                {[...Array(4)].map((_, j) => (
                  <TableCell key={j} className="border">
                    <Skeleton className="h-7 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : data.length === 0 ? (
        <div className="text-center text-muted-foreground py-8 shadow-xl">
          Tidak ada data audit logs yang ditemukan.
        </div>
      ) : (
        <ScrollArea className="w-full rounded-md border whitespace-nowrap">
          <Table className="table-auto w-full text-sm text-left rtl:text-right text-dark dark:text-gray-400 border-separate border border-gray-400 rounded-lg">
            <TableHeader className="text-xs">
              <TableRow>
                <TableHead className="w-1/90 text-center border" rowSpan={2}>
                  Actions
                </TableHead>
                <TableHead
                  className="text-center border cursor-pointer"
                  rowSpan={2}
                  onClick={() => handleSort("created_at")}
                >
                  <div className="flex items-center justify-center gap-1">
                    Created At{" "}
                    {sortBy === "created_at" &&
                      (sortOrder === "asc" ? (
                        <ArrowUpNarrowWide className="h-4 w-4" />
                      ) : (
                        <ArrowDownNarrowWide className="h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
                <TableHead className="text-center border" rowSpan={2}>
                  Actor ID
                </TableHead>
                <TableHead className="text-center border" rowSpan={2}>
                  Entity
                </TableHead>
                <TableHead className="text-center border" rowSpan={2}>
                  Entity ID
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow>
                    <TableCell className="flex justify-center items-center gap-1 border">
                      <Button
                        variant="outline"
                        size="icon"
                        title="View Detail"
                        className="h-7 w-7"
                        onClick={() => toggleDetail(row)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="border">{row.created_at}</TableCell>
                    <TableCell className="border">{row.actor_id}</TableCell>
                    <TableCell className="border">{row.entity}</TableCell>
                    <TableCell className="border">{row.entity_id}</TableCell>
                  </TableRow>

                  {selectedAudit?.id === row.id && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="bg-gray-50 dark:bg-gray-800 p-4 border"
                      >
                        <div className="flex flex-col gap-4">
                          <div>
                            <h4 className="font-semibold">Before:</h4>
                            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto text-sm">
                              {JSON.stringify(row.before, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <h4 className="font-semibold">After:</h4>
                            <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto text-sm">
                              {JSON.stringify(row.after, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center px-4 py-4 -mt-5">
        <span className="text-sm">Total: {totalData} Data</span>
        <div className="flex items-center gap-1 ml-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-7 w-7"
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                <ChevronFirst />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Halaman Pertama</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-7 w-7"
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                <ChevronLeft />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mundur 1 Halaman</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Input
                type="text"
                value={currentPage}
                onChange={handlePageInputChange}
                className="h-7 w-10 text-center"
              />
            </TooltipTrigger>
            <TooltipContent>
              Halaman {currentPage} dari {totalPages}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-7 w-7"
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                <ChevronRight />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Maju 1 Halaman</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-7 w-7"
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                <ChevronLast />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Halaman Akhir</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
