import os
import joblib
import pandas as pd
import numpy as np
import math
from typing import List, Dict, Any
from app.schemas.prediction import PredictionRequest, Contributor, PredictionResponse

# Load model relative to current file path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "housing_model.joblib")

class PredictorService:
    def __init__(self):
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at: {MODEL_PATH}")
        self.model = joblib.load(MODEL_PATH)
        
        # Extracted coefficients and intercept
        self.coefficients = {
            "MedInc": 0.448674910,
            "HouseAge": 0.00972425752,
            "AveRooms": -0.123323343,
            "AveBedrms": 0.783144907,
            "Population": -0.00000202962058,
            "AveOccup": -0.00352631849,
            "Latitude": -0.419792487,
            "Longitude": -0.433708065
        }
        self.intercept = -37.02327770606416
        
        # Feature names in order
        self.feature_names = ["MedInc", "HouseAge", "AveRooms", "AveBedrms", "Population", "AveOccup", "Latitude", "Longitude"]
        
        # Dataset means (useful for offset contributions if needed, or raw feature contributions)
        self.feature_means = {
            "MedInc": 3.87,
            "HouseAge": 28.6,
            "AveRooms": 5.43,
            "AveBedrms": 1.10,
            "Population": 1425.5,
            "AveOccup": 3.07,
            "Latitude": 35.63,
            "Longitude": -119.57
        }

    def predict(self, req: PredictionRequest) -> PredictionResponse:
        # Create input df matching model features
        input_data = pd.DataFrame([{
            'MedInc': req.MedInc,
            'HouseAge': req.HouseAge,
            'AveRooms': req.AveRooms,
            'AveBedrms': req.AveBedrms,
            'Population': req.Population,
            'AveOccup': req.AveOccup,
            'Latitude': req.Latitude,
            'Longitude': req.Longitude
        }])
        
        # Execute model prediction
        pred_scaled = self.model.predict(input_data)[0]
        # Prevent negative housing value (lower bounds)
        pred_scaled = max(0.15, pred_scaled)
        
        # California Housing dataset targets are in units of $100,000
        estimated_value = pred_scaled * 100000.0
        
        # Calculate confidence interval: standard error of prediction is approx $60,000 for OLS on this dataset
        confidence_interval = 65000.0
        
        # California median value (approx $206,858 in raw dataset)
        california_median = 206858.0
        
        # Determine market segment
        if estimated_value < 150000.0:
            market_segment = "Affordable"
        elif estimated_value < 300000.0:
            market_segment = "Mid-Tier"
        elif estimated_value < 450000.0:
            market_segment = "Premium"
        else:
            market_segment = "Luxury"
            
        # Percentile calculation based on standard normal distribution (mean=2.068, std=1.15)
        # Using math.erf for standard cumulative normal distribution
        z_score = (pred_scaled - 2.068) / 1.15
        percentile_val = 0.5 * (1.0 + math.erf(z_score / math.sqrt(2.0))) * 100.0
        percentile = max(1.0, min(99.0, percentile_val))
        
        # Compute ranked feature contributions
        contributors = []
        for feature in self.feature_names:
            coef = self.coefficients[feature]
            val = getattr(req, feature)
            mean = self.feature_means[feature]
            
            # The contribution is modeled as the coefficient multiplied by feature scale/offset
            raw_contrib = coef * (val - mean)
            
            # Formulate descriptions based on coefficient and values
            if feature == "MedInc":
                desc = "Higher household income strongly increased the estimated value." if val > mean else "Lower household income reduced the estimated value."
                impact = "positive" if raw_contrib >= 0 else "negative"
            elif feature in ["Latitude", "Longitude"]:
                desc = "Geographic positioning had moderate influence."
                impact = "positive" if raw_contrib >= 0 else "negative"
            elif feature == "Population":
                desc = "Block group population had minimal impact on local pricing."
                impact = "neutral"
            elif feature == "AveOccup":
                desc = "Occupancy density had minimal impact."
                impact = "neutral" if abs(raw_contrib) < 0.05 else ("positive" if raw_contrib > 0 else "negative")
            elif feature == "HouseAge":
                desc = "Older home age slightly increased value due to historic premiums." if val > mean else "Newer home age slightly reduced target baseline value."
                impact = "positive" if raw_contrib >= 0 else "negative"
            elif feature == "AveRooms":
                desc = "Higher average room count slightly reduced structural density index." if val > mean else "Lower room count favored denser spatial pricing."
                impact = "negative" if raw_contrib < 0 else "positive"
            else:
                desc = "Property characteristics influenced base cost."
                impact = "positive" if raw_contrib >= 0 else "negative"
                
            contributors.append(Contributor(
                feature=feature,
                contribution=float(raw_contrib),
                description=desc,
                impact=impact
            ))
            
        # Sort contributors by absolute strength
        contributors.sort(key=lambda x: abs(x.contribution), reverse=True)
        
        return PredictionResponse(
            estimated_value=float(estimated_value),
            confidence_interval=float(confidence_interval),
            california_median=float(california_median),
            market_segment=market_segment,
            percentile=round(percentile, 1),
            contributors=contributors,
            input_vector=req.model_dump()
        )

# Instantiate single service instance
predictor_service = PredictorService()
