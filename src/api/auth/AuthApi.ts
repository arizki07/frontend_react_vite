import api from "../axios";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      username: string;
      role: "admin" | "user";
      created_by: number;
      updated_by: number;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };
    expiredAt: string;
  };
}

export interface MeResponse {
  data: {
    id: number;
    name: string;
    username: string;
    role: "admin" | "user";
    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
}

export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem("accesstoken");
};

export const AuthApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const res = await api.post("/auth/login", payload);
    if (res.data.data.token) {
      localStorage.setItem("accesstoken", res.data.data.token);
    }
    return res.data;
  },

  refresh: async (refreshToken: string) => {
    const res = await api.post("/auth/refresh", { token: refreshToken });
    if (res.data.data.token) {
      localStorage.setItem("accesstoken", res.data.data.token);
    }
    return res.data;
  },

  me: async (): Promise<MeResponse> => {
    const res = await api.get("/auth/me");
    return res.data;
  },

  logout: async () => {
    const res = await api.post("/auth/logout");
    localStorage.removeItem("accesstoken");
    return res.data;
  },
};
