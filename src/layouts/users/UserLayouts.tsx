import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  EllipsisVertical,
  RefreshCw,
  Trash2,
  User as UserIcon,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Lock,
  Eye,
  Plus,
  Users,
  Shield,
  User2,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useUserHandlers } from "@/api/services/userHandlers";
import type { User, GetUsersParams } from "@/api/user/UserApi";
import { ModalType, UserModal } from "@/components/modals/UserModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function UserLayout() {
  const {
    currentData,
    loading,
    isRefreshing,
    refreshUsers,
    createUser,
    updateUser,
    updatePassword,
    deleteUser,
    exportCSV,
  } = useUserHandlers();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"admin" | "user" | "">("");
  const [sortBy, setSortBy] = useState<keyof User | "">("");
  const [sortDir, setSortDir] = useState<"ASC" | "DESC">("ASC");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalType>(ModalType.create);
  const [editUser, setEditUser] = useState<User | null>(null);

  // Delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteUserTarget, setDeleteUserTarget] = useState<User | null>(null);
  const [deletePassword, setDeletePassword] = useState("");

  const buildParams = (): GetUsersParams => ({
    page: currentPage,
    limit: rowsPerPage,
    q: search || undefined,
    role: roleFilter || undefined,
    sortBy: sortBy || undefined,
    sortDir: sortDir || undefined,
  });

  const fetchUsers = async () => {
    const res = await refreshUsers(buildParams());
    if (res?.meta) {
      setTotalData(res.meta.totalData);
      setTotalPages(res.meta.totalPage);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, rowsPerPage, search, roleFilter, sortBy, sortDir]);

  const handleCreate = () => {
    setEditUser(null);
    setModalMode(ModalType.create);
    setModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setModalMode(ModalType.edit);
    setModalOpen(true);
  };

  const handleDetail = (user: User) => {
    setEditUser(user);
    setModalMode(ModalType.detail);
    setModalOpen(true);
  };

  const handlePassword = (user: User) => {
    setEditUser(user);
    setModalMode(ModalType.password);
    setModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setDeleteUserTarget(user);
    setDeletePassword("");
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteUserTarget) return;
    try {
      await deleteUser(deleteUserTarget.id, deletePassword); // panggil API delete
      setDeleteDialogOpen(false);
      await fetchUsers(); // refresh data setelah delete
      toast.success("User deleted successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete user");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleModalSubmit = async (data: any) => {
    try {
      if (!editUser) {
        await createUser(data);
      } else {
        if (modalMode === ModalType.edit) {
          await updateUser(editUser.id, data);
        } else if (modalMode === ModalType.password) {
          await updatePassword(
            editUser.id,
            data.password,
            data.confirm_password
          );
        }
      }

      setModalOpen(false);
      fetchUsers();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit"); // jika pakai toast
    }
  };

  const handleSortClick = (column: keyof User) => {
    if (sortBy === column) setSortDir(sortDir === "ASC" ? "DESC" : "ASC");
    else {
      setSortBy(column);
      setSortDir("ASC");
    }
    setCurrentPage(1);
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      setCurrentPage(val);
    }
  };

  // ✅ Export CSV handler
  const handleExport = async () => {
    try {
      const blob = await exportCSV({
        role: roleFilter || undefined,
        q: search || undefined,
        sortBy: sortBy || undefined,
        sortDir: sortDir || undefined,
        // ✅ Tambahkan parameter 'limit' di sini
        limit: 10,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "users.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export CSV:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center -mt-2">
        <h2 className="text-lg font-semibold m-1 flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-muted-foreground" />
          Data Users
        </h2>

        <div className="flex gap-2">
          <Button onClick={handleCreate} className="flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Create User
          </Button>

          <Button
            onClick={handleExport}
            className="flex items-center gap-1 bg-green-200 border-green-900 text-green-900 hover:bg-green-100 dark:bg-green-500 dark:border-green-900 dark:text-white dark:hover:bg-green-800"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => fetchUsers()}>
          <RefreshCw />
        </Button>
        <Input
          placeholder="Search user"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[250px]"
        />
        <Select
          onValueChange={(val) =>
            setRoleFilter(val === "all" ? "" : (val as "admin" | "user"))
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Role" value={roleFilter || undefined} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="flex items-center gap-2">
              <Users className="w-4 h-4" /> All
            </SelectItem>
            <SelectItem value="admin" className="flex items-center gap-2">
              <Shield className="w-4 h-4" /> Admin
            </SelectItem>
            <SelectItem value="user" className="flex items-center gap-2">
              <User2 className="w-4 h-4" /> User
            </SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => setRowsPerPage(Number(val))}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Rows" value={String(rowsPerPage)} />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 25, 50].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading || isRefreshing ? (
        <SkeletonTable rows={rowsPerPage} />
      ) : currentData.length === 0 ? (
        <div className="text-center text-muted-foreground py-8 shadow-xl">
          Tidak ada data users yang ditemukan.
        </div>
      ) : (
        <ScrollArea className="w-full rounded-md border whitespace-nowrap">
          <Table className="table-auto w-full text-sm border-separate border border-gray-400 rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Actions</TableHead>

                <TableHead
                  className="text-center cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSortClick("name")}
                  title="Click to sort"
                >
                  Name{" "}
                  <span className="inline-flex flex-col ml-1">
                    <ChevronUp
                      size={12}
                      strokeWidth={2}
                      className={
                        sortBy === "name" && sortDir === "ASC"
                          ? "text-black"
                          : "text-gray-600"
                      }
                    />
                    <ChevronDown
                      size={12}
                      strokeWidth={2}
                      className={
                        sortBy === "name" && sortDir === "DESC"
                          ? "text-black"
                          : "text-gray-600"
                      }
                    />
                  </span>
                </TableHead>

                <TableHead
                  className="text-center cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSortClick("username")}
                  title="Click to sort"
                >
                  Username{" "}
                  <span className="inline-flex flex-col ml-1">
                    <ChevronUp
                      size={12}
                      strokeWidth={2}
                      className={
                        sortBy === "username" && sortDir === "ASC"
                          ? "text-black"
                          : "text-gray-600"
                      }
                    />
                    <ChevronDown
                      size={12}
                      strokeWidth={2}
                      className={
                        sortBy === "username" && sortDir === "DESC"
                          ? "text-black"
                          : "text-gray-600"
                      }
                    />
                  </span>
                </TableHead>

                <TableHead
                  className="text-center cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSortClick("role")}
                  title="Click to sort"
                >
                  Role{" "}
                  <span className="inline-flex flex-col ml-1">
                    <ChevronUp
                      size={12}
                      strokeWidth={2}
                      className={
                        sortBy === "role" && sortDir === "ASC"
                          ? "text-black"
                          : "text-gray-600"
                      }
                    />
                    <ChevronDown
                      size={12}
                      strokeWidth={2}
                      className={
                        sortBy === "role" && sortDir === "DESC"
                          ? "text-black"
                          : "text-gray-600"
                      }
                    />
                  </span>
                </TableHead>

                <TableHead
                  className="text-center cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSortClick("created_at")}
                  title="Click to sort"
                >
                  Created At{" "}
                  <span className="inline-flex flex-col ml-1">
                    <ChevronUp
                      size={12}
                      strokeWidth={2}
                      className={
                        sortBy === "created_at" && sortDir === "ASC"
                          ? "text-black"
                          : "text-gray-600"
                      }
                    />
                    <ChevronDown
                      size={12}
                      strokeWidth={2}
                      className={
                        sortBy === "created_at" && sortDir === "DESC"
                          ? "text-black"
                          : "text-gray-600"
                      }
                    />
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentData
                .filter((user) => !user.deleted_at) // ✅ Filter soft deleted
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="text-center border">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            title="Menu"
                            className="cursor-pointer bg-gray-200 border-gray-900 text-gray-900 hover:bg-gray-100 dark:bg-gray-500 dark:border-gray-900 dark:text-white dark:hover:bg-gray-800 h-7 w-7 shadow shadow-gray-300 hover:shadow-gray-400"
                          >
                            <EllipsisVertical className="h-2 w-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel className="text-xs text-muted-foreground pb-0">
                            Menu
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handlePassword(user)}
                          >
                            <Lock className="h-2 w-2" /> Edit Password
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit className="h-4 w-4" /> Edit User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer text-red-500"
                            onClick={() => handleDelete(user)}
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDetail(user)}
                        title="View Detail"
                        className="cursor-pointer bg-blue-200 border-blue-900 text-blue-900 hover:bg-blue-100 dark:bg-blue-500 dark:border-blue-900 dark:text-white dark:hover:bg-blue-800 h-7 w-7 shadow shadow-blue-300 hover:shadow-blue-400"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell className="text-center border">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-center border">
                      {user.username}
                    </TableCell>
                    <TableCell className="text-center border">
                      {user.role}
                    </TableCell>
                    <TableCell className="text-center border">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleString("id-ID", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </TableCell>
                  </TableRow>
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
                onClick={() => setCurrentPage((prev) => prev - 1)}
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
                onClick={() => setCurrentPage((prev) => prev + 1)}
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

      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={editUser}
        mode={modalMode}
        onSubmit={handleModalSubmit}
      />

      {/* Delete Confirmation Dialog */}
      {deleteUserTarget && (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p>
                Are you sure you want to delete user{" "}
                <b>{deleteUserTarget.name}</b>?
              </p>
              <Input
                type="password"
                placeholder="Enter your password to confirm"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
              />
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function SkeletonTable({ rows }: { rows: number }) {
  return (
    <Table className="table-auto w-full text-sm border-separate border border-gray-400 rounded-md">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Actions</TableHead>
          <TableHead className="text-center">Name</TableHead>
          <TableHead className="text-center">Username</TableHead>
          <TableHead className="text-center">Role</TableHead>
          <TableHead className="text-center">Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={i}>
            {[...Array(5)].map((_, j) => (
              <TableCell key={j}>
                <Skeleton className="h-7 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
