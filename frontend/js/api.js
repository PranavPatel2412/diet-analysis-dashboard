// API Configuration and Functions
// IMPORTANT: Replace with your actual Azure Function URL after deployment
const API_BASE_URL = 'https://YOUR-FUNCTION-APP-NAME.azurewebsites.net/api';

/**
 * Fetch nutritional insights from Azure Function
 * @param {string} dietFilter - Diet type filter (default: 'all')
 * @returns {Promise<Object>} - Nutritional data
 */
async function fetchNutritionalInsights(dietFilter = 'all') {
    try {
        showLoading();
        
        const url = `${API_BASE_URL}/analyzenutrition?dietType=${dietFilter}`;
        
        console.log('Fetching data from:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log('Data received:', data);
        
        hideLoading();
        
        return data;
        
    } catch (error) {
        hideLoading();
        showError('Failed to fetch data: ' + error.message);
        console.error('Error fetching nutritional insights:', error);
        return null;
    }
}

/**
 * Health check for API
 * @returns {Promise<boolean>} - API health status
 */
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch (error) {
        console.error('API health check failed:', error);
        return false;
    }
}

/**
 * Show loading spinner
 */
function showLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.remove('hidden');
    }
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.add('hidden');
    }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    
    if (errorAlert && errorMessage) {
        errorMessage.textContent = message;
        errorAlert.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            closeError();
        }, 5000);
    }
}

/**
 * Close error message
 */
function closeError() {
    const errorAlert = document.getElementById('errorAlert');
    if (errorAlert) {
        errorAlert.classList.add('hidden');
    }
}

/**
 * Show success message
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message fixed top-4 right-4 z-50';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchNutritionalInsights,
        checkAPIHealth,
        showLoading,
        hideLoading,
        showError,
        closeError,
        showSuccess
    };
}
