# Deployment Documentation

## Project: Diet Analysis Cloud Dashboard

---

## 📋 Table of Contents
1. [Azure Resources](#azure-resources)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Configuration](#configuration)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

---

## 🏗️ Azure Resources

### Resource Group
- **Name:** `diet-analysis-rg`
- **Region:** Canada Central
- **Purpose:** Container for all project resources
- **Created:** [Date]

### Storage Account
- **Name:** `dietstorageacc[unique-id]`
- **Region:** Canada Central
- **Type:** StorageV2
- **Redundancy:** LRS (Locally Redundant Storage)
- **Performance:** Standard
- **Container Name:** `diets-data`
- **Dataset:** `diets_dataset.csv`

**Connection String:**
```
DefaultEndpointsProtocol=https;AccountName=dietstorageacc...;AccountKey=...;EndpointSuffix=core.windows.net
```
*(Store securely - do not commit to Git)*

### Function App
- **Name:** `diet-analysis-func-[name]`
- **Runtime:** Python 3.10
- **Plan:** Consumption (Serverless)
- **Region:** Canada Central
- **OS:** Linux

**Function URL:**
```
https://diet-analysis-func-[name].azurewebsites.net/api/analyzenutrition
```

### Static Web App
- **Name:** `diet-dashboard`
- **Region:** Central US (default)
- **Plan:** Free
- **Repository:** Connected to GitHub

**Dashboard URL:**
```
https://diet-dashboard.azurestaticapps.net
```

---

## 🚀 Backend Deployment

### Prerequisites
```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Install Azure Functions Core Tools
npm install -g azure-functions-core-tools@4

# Install Python 3.10
python3 --version
```

### Step 1: Login to Azure
```bash
az login
az account set --subscription "YOUR-SUBSCRIPTION-ID"
```

### Step 2: Create Resources
```bash
# Create resource group
az group create --name diet-analysis-rg --location canadacentral

# Create storage account
az storage account create \
  --name dietstorageaccYOURID \
  --resource-group diet-analysis-rg \
  --location canadacentral \
  --sku Standard_LRS

# Create function app
az functionapp create \
  --resource-group diet-analysis-rg \
  --consumption-plan-location canadacentral \
  --runtime python \
  --runtime-version 3.10 \
  --functions-version 4 \
  --name diet-analysis-func-YOURNAME \
  --storage-account dietstorageaccYOURID \
  --os-type Linux
```

### Step 3: Upload Dataset
```bash
# Get storage account key
ACCOUNT_KEY=$(az storage account keys list \
  --account-name dietstorageaccYOURID \
  --resource-group diet-analysis-rg \
  --query "[0].value" -o tsv)

# Create container
az storage container create \
  --name diets-data \
  --account-name dietstorageaccYOURID \
  --account-key $ACCOUNT_KEY \
  --public-access blob

# Upload CSV
az storage blob upload \
  --account-name dietstorageaccYOURID \
  --container-name diets-data \
  --name diets_dataset.csv \
  --file path/to/diets_dataset.csv \
  --account-key $ACCOUNT_KEY
```

### Step 4: Deploy Function
```bash
cd backend

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Test locally
func start

# Deploy to Azure
func azure functionapp publish diet-analysis-func-YOURNAME
```

### Step 5: Configure Function App
```bash
# Get connection string
CONNECTION_STRING=$(az storage account show-connection-string \
  --name dietstorageaccYOURID \
  --resource-group diet-analysis-rg \
  --output tsv)

# Set application settings
az functionapp config appsettings set \
  --name diet-analysis-func-YOURNAME \
  --resource-group diet-analysis-rg \
  --settings "AzureWebJobsStorage=$CONNECTION_STRING"

# Enable CORS
az functionapp cors add \
  --name diet-analysis-func-YOURNAME \
  --resource-group diet-analysis-rg \
  --allowed-origins "*"
```

---

## 🌐 Frontend Deployment

### Option 1: Azure Static Web Apps (Recommended)

#### Via Azure Portal
1. Go to Azure Portal → Create Resource → Static Web App
2. **Basics:**
   - Resource group: `diet-analysis-rg`
   - Name: `diet-dashboard`
   - Plan type: Free
   - Region: Central US
3. **Deployment:**
   - Source: GitHub
   - Organization: [Your GitHub username]
   - Repository: `diet-analysis-dashboard`
   - Branch: `main`
   - Build Presets: Custom
   - App location: `/frontend`
   - Output location: `/frontend`
4. Click "Review + Create"

#### Via GitHub Actions (Auto-configured)
After connecting to GitHub, Azure creates a workflow file:

`.github/workflows/azure-static-web-apps-[name].yml`
```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
      
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/frontend"
          output_location: ""
```

### Option 2: Azure App Service
```bash
# Create App Service plan
az appservice plan create \
  --name diet-dashboard-plan \
  --resource-group diet-analysis-rg \
  --sku F1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group diet-analysis-rg \
  --plan diet-dashboard-plan \
  --name diet-dashboard-app \
  --runtime "NODE|18-lts"

# Deploy from GitHub
az webapp deployment source config \
  --name diet-dashboard-app \
  --resource-group diet-analysis-rg \
  --repo-url https://github.com/YOUR-USERNAME/diet-analysis-dashboard \
  --branch main \
  --manual-integration
```

---

## ⚙️ Configuration

### Update Frontend API Endpoint

Edit `frontend/js/api.js`:
```javascript
const API_BASE_URL = 'https://diet-analysis-func-YOURNAME.azurewebsites.net/api';
```

### Environment Variables

**Backend (Function App):**
- `AzureWebJobsStorage` - Storage connection string
- `BLOB_CONNECTION_STRING` - Same as AzureWebJobsStorage
- `CONTAINER_NAME` - `diets-data`
- `BLOB_NAME` - `diets_dataset.csv`

**Frontend (Static Web App):**
- `API_BASE_URL` - Function app URL

---

## 🧪 Testing

### Test Azure Function
```bash
# Health check
curl https://diet-analysis-func-YOURNAME.azurewebsites.net/api/health

# Get all data
curl https://diet-analysis-func-YOURNAME.azurewebsites.net/api/analyzenutrition

# Filter by diet type
curl "https://diet-analysis-func-YOURNAME.azurewebsites.net/api/analyzenutrition?dietType=vegan"
```

### Test Frontend
1. Open dashboard URL in browser
2. Check browser console for errors (F12)
3. Verify all charts load
4. Test filter dropdown
5. Click refresh button
6. Test on mobile device

### Postman Collection
Import this collection to test API:
```json
{
  "info": {
    "name": "Diet Analysis API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Nutritional Data",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "https://diet-analysis-func-YOURNAME.azurewebsites.net/api/analyzenutrition",
          "protocol": "https",
          "host": [
            "diet-analysis-func-YOURNAME",
            "azurewebsites",
            "net"
          ],
          "path": [
            "api",
            "analyzenutrition"
          ]
        }
      }
    },
    {
      "name": "Filter by Diet Type",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "https://diet-analysis-func-YOURNAME.azurewebsites.net/api/analyzenutrition?dietType=vegan",
          "protocol": "https",
          "host": [
            "diet-analysis-func-YOURNAME",
            "azurewebsites",
            "net"
          ],
          "path": [
            "api",
            "analyzenutrition"
          ],
          "query": [
            {
              "key": "dietType",
              "value": "vegan"
            }
          ]
        }
      }
    }
  ]
}
```

---
