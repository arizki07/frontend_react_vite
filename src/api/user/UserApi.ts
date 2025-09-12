import api from "../axios";

export interface User {
  id: number;
  name: string;
  username: string;
  role: "admin" | "user";
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  q?: string;
  role?: "admin" | "user";
  createdFrom?: string;
  createdTo?: string;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
}

export interface GetUsersResponse {
  data: User[];
  meta: {
    totalData: number;
    totalPage: number;
    currentPage: number;
    perPage: number;
  };
}

export const UserApi = {
  getUsers: async (params?: GetUsersParams): Promise<GetUsersResponse> => {
    const res = await api.get("/users", { params });
    return res.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  createUser: async (
    data: Partial<User> & { password: string; confirm_password: string }
  ): Promise<User> => {
    const res = await api.post("/users", data);
    return res.data;
  },

  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },

  updatePassword: async (
    id: number,
    password: string,
    confirm_password: string
  ): Promise<User> => {
    const res = await api.put(`/users/${id}/password`, {
      password,
      confirm_password,
    });
    return res.data;
  },

  deleteUser: async (id: number, confirm_password: string): Promise<User> => {
    const res = await api.delete(`/users/${id}`, {
      data: { confirm_password },
    });
    return res.data;
  },

  exportCSV: async (params?: GetUsersParams): Promise<Blob> => {
    const res = await api.get("/users/export", {
      params,
      responseType: "blob",
    });
    return res.data;
  },
};
