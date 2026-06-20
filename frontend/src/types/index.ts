export interface ModelInput {
  MedInc: number;
  HouseAge: number;
  AveRooms: number;
  AveBedrms: number;
  Population: number;
  AveOccup: number;
  Latitude: number;
  Longitude: number;
}

export interface Contributor {
  feature: string;
  contribution: number;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface PredictionResponse {
  estimated_value: number;
  confidence_interval: number;
  california_median: number;
  market_segment: string;
  percentile: number;
  contributors: Contributor[];
  input_vector: ModelInput;
}

export interface ScatterPoint {
  actual: number;
  predicted: number;
}

export interface HistogramBin {
  bin: number;
  count: number;
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
  coefficient: number;
}

export interface CorrelationCell {
  x: string;
  y: string;
  value: number;
}

export interface ChartDataResponse {
  actual_vs_predicted: ScatterPoint[];
  error_distribution: HistogramBin[];
  feature_importance: FeatureImportanceItem[];
  correlation_matrix: CorrelationCell[];
}

export interface MetricsDashboardResponse {
  r_squared: number;
  rmse: number;
  mae: number;
  mse: number;
  charts: ChartDataResponse;
}

export interface ModelInfoResponse {
  algorithm: string;
  dataset_name: string;
  dataset_size: number;
  features: string[];
  train_test_split: string;
  coefficients: Record<string, number>;
  intercept: number;
}
