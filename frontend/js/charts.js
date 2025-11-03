// Chart.js Configuration and Rendering Functions

let barChartInstance = null;
let scatterChartInstance = null;
let pieChartInstance = null;

/**
 * Create or update bar chart for macronutrients
 * @param {Object} data - Macronutrient data
 */
function createBarChart(data) {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (barChartInstance) {
        barChartInstance.destroy();
    }
    
    barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.dietTypes || [],
            datasets: [
                {
                    label: 'Protein (g)',
                    data: data.protein || [],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Carbs (g)',
                    data: data.carbs || [],
                    backgroundColor: 'rgba(255, 206, 86, 0.7)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Fat (g)',
                    data: data.fat || [],
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 12,
                            family: "'Inter', sans-serif"
                        }
                    }
                },
                title: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + 'g';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Grams (g)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

/**
 * Create or update scatter plot
 * @param {Array} data - Scatter plot data points
 */
function createScatterPlot(data) {
    const ctx = document.getElementById('scatterPlot');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (scatterChartInstance) {
        scatterChartInstance.destroy();
    }
    
    scatterChartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Recipes',
                data: data || [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const point = context.raw;
                            return [
                                point.label || 'Recipe',
                                `Protein: ${point.x.toFixed(1)}g`,
                                `Carbs: ${point.y.toFixed(1)}g`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Protein (g)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Carbs (g)',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

/**
 * Create or update pie chart
 * @param {Object} data - Distribution data
 */
function createPieChart(data) {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (pieChartInstance) {
        pieChartInstance.destroy();
    }
    
    const colors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)',
        'rgba(83, 102, 255, 0.7)'
    ];
    
    const borderColors = colors.map(color => color.replace('0.7', '1'));
    
    pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.dietTypes || [],
            datasets: [{
                data: data.recipeCounts || [],
                backgroundColor: colors,
                borderColor: borderColors,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: {
                            size: 11,
                            family: "'Inter', sans-serif"
                        },
                        padding: 10,
                        boxWidth: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Destroy all chart instances
 */
function destroyAllCharts() {
    if (barChartInstance) {
        barChartInstance.destroy();
        barChartInstance = null;
    }
    if (scatterChartInstance) {
        scatterChartInstance.destroy();
        scatterChartInstance = null;
    }
    if (pieChartInstance) {
        pieChartInstance.destroy();
        pieChartInstance = null;
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createBarChart,
        createScatterPlot,
        createPieChart,
        destroyAllCharts
    };
}
