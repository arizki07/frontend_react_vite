import { UserApi, type GetUsersParams, type User } from "@/api/user/UserApi";
import { useState } from "react";
import { toast } from "sonner";

export function useUserHandlers() {
  const [currentData, setCurrentData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const getUsers = async (params?: GetUsersParams) => {
    setLoading(true);
    try {
      const res = await UserApi.getUsers(params);
      setCurrentData(res.data);
      toast.success("Users loaded successfully");
      return res;
    } catch (err: any) {
      toast.error(err?.message || "Failed to load users");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (id: number) => {
    setLoading(true);
    try {
      const user = await UserApi.getUserById(id);
      setSelectedUser(user);
      toast.success("User loaded successfully");
      return user;
    } catch (err: any) {
      toast.error(err?.message || "Failed to load user");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (
    data: Partial<User> & { password: string; confirm_password: string }
  ) => {
    setLoading(true);
    try {
      const user = await UserApi.createUser(data);
      toast.success("User created successfully");
      return user;
    } catch (err: any) {
      toast.error(err?.message || "Failed to create user");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, data: Partial<User>) => {
    setLoading(true);
    try {
      const user = await UserApi.updateUser(id, data);
      toast.success("User updated successfully");
      return user;
    } catch (err: any) {
      toast.error(err?.message || "Failed to update user");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (
    id: number,
    password: string,
    confirm_password: string
  ) => {
    setLoading(true);
    try {
      const user = await UserApi.updatePassword(id, password, confirm_password);
      toast.success("Password updated successfully");
      return user;
    } catch (err: any) {
      toast.error(err?.message || "Failed to update password");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number, confirm_password: string) => {
    setLoading(true);
    try {
      const user = await UserApi.deleteUser(id, confirm_password);
      toast.success("User deleted successfully");
      return user;
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete user");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = async (params?: GetUsersParams) => {
    setIsRefreshing(true);
    try {
      const res = await getUsers(params);
      toast.success("Users refreshed successfully");
      return res;
    } catch (err: any) {
      toast.error(err?.message || "Failed to refresh users");
      throw err;
    } finally {
      setIsRefreshing(false);
    }
  };

  const exportCSV = async (params?: GetUsersParams) => {
    try {
      const blob = await UserApi.exportCSV(params);
      toast.success("CSV exported successfully");
      return blob;
    } catch (err: any) {
      toast.error(err?.message || "Failed to export CSV");
      throw err;
    }
  };

  return {
    currentData,
    loading,
    isRefreshing,
    selectedUser,
    setSelectedUser,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    updatePassword,
    deleteUser,
    refreshUsers,
    exportCSV,
  };
}
