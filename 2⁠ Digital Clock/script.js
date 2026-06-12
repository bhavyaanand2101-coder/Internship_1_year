// State variables
let is24HourFormat = true;

// DOM Elements
const clockDisplay = document.getElementById('clock');
const ampmDisplay = document.getElementById('ampm');
const formatBtn = document.getElementById('toggleFormat');
const themeBtn = document.getElementById('toggleTheme');

function updateClock() {
    // 1. Get the current date object
    const now = new Date();
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    let ampm = '';

    // 2. Logic for 12-hour format
    if (!is24HourFormat) {
        ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert '0' to '12'
    } else {
        ampm = ''; // Hide AM/PM in 24h mode
    }

    // 3. Format hours to always have two digits (e.g., 09)
    const formattedHours = String(hours).padStart(2, '0');

    // 4. Update the DOM
    clockDisplay.textContent = `${formattedHours}:${minutes}:${seconds}`;
    ampmDisplay.textContent = ampm;
}

// Toggle between 12h and 24h
formatBtn.addEventListener('click', () => {
    is24HourFormat = !is24HourFormat;
    formatBtn.textContent = is24HourFormat ? "Switch to 12h" : "Switch to 24h";
});

// Toggle Dark Mode
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
});

// 5. Use setInterval to run the function every 1 second (1000ms)
setInterval(updateClock, 1000);

// Initialize clock immediately on load
updateClock();