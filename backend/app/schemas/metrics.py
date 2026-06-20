from pydantic import BaseModel, Field
from typing import List, Dict

class ModelInfoResponse(BaseModel):
    algorithm: str = Field(..., example="Multiple Linear Regression")
    dataset_name: str = Field(..., example="California Housing Dataset")
    dataset_size: int = Field(..., example=20640)
    features: List[str] = Field(..., example=["MedInc", "HouseAge", "AveRooms", "AveBedrms", "Population", "AveOccup", "Latitude", "Longitude"])
    train_test_split: str = Field(..., example="80:20")
    coefficients: Dict[str, float]
    intercept: float

class ScatterPoint(BaseModel):
    actual: float
    predicted: float

class HistogramBin(BaseModel):
    bin: float
    count: int

class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float
    coefficient: float

class CorrelationCell(BaseModel):
    x: str
    y: str
    value: float

class ChartDataResponse(BaseModel):
    actual_vs_predicted: List[ScatterPoint]
    error_distribution: List[HistogramBin]
    feature_importance: List[FeatureImportanceItem]
    correlation_matrix: List[CorrelationCell]

class MetricsDashboardResponse(BaseModel):
    r_squared: float
    rmse: float
    mae: float
    mse: float
    charts: ChartDataResponse
