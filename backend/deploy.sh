#!/bin/bash

# Configuration
PROJECT_ID="hemolink-494510"
SERVICE_NAME="hemolink-backend"
REGION="asia-south1"
IMAGE_TAG="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🩸 Starting HemoLink Deployment to Google Cloud Run..."
echo "Project ID: $PROJECT_ID"

# 1. Build the Docker image and submit to Google Container Registry
echo "🛠️ Step 1: Building and submitting image to GCR..."
gcloud builds submit --tag $IMAGE_TAG --project $PROJECT_ID

# 2. Deploy to Cloud Run
echo "🚀 Step 2: Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_TAG \
  --platform managed \
  --region $REGION \
  --project $PROJECT_ID \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars="GOOGLE_MAPS_API_KEY=AIzaSyB1JkeQ23w-eDptqcRH81WsHc_5XzgqF-M,MONGODB_URI=${MONGODB_URI:-mongodb+srv://placeholder}"

echo "✅ Deployment pipeline complete."
