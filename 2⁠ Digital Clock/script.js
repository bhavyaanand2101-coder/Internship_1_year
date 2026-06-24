// State variables
// Tracks the format mode: true for 24-hour representation, false for 12-hour (AM/PM) representation
let is24HourFormat = true;

// DOM Elements
// Reference to the digital clock time container
const clockDisplay = document.getElementById('clock');
// Reference to the text container showing AM/PM
const ampmDisplay = document.getElementById('ampm');
// Reference to the switch button for 12h/24h formats
const formatBtn = document.getElementById('toggleFormat');
// Reference to the dark mode toggle button
const themeBtn = document.getElementById('toggleTheme');

// Primary function to retrieve, format, and display the current system time
function updateClock() {
    // 1. Get the current date object
    const now = new Date();
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Pad minutes to always ensure 2-digit format (e.g., '05')
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Pad seconds to always ensure 2-digit format
    let ampm = '';

    // 2. Logic for 12-hour format conversion
    if (!is24HourFormat) {
        ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert hour '0' (midnight) to '12'
    } else {
        ampm = ''; // Hide AM/PM indicator in 24-hour mode
    }

    // 3. Format hours to always have two digits (e.g., 09)
    const formattedHours = String(hours).padStart(2, '0');

    // 4. Update the DOM displays with current formatted values
    clockDisplay.textContent = `${formattedHours}:${minutes}:${seconds}`;
    ampmDisplay.textContent = ampm;
}

// Toggle between 12h and 24h formats when the format button is clicked
formatBtn.addEventListener('click', () => {
    is24HourFormat = !is24HourFormat;
    formatBtn.textContent = is24HourFormat ? "Switch to 12h" : "Switch to 24h";
});

// Toggle Dark Mode styling rules by adding/removing a class on the body element
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
});

// 5. Use setInterval to run the clock update function every 1 second (1000ms)
setInterval(updateClock, 1000);

// Initialize clock display immediately on load to prevent showing initial placeholder '00:00:00'
updateClock();