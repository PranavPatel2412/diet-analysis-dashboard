# Deployment Guide

Complete step-by-step guide for deploying the Diet Analysis Cloud Dashboard to Azure.

---

## Prerequisites

### Required Software
- Azure CLI (latest version)
- Azure Functions Core Tools v4
- Python 3.10 or higher
- Git
- Node.js 18+ (optional, for Static Web Apps)

### Azure Account
- Active Azure subscription
- Sufficient permissions to create resources

---

## Step 1: Clone Repository
```bash
git clone https://github.com/YOUR-USERNAME/diet-analysis-dashboard.git
cd diet-analysis-dashboard
```

---

## Step 2: Azure Login
```bash
az login
az account set --subscription "YOUR-SUBSCRIPTION-ID"
```

---

## Step 3: Create Resource Group
```bash
az group create \
  --name diet-analysis-rg \
  --location canadacentral
```

---

## Step 4: Create Storage Account
```bash
# Create storage account (replace UNIQUEID with your initials + numbers)
az storage account create \
  --name dietstorageaccUNIQUEID \
  --resource-group diet-analysis-rg \
  --location canadacentral \
  --sku Standard_LRS \
  --kind StorageV2

# Get connection string
az storage account show-connection-string \
  --name dietstorageaccUNIQUEID \
  --resource-group diet-analysis-rg \
  --query connectionString \
  --output tsv
```

**Save this connection string securely!**

---

## Step 5: Create Blob Container and Upload Dataset
```bash
# Get account key
ACCOUNT_KEY=$(az storage account keys list \
  --account-name dietstorageaccUNIQUEID \
  --resource-group diet-analysis-rg \
  --query "[0].value" -o tsv)

# Create container
az storage container create \
  --name diets-data \
  --account-name dietstorageaccUNIQUEID \
  --account-key $ACCOUNT_KEY \
  --public-access blob

# Upload dataset
az storage blob upload \
  --account-name dietstorageaccUNIQUEID \
  --container-name diets-data \
  --name diets_dataset.csv \
  --file path/to/your/diets_dataset.csv \
  --account-key $ACCOUNT_KEY
```

---

## Step 6: Create Function App
```bash
az functionapp create \
  --resource-group diet-analysis-rg \
  --consumption-plan-location canadacentral \
  --runtime python \
  --runtime-version 3.10 \
  --functions-version 4 \
  --name diet-analysis-func-YOURNAME \
  --storage-account dietstorageaccUNIQUEID \
  --os-type Linux
```

---

## Step 7: Configure Function App
```bash
# Get connection string
CONNECTION_STRING=$(az storage account show-connection-string \
  --name dietstorageaccUNIQUEID \
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

## Step 8: Deploy Azure Function
```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate
# Activate (Mac/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Test locally (optional)
func start

# Deploy to Azure
func azure functionapp publish diet-analysis-
