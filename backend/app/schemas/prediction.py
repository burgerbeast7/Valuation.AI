from pydantic import BaseModel, Field
from typing import List, Dict

class PredictionRequest(BaseModel):
    MedInc: float = Field(
        ..., 
        ge=0.5, 
        le=15.0, 
        description="Median district income in tens of thousands of USD (e.g. 3.87 = $38,700)",
        json_schema_extra={"example": 3.87}
    )
    HouseAge: float = Field(
        ..., 
        ge=1.0, 
        le=52.0, 
        description="Median house age in block group (capped at 52)",
        json_schema_extra={"example": 28.0}
    )
    AveRooms: float = Field(
        ..., 
        ge=1.0, 
        le=15.0, 
        description="Average number of rooms per household",
        json_schema_extra={"example": 5.4}
    )
    AveBedrms: float = Field(
        ..., 
        ge=0.5, 
        le=5.0, 
        description="Average number of bedrooms per household",
        json_schema_extra={"example": 1.1}
    )
    Population: float = Field(
        ..., 
        ge=1.0, 
        le=40000.0, 
        description="Block group population",
        json_schema_extra={"example": 1425.0}
    )
    AveOccup: float = Field(
        ..., 
        ge=1.0, 
        le=10.0, 
        description="Average household occupancy (members per household)",
        json_schema_extra={"example": 3.0}
    )
    Latitude: float = Field(
        ..., 
        ge=32.5, 
        le=42.5, 
        description="District Latitude coordinate",
        json_schema_extra={"example": 35.6}
    )
    Longitude: float = Field(
        ..., 
        ge=-124.5, 
        le=-114.3, 
        description="District Longitude coordinate",
        json_schema_extra={"example": -119.5}
    )

class Contributor(BaseModel):
    feature: str
    contribution: float
    description: str
    impact: str  # "positive", "negative", "neutral"

class PredictionResponse(BaseModel):
    estimated_value: float = Field(..., description="Estimated market value in USD")
    confidence_interval: float = Field(..., description="Estimated prediction boundary interval (+/- USD)")
    california_median: float = Field(..., description="California median home value ($100k scale to USD)")
    market_segment: str = Field(..., description="Affordable, Mid-Tier, Premium, or Luxury")
    percentile: float = Field(..., description="Housing value percentile among districts")
    contributors: List[Contributor] = Field(..., description="Ranked feature contributions")
    input_vector: Dict[str, float] = Field(..., description="Echoed input parameters")
