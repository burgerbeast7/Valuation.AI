# Valuation.AI | California Housing Valuation Dashboard

An institutional-grade real estate valuation platform leveraging Multiple Linear Regression to estimate census district housing values. Built with a production-grade full-stack architecture matching standard industry patterns.

🚀 **Live Demo:** [https://burgerbeast7.github.io/Valuation.AI/](https://burgerbeast7.github.io/Valuation.AI/)

---

## ⚡ Overview
**Valuation.AI** transitions California Housing analysis from an isolated student notebook into a premium, interactive full-stack web dashboard. It models house price projections based on demographic and structural data from the California Housing Census, rendering real-time predictions, geographical maps, linear coefficient weights, and evaluation statistics.

---

## 🚀 Features
- **Staged prediction flow:** Cinematic loading sequence showcasing simulation steps before rendering final valuations.
- **Explainable AI (XAI):** Interpretability cards demonstrating positive and negative contributions derived directly from OLS coefficients.
- **Geographic plain projection:** Stylized California locator mapping input coordinates alongside city-proximity overlays.
- **Statistical dashboard:** Live metrics (R², RMSE, MAE, MSE) with interactive Recharts plots of actual vs. predicted values, error distribution, feature weights, and correlation heatmaps.
- **Report exports:** Generate on-the-fly CSV datasets and ReportLab PDF documents summarizing prediction vectors.
- **Educational modules:** Collapsible accordion covering linear regression equations, Census metrics, model assumptions, and limitations.

---

## 🏗️ Architecture
The platform is decoupled into a React/TypeScript client and a FastAPI server, containerized via Docker and Docker Compose.

```
                  +--------------------------------+
                  |       React Frontend (Vite)    |
                  |     (Tailwind, Framer Motion)  |
                  +---------------+----------------+
                                  | (REST API via proxy)
                                  v
                  +--------------------------------+
                  |         FastAPI Backend        |
                  |     (Uvicorn, CORS Enabled)    |
                  +---------------+----------------+
                                  | (joblib.load)
                                  v
                  +--------------------------------+
                  |     Multiple Linear Regression  |
                  |      (scikit-learn Estimator)  |
                  +--------------------------------+
```

### Tech Stack
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts, React Hook Form, Zod, React Query, Axios.
- **Backend:** FastAPI, Python, scikit-learn, joblib, pandas, numpy, Pydantic, ReportLab.
- **Deployment:** Docker, Docker Compose, Nginx.

---

## 🛠️ Setup Instructions

### Option 1: Multi-Container Docker Compose (Recommended)
Verify that Docker and Docker Compose are installed on your machine.
1. Navigate to the project root:
   ```bash
   cd ValuationAI
   ```
2. Build and launch the container services:
   ```bash
   docker compose up --build
   ```
3. Open your browser and view the application at:
   `http://localhost`

### Option 2: Local Manual Setup (Development)

#### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. Install required python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Uvicorn api dev server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install npm node modules:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the development client at:
   `http://localhost:5173`

---

## 🌐 Production Deployment

### 1. Frontend Deployment (Vercel)
Vercel handles React SPA monorepos cleanly.
1. Go to your **Vercel Dashboard** and click **Add New** → **Project**.
2. Import the Git repository: `https://github.com/burgerbeast7/Valuation.AI.git`.
3. In the project settings, configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** `Vite` (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Under **Environment Variables**, add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://valuation-ai-backend.onrender.com/api` (replace with your active Render backend service API endpoint)
5. Click **Deploy**.

### 2. Backend Deployment (Render)
You can deploy the backend using the Dockerfile directly.
1. Go to your **Render Dashboard** and click **New** → **Web Service**.
2. Connect your Git repository.
3. In the settings, configure:
   - **Runtime:** `Docker`
   - **Docker Command:** (Leave blank to use Dockerfile default)
4. Under **Advanced Settings**, configure:
   - **Docker Build Context:** `backend`
   - **Dockerfile Path:** `Dockerfile`
5. Render will automatically build the backend image and expose it.

---

## 📖 API Documentation

### 1. Model Prediction Endpoint
- **URL:** `/api/predict`
- **Method:** `POST`
- **Payload Schema:**
  ```json
  {
    "MedInc": 3.87,
    "HouseAge": 28.0,
    "AveRooms": 5.4,
    "AveBedrms": 1.1,
    "Population": 1425,
    "AveOccup": 3.0,
    "Latitude": 35.6,
    "Longitude": -119.5
  }
  ```
- **Response Schema:**
  ```json
  {
    "estimated_value": 208500.25,
    "confidence_interval": 65000.0,
    "california_median": 206858.0,
    "market_segment": "Mid-Tier",
    "percentile": 51.2,
    "contributors": [
      {
        "feature": "MedInc",
        "contribution": 0.4486,
        "description": "Higher household income strongly increased the estimated value.",
        "impact": "positive"
      }
    ],
    "input_vector": { ... }
  }
  ```

### 2. Metrics & Charts Data
- **URL:** `/api/metrics`
- **Method:** `GET`
- **Description:** Exposes cached evaluation statistics and chart coordinates for scatter, bar, and correlation matrices.

---

## 🔮 Future Improvements
- **Alternative Estimators:** Incorporate ensemble gradient-boosted trees (e.g. LightGBM, XGBoost) to model geo-contour non-linearities.
- **Inflation adjustment indexing:** Re-weight features using modern consumer price indices (CPI) to reflect current inflation rates.
- **Dynamic geographical layers:** Integrate Mapbox or Deck.gl layers mapping coordinate parameters to actual street boundary values.

---

## ✍️ Author Information
- **Author:** [Kunal Chauhan](https://www.linkedin.com/in/kunal-chauhan-7a7539287/)
- **GitHub:** [@burgerbeast7](https://github.com/burgerbeast7)
- **LinkedIn:** [Kunal Chauhan](https://www.linkedin.com/in/kunal-chauhan-7a7539287/)
- **Live Demo:** [Valuation.AI](https://burgerbeast7.github.io/Valuation.AI/)
