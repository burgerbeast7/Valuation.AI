from fastapi import APIRouter, HTTPException
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.schemas.metrics import ModelInfoResponse
from app.services.predictor import predictor_service

router = APIRouter()

@router.post("/predict", response_model=PredictionResponse, tags=["model"])
async def predict_value(request: PredictionRequest):
    try:
        return predictor_service.predict(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.get("/model-info", response_model=ModelInfoResponse, tags=["model"])
async def model_info():
    try:
        return ModelInfoResponse(
            algorithm="Multiple Linear Regression",
            dataset_name="California Housing Dataset (1990 Census)",
            dataset_size=20640,
            features=predictor_service.feature_names,
            train_test_split="80:20",
            coefficients=predictor_service.coefficients,
            intercept=predictor_service.intercept
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model metadata retrieval error: {str(e)}")
