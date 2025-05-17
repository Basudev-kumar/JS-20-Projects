class NotificationSystem {
    constructor(options = {}) {
        this.notifications = [];
        this.unreadCount = 0;
        this.soundEnabled = options.soundEnabled || false;
        this.vibrateEnabled = options.vibrateEnabled || false;
        this.darkMode = options.darkMode || false;
        
        this.initElements();
        this.setupEventListeners();
    }
    
    initElements() {
        this.notificationBell = document.getElementById('notificationBell');
        this.notificationDropdown = document.getElementById('notificationDropdown');
        this.notificationHistory = document.getElementById('notificationHistory');
        this.emptyState = this.notificationDropdown.querySelector('.empty-state');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.notificationSound = document.getElementById('notificationSound');
    }
    
    setupEventListeners() {
        this.clearAllBtn.addEventListener('click', () => this.clearAllNotifications());
    }
    
    addNotification(notification) {
        // Add timestamp
        notification.timestamp = new Date();
        notification.id = Date.now();
        notification.isRead = false;
        
        // Add to notifications array
        this.notifications.unshift(notification);
        this.unreadCount++;
        
        // Update UI
        this.updateNotificationBadge();
        this.addNotificationToDropdown(notification);
        this.addNotificationToHistory(notification);
        this.updateEmptyState();
        
        // Play sound if enabled
        if (this.soundEnabled) {
            this.playNotificationSound();
        }
        
        // Vibrate if enabled and supported
        if (this.vibrateEnabled && 'vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
        }
        
        // Show desktop notification if permission is granted
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notification.message, {
                icon: 'assets/notification-icon.png',
                badge: 'assets/notification-icon.png'
            });
        }
        
        // Trigger animation
        this.triggerBellAnimation();
        
        // Return notification ID for possible later reference
        return notification.id;
    }
    
    playNotificationSound() {
        this.notificationSound.currentTime = 0;
        this.notificationSound.play().catch(e => {
            console.log('Audio playback failed:', e);
        });
    }
    
    triggerBellAnimation() {
        this.notificationBell.classList.add('notify', 'pulse');
        
        // Remove pulse after animation completes
        setTimeout(() => {
            this.notificationBell.classList.remove('pulse');
        }, 1500);
    }
    
    updateNotificationBadge() {
        this.notificationBell.setAttribute('data-count', this.unreadCount);
        this.notificationBell.classList.add('count');
    }
    
    addNotificationToDropdown(notification) {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${notification.isRead ? '' : 'unread'}`;
        notificationItem.dataset.id = notification.id;
        
        const iconClass = this.getIconForType(notification.type);
        const badgeClass = `badge-${notification.type}`;
        
        notificationItem.innerHTML = `
            <i class="${iconClass}" style="color: var(--${notification.type}-color)"></i>
            <div class="notification-content">
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
            </div>
            ${notification.isImportant ? '<span class="important-badge">!</span>' : ''}
        `;
        
        notificationItem.addEventListener('click', () => {
            this.markAsRead(notification.id);
            notificationItem.classList.remove('unread');
        });
        
        // Insert at the top of the dropdown (after header if exists)
        const header = this.notificationDropdown.querySelector('.dropdown-header');
        if (header) {
            this.notificationDropdown.insertBefore(notificationItem, header.nextSibling);
        } else {
            this.notificationDropdown.insertBefore(notificationItem, this.notificationDropdown.firstChild);
        }
    }
    
    addNotificationToHistory(notification) {
        // Create history container if it doesn't exist
        let historyContainer = this.notificationHistory.querySelector('.history-container');
        if (!historyContainer) {
            this.notificationHistory.querySelector('.history-empty').remove();
            historyContainer = document.createElement('div');
            historyContainer.className = 'history-container';
            this.notificationHistory.appendChild(historyContainer);
        }
        
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <span>${notification.message}</span>
            <span class="history-time">${this.formatTime(notification.timestamp, true)}</span>
        `;
        
        historyContainer.insertBefore(historyItem, historyContainer.firstChild);
    }
    
    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification && !notification.isRead) {
            notification.isRead = true;
            this.unreadCount--;
            this.updateNotificationBadge();
            
            if (this.unreadCount === 0) {
                this.notificationBell.removeAttribute('data-count');
                this.notificationBell.classList.remove('count');
            }
        }
    }
    
    clearAllNotifications() {
        this.notifications.forEach(n => n.isRead = true);
        this.unreadCount = 0;
        
        // Update UI
        this.notificationBell.removeAttribute('data-count');
        this.notificationBell.classList.remove('count');
        
        // Clear dropdown
        this.notificationDropdown.innerHTML = `
            <div class="dropdown-header">
                <h3>Notifications</h3>
                <button class="clear-all" id="clearAllBtn">Clear All</button>
            </div>
            <div class="empty-state">
                <i class="fas fa-bell-slash"></i>
                <p>No notifications yet</p>
            </div>
        `;
        
        // Reattach event listener
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.clearAllBtn.addEventListener('click', () => this.clearAllNotifications());
        this.emptyState = this.notificationDropdown.querySelector('.empty-state');
    }
    
    updateEmptyState() {
        if (this.emptyState) {
            this.emptyState.style.display = 'none';
        }
        
        // Add clear all button if it doesn't exist
        if (!this.clearAllBtn || !this.clearAllBtn.isConnected) {
            const dropdownHeader = document.createElement('div');
            dropdownHeader.className = 'dropdown-header';
            dropdownHeader.innerHTML = `
                <h3>Notifications</h3>
                <button class="clear-all" id="clearAllBtn">Clear All</button>
            `;
            this.notificationDropdown.insertBefore(dropdownHeader, this.notificationDropdown.firstChild);
            
            this.clearAllBtn = document.getElementById('clearAllBtn');
            this.clearAllBtn.addEventListener('click', () => this.clearAllNotifications());
        }
    }
    
    getIconForType(type) {
        const icons = {
            message: 'fas fa-envelope',
            alert: 'fas fa-exclamation-circle',
            reminder: 'fas fa-calendar-alt',
            system: 'fas fa-cog'
        };
        return icons[type] || 'fas fa-bell';
    }
    
    formatTime(date, fullDate = false) {
        if (fullDate) {
            return date.toLocaleString();
        }
        
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const mins = Math.floor(diffInSeconds / 60);
            return `${mins} min${mins !== 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
    }
    
    setVibrateEnabled(enabled) {
        this.vibrateEnabled = enabled;
    }
    
    setDarkMode(enabled) {
        this.darkMode = enabled;
    }
    
    getUnreadCount() {
        return this.unreadCount;
    }
    
    getAllNotifications() {
        return [...this.notifications];
    }
}