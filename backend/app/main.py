from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import health, model, metrics, export

app = FastAPI(
    title="ValuationAI-API",
    description="Backend valuation API for California Housing price predictor using Multiple Linear Regression.",
    version="1.0.0"
)

# Configure CORS for local development (Vite frontend) and production environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set to exact origins in production e.g. ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router components
app.include_router(health.router, prefix="/api")
app.include_router(model.router, prefix="/api")
app.include_router(metrics.router, prefix="/api")
app.include_router(export.router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "Welcome to ValuationAI API",
        "documentation": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
