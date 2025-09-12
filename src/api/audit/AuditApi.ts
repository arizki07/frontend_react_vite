import api from "../axios"; // pastikan ini instance axios Anda

export interface AuditLog {
  id: number;
  actor_id: number;
  entity: string;
  entity_id: number;
  action: string;
  before: object | null;
  after: object | null;
  created_at: string;
  updated_at: string;
}

export interface GetAuditParams {
  page?: number;
  limit?: number;
  q?: string; // filter entity
  sortBy?: "created_at";
  sortDir?: "asc" | "desc";
  createdFrom?: string; // YYYY-MM-DD
  createdTo?: string; // YYYY-MM-DD
}

export interface GetAuditResponse {
  success: boolean;
  message: string;
  data: AuditLog[];
  meta: {
    totalData: number;
    totalPage: number;
    currentPage: number;
    perPage: number;
  };
}

export const AuditApi = {
  getAudits: async (params?: GetAuditParams): Promise<GetAuditResponse> => {
    const response = await api.get<GetAuditResponse>("/audits", {
      params,
    });
    return response.data;
  },
};
