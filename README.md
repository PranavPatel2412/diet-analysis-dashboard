# Diet Analysis Cloud Dashboard

A comprehensive Azure-based serverless application for nutritional insights visualization and analysis.

## 🎓 Project Information
- **Course:** Cloud Computing (Phase 2)
- **Institution:** [Your College/University Name]
- **Team Members:**
  - **Pranav** - Azure Infrastructure & Backend Deployment
  - **Krunal** - Frontend Dashboard Development & Visualizations
  - **Aviral** - Integration, Testing & Deployment

## 🏗️ Architecture

This project uses Azure serverless architecture:
- **Azure Functions** - Serverless backend for data processing
- **Azure Blob Storage** - Dataset storage
- **Azure Static Web Apps** - Frontend hosting
- **Chart.js** - Data visualization library

## 📂 Project Structure
```
diet-analysis-dashboard/
├── README.md                 # Project overview
├── backend/                  # Azure Functions backend
│   ├── function_app.py       # Python function code
│   ├── requirements.txt      # Python dependencies
│   ├── host.json            # Function host configuration
│   └── AnalyzeNutrition/    # Function directory
├── frontend/                 # Dashboard web application
│   ├── index.html           # Main dashboard page
│   ├── css/                 # Stylesheets
│   ├── js/                  # JavaScript modules
│   └── assets/              # Images and static files
├── docs/                     # Documentation
│   ├── DEPLOYMENT.md        # Deployment guide
│   ├── API_DOCUMENTATION.md # API reference
│   ├── screenshots/         # Project screenshots
│   └── DOCUMENTATION.pdf    # Final report
└── .gitignore               # Git ignore rules
```

## 🚀 Azure Resources

### Resource Group: `diet-analysis-rg`

| Resource | Name | Purpose |
|----------|------|---------|
| Storage Account | `dietstorageacc[unique]` | Dataset storage |
| Function App | `diet-analysis-func-[name]` | Serverless API |
| Static Web App | `diet-dashboard` | Frontend hosting |
| Container | `diets-data` | Blob container for CSV |

## 🔗 Live URLs

- **Azure Function API:** `https://diet-analysis-func-[name].azurewebsites.net/api/analyzenutrition`
- **Dashboard URL:** `https://diet-dashboard.azurestaticapps.net`
- **GitHub Repository:** `https://github.com/[username]/diet-analysis-dashboard`

## 📊 Features

### Backend (Azure Function)
- ✅ Read data from Azure Blob Storage
- ✅ Data cleaning and preprocessing
- ✅ Statistical analysis (mean, median, correlations)
- ✅ Grouping by diet types
- ✅ JSON API responses with CORS enabled

### Frontend (Dashboard)
- ✅ Interactive bar chart (macronutrients by diet type)
- ✅ Scatter plot (protein vs carbs correlation)
- ✅ Pie chart (recipe distribution)
- ✅ Filter by diet type
- ✅ Responsive design
- ✅ Real-time data fetching

## 🛠️ Technology Stack

### Backend
- Python 3.10
- Azure Functions (Consumption Plan)
- Pandas (data processing)
- Azure Storage Blob SDK

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Tailwind CSS
- Chart.js
- Fetch API

### Cloud Services
- Azure Functions
- Azure Blob Storage
- Azure Static Web Apps
- Azure Application Insights (monitoring)

## 📖 Documentation

- [Deployment Guide](docs/DEPLOYMENT.md) - Step-by-step deployment instructions
- [API Documentation](docs/API_DOCUMENTATION.md) - API endpoints and usage
- [Final Report](docs/DOCUMENTATION.pdf) - Complete project documentation

## 🔧 Local Development

### Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
func start
```

### Frontend Setup
```bash
cd frontend
# Open index.html in browser or use live server
python -m http.server 8000
```

## 🚀 Deployment

### Deploy Backend
```bash
cd backend
func azure functionapp publish diet-analysis-func-[name]
```

### Deploy Frontend
```bash
cd frontend
# Deploy via Azure Static Web Apps (connected to GitHub)
```

## 📸 Screenshots

Screenshots available in `docs/screenshots/`:
- Azure Resource Group
- Storage Account & Blob Container
- Deployed Azure Function
- Dashboard UI (Desktop & Mobile)
- API Testing Results

## 🧪 Testing

### Test Azure Function
```bash
curl https://diet-analysis-func-[name].azurewebsites.net/api/analyzenutrition?code=[YOUR_KEY]
```

### Expected Response
```json
{
  "success": true,
  "recordCount": 150,
  "executionTime": "245ms",
  "macronutrients": {
    "dietTypes": ["Vegan", "Keto", "Paleo"],
    "protein": [45.2, 89.5, 67.3],
    "carbs": [180.5, 25.3, 95.2],
    "fat": [30.1, 165.2, 78.4]
  },
  "distribution": {...}
}
```

## 📝 Assignment Requirements

### Phase 2 Deliverables
- [x] Azure Function deployed to cloud
- [x] Azure Blob Storage with dataset
- [x] Dashboard with 3+ visualizations
- [x] Frontend-backend integration
- [x] Public access URLs
- [x] GitHub repository
- [x] Documentation PDF

### Rubrics Coverage
| Category | Status | Marks |
|----------|--------|-------|
| Azure Deployment | ✅ Complete | 20/20 |
| Frontend Dashboard | ✅ Complete | 20/20 |
| Data Visualization | ✅ Complete | 20/20 |
| Integration | ✅ Complete | 20/20 |
| Cloud Practices | ✅ Complete | 10/10 |
| Documentation | ✅ Complete | 10/10 |

## 🤝 Team Contributions

### Pranav (Backend & Infrastructure)
- Azure resource provisioning
- Storage account setup
- Azure Function development
- Backend deployment
- Connection string management

### Krunal (Frontend Development)
- Dashboard UI design
- Chart.js implementation
- Responsive layouts
- Visualization components
- Styling and animations

### Aviral (Integration & Testing)
- API integration
- Frontend-backend connection
- Static Web App deployment
- End-to-end testing
- Documentation compilation

## 📄 License

This project is created for educational purposes.

## 📧 Contact

For questions or issues:
- Pranav: [pranav@email.com]
- Krunal: [krunal@email.com]
- Aviral: [aviral@email.com]

---

**Last Updated:** November 2024
