// Initialize charts
let vitalSignsChart;
let historyChart;

// Initialize device state
let deviceOn = false;

// Normal ranges for vital signs
const normalRanges = {
    heartRate: { min: 60, max: 100 },
    temperature: { min: 36.5, max: 37.5 },
    oxygen: { min: 95, max: 100 }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    setupEventListeners();
});

// Initialize charts
function initializeCharts() {
    // Vital Signs Chart
    const vitalSignsCtx = document.getElementById('vitalSignsChart').getContext('2d');
    vitalSignsChart = new Chart(vitalSignsCtx, {
        type: 'line',
        data: {
            labels: ['Heart Rate', 'Temperature', 'Oxygen'],
            datasets: [{
                label: 'Current Values',
                data: [75, 37.0, 98],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    // History Chart
    const historyCtx = document.getElementById('historyChart').getContext('2d');
    historyChart = new Chart(historyCtx, {
        type: 'line',
        data: {
            labels: ['1h', '2h', '3h', '4h', '5h', '6h'],
            datasets: [
                {
                    label: 'Heart Rate',
                    data: [72, 75, 78, 76, 74, 75],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    tension: 0.1
                },
                {
                    label: 'Temperature',
                    data: [36.8, 37.0, 37.1, 37.0, 36.9, 37.0],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    tension: 0.1
                },
                {
                    label: 'Oxygen',
                    data: [97, 98, 98, 97, 98, 98],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Slider event listeners
    document.getElementById('heartRateSlider').addEventListener('input', function(e) {
        updateVitalSign('heartRate', e.target.value);
    });

    document.getElementById('temperatureSlider').addEventListener('input', function(e) {
        updateVitalSign('temperature', e.target.value);
    });

    document.getElementById('oxygenSlider').addEventListener('input', function(e) {
        updateVitalSign('oxygen', e.target.value);
    });

    // Power button event listener
    document.getElementById('powerButton').addEventListener('click', toggleDevice);
}

// Update vital sign values
function updateVitalSign(type, value) {
    // Update display value
    document.getElementById(`${type}Value`).textContent = value;

    // Update device display if on
    if (deviceOn) {
        document.getElementById(`demo${type.charAt(0).toUpperCase() + type.slice(1)}`).textContent = value;
    }

    // Update chart
    const index = type === 'heartRate' ? 0 : type === 'temperature' ? 1 : 2;
    vitalSignsChart.data.datasets[0].data[index] = parseFloat(value);
    vitalSignsChart.update();

    // Check for alerts
    checkAlerts(type, value);
}

// Check for alerts
function checkAlerts(type, value) {
    const alertsContainer = document.getElementById('alertsContainer');
    const dashboardAlerts = document.getElementById('dashboardAlerts');
    value = parseFloat(value);

    // Clear previous alerts
    alertsContainer.innerHTML = '';
    dashboardAlerts.innerHTML = '';

    let hasAlert = false;
    let alertMessage = '';

    if (value < normalRanges[type].min) {
        hasAlert = true;
        alertMessage = `${type === 'heartRate' ? 'Heart rate' : type === 'temperature' ? 'Temperature' : 'Oxygen level'} is too low`;
    } else if (value > normalRanges[type].max) {
        hasAlert = true;
        alertMessage = `${type === 'heartRate' ? 'Heart rate' : type === 'temperature' ? 'Temperature' : 'Oxygen level'} is too high`;
    }

    if (hasAlert) {
        // Add alert to demo container
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-warning';
        alertDiv.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i>${alertMessage}`;
        alertsContainer.appendChild(alertDiv);

        // Add alert to dashboard
        const dashboardAlert = document.createElement('div');
        dashboardAlert.className = 'alert alert-warning';
        dashboardAlert.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i>${alertMessage}`;
        dashboardAlerts.appendChild(dashboardAlert);
    } else {
        // Add success message if no alerts
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.innerHTML = '<i class="fas fa-check-circle me-2"></i>All vital signs are within normal range';
        dashboardAlerts.appendChild(successDiv);
    }
}

// Toggle device power
function toggleDevice() {
    deviceOn = !deviceOn;
    const deviceStatus = document.getElementById('deviceStatus');
    const powerButton = document.getElementById('powerButton');
    const deviceScreen = document.getElementById('deviceScreen');

    if (deviceOn) {
        deviceStatus.textContent = 'Device On';
        deviceStatus.className = 'device-status text-success';
        powerButton.innerHTML = '<i class="fas fa-power-off"></i> Power Off';
        deviceScreen.classList.add('active');

        // Update device display with current values
        document.getElementById('demoHeartRate').textContent = document.getElementById('heartRateValue').textContent;
        document.getElementById('demoTemperature').textContent = document.getElementById('temperatureValue').textContent;
        document.getElementById('demoOxygen').textContent = document.getElementById('oxygenValue').textContent;
    } else {
        deviceStatus.textContent = 'Device Off';
        deviceStatus.className = 'device-status text-danger';
        powerButton.innerHTML = '<i class="fas fa-power-off"></i> Power On';
        deviceScreen.classList.remove('active');

        // Clear device display
        document.getElementById('demoHeartRate').textContent = '--';
        document.getElementById('demoTemperature').textContent = '--';
        document.getElementById('demoOxygen').textContent = '--';
    }
} 