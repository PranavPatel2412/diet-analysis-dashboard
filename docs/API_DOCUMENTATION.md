# API Documentation

## Diet Analysis Azure Function API

Base URL: `https://YOUR-FUNCTION-APP-NAME.azurewebsites.net/api`

---

## Endpoints

### 1. Analyze Nutrition Data

**Endpoint:** `/analyzenutrition`

**Method:** `GET`, `POST`

**Description:** Retrieves and analyzes nutritional data from Azure Blob Storage with optional diet type filtering.

#### Request Parameters

| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `dietType` | string | Query/Body | No | Filter by diet type. Options: `all`, `vegan`, `keto`, `paleo`, `mediterranean`, `dash` |

#### Example Requests

**GET Request:**
```bash
curl "https://YOUR-FUNCTION-APP-NAME.azurewebsites.net/api/analyzenutrition?dietType=vegan"
```

**POST Request:**
```bash
curl -X POST "https://YOUR-FUNCTION-APP-NAME.azurewebsites.net/api/analyzenutrition" \
  -H "Content-Type: application/json" \
  -d '{"dietType": "vegan"}'
```

#### Response Format

**Success Response (200 OK):**
```json
{
  "success": true,
  "recordCount": 150,
  "executionTime": "125ms",
  "filter": "vegan",
  "macronutrients": {
    "dietTypes": ["Vegan", "Keto", "Paleo"],
    "protein": [45.2, 89.5, 67.3],
    "carbs": [180.5, 25.3, 95.2],
    "fat": [30.1, 165.2, 78.4]
  },
  "distribution": {
    "dietTypes": ["Vegan", "Keto", "Paleo", "Mediterranean"],
    "recipeCounts": [45, 38, 32, 35]
  },
  "scatterData": [
    {
      "x": 45.2,
      "y": 180.5,
      "label": "Vegan Buddha Bowl"
    },
    {
      "x": 89.5,
      "y": 25.3,
      "label": "Keto Steak"
    }
  ],
  "correlations": {
    "protein_carbs": -0.65
  },
  "availableColumns": ["Recipe_name", "Diet_type", "Protein(g)", "Carbs(g)", "Fat(g)"]
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "No data found for diet type: invalid_type"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Detailed error message",
  "message": "Failed to process nutritional data"
}
```

---

### 2. Health Check

**Endpoint:** `/health`

**Method:** `GET`

**Description:** Checks if the API is running and healthy.

#### Example Request
```bash
curl "https://YOUR-FUNCTION-APP-NAME.azurewebsites.net/api/health"
```

#### Response Format

**Success Response (200 OK):**
```json
{
  "status": "healthy",
  "message": "Diet Analysis API is running",
  "version": "1.0.0"
}
```

---

## Response Fields

### Macronutrients Object
| Field | Type | Description |
|-------|------|-------------|
| `dietTypes` | array | List of diet type names |
| `protein` | array | Average protein content (g) per diet type |
| `carbs` | array | Average carbohydrate content (g) per diet type |
| `fat` | array | Average fat content (g) per diet type |

### Distribution Object
| Field | Type | Description |
|-------|------|-------------|
| `dietTypes` | array | List of diet type names |
| `recipeCounts` | array | Number of recipes per diet type |

### Scatter Data Array
Each object contains:
| Field | Type | Description |
|-------|------|-------------|
| `x` | number | Protein content (g) |
| `y` | number | Carbohydrate content (g) |
| `label` | string | Recipe name |

### Correlations Object
| Field | Type | Description |
|-------|------|-------------|
| `protein_carbs` | number | Correlation coefficient between protein and carbs (-1 to 1) |

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 404 | No data found for specified filter |
| 500 | Internal server error |

---

## CORS Configuration

The API allows cross-origin requests from:
- All origins (`*`) for development
- Specific frontend domains in production

**Headers:**
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## Rate Limiting

- **Free Tier:** 1,000,000 requests per month
- **Timeout:** 5 minutes per request

---

## Authentication

Currently using **Function Key** authentication level.

To make authenticated requests:
1. Get function key from Azure Portal
2. Add to request URL: `?code=YOUR_FUNCTION_KEY`
3. Or add header: `x-functions-key: YOUR_FUNCTION_KEY`

---

## Sample Integration Code

### JavaScript (Fetch API)
```javascript
async function getAnalysis(dietType = 'all') {
    const response = await fetch(
        `https://YOUR-FUNCTION-APP-NAME.azurewebsites.net/api/analyzenutrition?dietType=${dietType}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
    return await response.json();
}
```

### Python
```python
import requests

def get_analysis(diet_type='all'):
    url = f'https://YOUR-FUNCTION-APP-NAME.azurewebsites.net/api/analyzenutrition'
    params = {'dietType': diet_type}
    response = requests.get(url, params=params)
    return response.json()
```

### cURL
```bash
curl -X GET \
  "https://YOUR-FUNCTION-APP-NAME.azurewebsites.net/api/analyzenutrition?dietType=vegan" \
  -H "Content-Type: application/json"
```

---

## Data Source

- **Storage:** Azure Blob Storage
- **Container:** `diets-data`
- **File:** `diets_dataset.csv`
- **Format:** CSV with headers

---

## Monitoring

View logs and metrics:
- Azure Portal → Function App → Monitor
- Application Insights for detailed analytics

---

**Last Updated:** November 2024
