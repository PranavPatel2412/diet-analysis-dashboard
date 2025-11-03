// Main Application Logic

/**
 * Initialize dashboard on page load
 */
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Dashboard initializing...');
    
    // Check API health
    const isHealthy = await checkAPIHealth();
    if (!isHealthy) {
        showError('Warning: API health check failed. Some features may not work.');
    }
    
    // Load initial data
    await loadDashboardData();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('Dashboard initialized successfully');
});

/**
 * Load and render dashboard data
 * @param {string} dietFilter - Diet type filter
 */
async function loadDashboardData(dietFilter = 'all') {
    try {
        // Fetch data from API
        const data = await fetchNutritionalInsights(dietFilter);
        
        if (!data || !data.success) {
            showError('Failed to load data. Please try again.');
            return;
        }
        
        // Update metadata
        updateMetadata(data);
        
        // Render charts
        if (data.macronutrients) {
            createBarChart(data.macronutrients);
        }
        
        if (data.scatterData) {
            createScatterPlot(data.scatterData);
        }
        
        if (data.distribution) {
            createPieChart(data.distribution);
        }
        
        showSuccess('Data loaded successfully!');
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showError('An error occurred while loading data: ' + error.message);
    }
}

/**
 * Update metadata display
 * @param {Object} data - Response data from API
 */
function updateMetadata(data) {
    // Update execution time
    const execTimeEl = document.getElementById('execTime');
    if (execTimeEl) {
        execTimeEl.textContent = data.executionTime || '--';
    }
    
    // Update record count
    const recordCountEl = document.getElementById('recordCount');
    if (recordCountEl) {
        recordCountEl.textContent = data.recordCount || 0;
    }
    
    // Update active filter
    const activeFilterEl = document.getElementById('activeFilter');
    if (activeFilterEl) {
        const filterText = data.filter === 'all' ? 'All' : data.filter.charAt(0).toUpperCase() + data.filter.slice(1);
        activeFilterEl.textContent = filterText;
    }
    
    // Update last updated time
    const lastUpdateEl = document.getElementById('lastUpdate');
    if (lastUpdateEl) {
        const now = new Date();
        lastUpdateEl.textContent = now.toLocaleTimeString();
    }
}

/**
 * Setup event listeners for interactive elements
 */
function setupEventListeners() {
    // Diet filter dropdown
    const dietFilter = document.getElementById('dietFilter');
    if (dietFilter) {
        dietFilter.addEventListener('change', function(e) {
            const selectedDiet = e.target.value;
            console.log('Filter changed to:', selectedDiet);
            loadDashboardData(selectedDiet);
        });
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            console.log('Refresh button clicked');
            const currentFilter = document.getElementById('dietFilter')?.value || 'all';
            
            // Add rotation animation to button icon
            const icon = refreshBtn.querySelector('svg');
            if (icon) {
                icon.classList.add('animate-spin');
                setTimeout(() => {
                    icon.classList.remove('animate-spin');
                }, 1000);
            }
            
            loadDashboardData(currentFilter);
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + R to refresh
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            const currentFilter = document.getElementById('dietFilter')?.value || 'all';
            loadDashboardData(currentFilter);
        }
    });
}

/**
 * Handle window resize for responsive charts
 */
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        console.log('Window resized, charts adjusted');
    }, 250);
});

/**
 * Handle offline/online events
 */
window.addEventListener('online', function() {
    showSuccess('Connection restored. Refreshing data...');
    const currentFilter = document.getElementById('dietFilter')?.value || 'all';
    loadDashboardData(currentFilter);
});

window.addEventListener('offline', function() {
    showError('No internet connection. Please check your network.');
});

// Log when page is about to unload
window.addEventListener('beforeunload', function() {
    console.log('Dashboard unloading...');
    destroyAllCharts();
});
```

---

### **📄 frontend/assets/.gitkeep**
```
# This file keeps the assets folder in git
