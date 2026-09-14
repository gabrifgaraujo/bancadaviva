import { api } from "./api";
import type { DashboardData } from "../types";

export const dashboardService = {
  async obter(): Promise<DashboardData> {
    const { data } = await api.get<DashboardData>("/dashboard");
    return data;
  },
};
