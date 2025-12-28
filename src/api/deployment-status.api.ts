import type { DeploymentStatusData } from "@/components/molecules/DeploymentStatus";
import { apiClient } from "./client";

interface DeploymentStatusResponse {
  status: DeploymentStatusData;
}

interface MessageResponse {
  message: string;
}

export const deploymentStatusApi = {
  async get(appId: string): Promise<DeploymentStatusResponse> {
    return apiClient.get<DeploymentStatusResponse>(`/api/applications/${appId}/deployment-status`);
  },

  async clear(appId: string): Promise<MessageResponse> {
    return apiClient.delete<MessageResponse>(`/api/applications/${appId}/deployment-status`);
  },
};
