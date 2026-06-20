import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { ModelInput, PredictionResponse } from '../types';

export const usePrediction = () => {
  return useMutation<PredictionResponse, Error, ModelInput>({
    mutationFn: async (data: ModelInput) => {
      const response = await api.post<PredictionResponse>('/predict', data);
      return response.data;
    },
  });
};
