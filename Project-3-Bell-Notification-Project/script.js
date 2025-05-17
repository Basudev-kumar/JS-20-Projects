// DOM Elements
const addNotificationBtn = document.getElementById('addNotificationBtn');
const notificationBell = document.getElementById('notificationBell');
const notificationDropdown = document.getElementById('notificationDropdown');
const clearAllBtn = document.getElementById('clearAllBtn');
const settingsToggle = document.getElementById('settingsToggle');
const settingsPanel = document.getElementById('settingsPanel');
const soundToggle = document.getElementById('soundToggle');
const vibrateToggle = document.getElementById('vibrateToggle');
const darkModeToggle = document.getElementById('darkModeToggle');
const notificationType = document.getElementById('notificationType');
const testNotificationBtn = document.getElementById('testNotificationBtn');
const notificationSound = document.getElementById('notificationSound');
const notificationHistory = document.getElementById('notificationHistory');

// Notification system instance
const notificationSystem = new NotificationSystem({
    soundEnabled: true,
    vibrateEnabled: false,
    darkMode: false
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load settings from localStorage
    loadSettings();
    
    // Initialize service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    }
    
    // Check for Notification API permission
    checkNotificationPermission();
});

// Event Listeners
addNotificationBtn.addEventListener('click', () => {
    const type = notificationType.value;
    const message = generateRandomMessage(type);
    notificationSystem.addNotification({
        type: type,
        message: message,
        isImportant: type === 'alert'
    });
});

notificationBell.addEventListener('click', toggleDropdown);
notificationBell.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDropdown();
    }
});

clearAllBtn.addEventListener('click', () => {
    notificationSystem.clearAllNotifications();
});

settingsToggle.addEventListener('click', () => {
    settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
});

soundToggle.addEventListener('change', (e) => {
    notificationSystem.setSoundEnabled(e.target.checked);
    localStorage.setItem('soundEnabled', e.target.checked);
});

vibrateToggle.addEventListener('change', (e) => {
    notificationSystem.setVibrateEnabled(e.target.checked);
    localStorage.setItem('vibrateEnabled', e.target.checked);
});

darkModeToggle.addEventListener('change', (e) => {
    notificationSystem.setDarkMode(e.target.checked);
    localStorage.setItem('darkMode', e.target.checked);
    document.body.classList.toggle('dark-mode', e.target.checked);
});

testNotificationBtn.addEventListener('click', () => {
    const type = notificationType.value;
    const message = `Test ${type} notification`;
    notificationSystem.addNotification({
        type: type,
        message: message,
        isImportant: true
    });
});

// Functions
function toggleDropdown() {
    const isVisible = notificationDropdown.style.opacity === '1';
    if (isVisible) {
        notificationDropdown.style.transform = "translateY(20px)";
        notificationDropdown.style.opacity = "0";
        notificationDropdown.style.visibility = "hidden";
    } else {
        notificationDropdown.style.transform = "translateY(0)";
        notificationDropdown.style.opacity = "1";
        notificationDropdown.style.visibility = "visible";
    }
}

function loadSettings() {
    const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    const vibrateEnabled = localStorage.getItem('vibrateEnabled') === 'true';
    const darkMode = localStorage.getItem('darkMode') === 'true';
    
    soundToggle.checked = soundEnabled;
    vibrateToggle.checked = vibrateEnabled;
    darkModeToggle.checked = darkMode;
    
    notificationSystem.setSoundEnabled(soundEnabled);
    notificationSystem.setVibrateEnabled(vibrateEnabled);
    notificationSystem.setDarkMode(darkMode);
    
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
}

function checkNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification');
        return;
    }
    
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            console.log('Notification permission:', permission);
        });
    }
}

function generateRandomMessage(type) {
    const messages = {
        message: [
            "New message from Sarah",
            "John sent you a chat request",
            "You have 3 unread conversations"
        ],
        alert: [
            "Security alert: New login detected",
            "Urgent: System maintenance in 15 minutes",
            "Warning: Storage almost full"
        ],
        reminder: [
            "Meeting with team at 2 PM",
            "Don't forget your dentist appointment tomorrow",
            "Deadline for project submission is today"
        ],
        system: [
            "System update available",
            "Backup completed successfully",
            "New features available in latest update"
        ]
    };
    
    const typeMessages = messages[type] || messages.message;
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!notificationBell.contains(e.target)) {
        notificationDropdown.style.transform = "translateY(20px)";
        notificationDropdown.style.opacity = "0";
        notificationDropdown.style.visibility = "hidden";
    }
    
    if (!settingsToggle.contains(e.target) && !settingsPanel.contains(e.target)) {
        settingsPanel.style.display = 'none';
    }
});
































// const button = document.getElementById("_button");
// const notify = document.getElementById("_notification");

// button.addEventListener("click",()=>{
    
//     const counter = Number(notify.getAttribute("data-count")) || 0;
    
//     notify.setAttribute("data-count", counter + 1);
//     notify.classList.add("count")    
//     notify.classList.add("notify")

// });

// notify.addEventListener("animationend",()=>{
//     notify.classList.remove("notify")
// });