import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { MetricsDashboardResponse, ModelInfoResponse } from '../types';

export const useMetrics = () => {
  return useQuery<MetricsDashboardResponse, Error>({
    queryKey: ['metrics'],
    queryFn: async () => {
      const response = await api.get<MetricsDashboardResponse>('/metrics');
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes since training stats are static
  });
};

export const useModelInfo = () => {
  return useQuery<ModelInfoResponse, Error>({
    queryKey: ['modelInfo'],
    queryFn: async () => {
      const response = await api.get<ModelInfoResponse>('/model-info');
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // Cache indefinitely
  });
};
