
    async function fetchNotifications() {
      try {
        const response = await fetch('http://localhost:8000/notifications');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const notifications = await response.json();
        renderNotifications(notifications);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        document.getElementById("notificationList").innerHTML = `<div class="col-12 text-center"><p style="color:#dc3545;">Error loading notifications. Please try again later.</p></div>`;
      }
    }

    function renderNotifications(notifications) {
      const container = document.getElementById("notificationList");
      container.innerHTML = "";
      if (notifications.length === 0) {
        container.innerHTML = `<div class="col-12 text-center"><p>No notifications found.</p></div>`;
        return;
      }

      notifications.forEach((notification) => {
        const cardDiv = document.createElement("div");
        cardDiv.className = "col-12 mb-4";
        cardDiv.innerHTML = createNotificationCard(notification, notification.id).outerHTML;
        container.appendChild(cardDiv);
      });
    }

    function createNotificationCard(notification, id) {
      const card = document.createElement("div");
      card.className = `notification-card ${notification.type} animate-fade-in animate-delay-2`;
      const iconClass = {
        info: 'bi-info-circle text-primary',
        success: 'bi-check-circle text-success',
        warning: 'bi-exclamation-circle text-warning',
        error: 'bi-x-circle text-danger'
      }[notification.type] || 'bi-bell';
      const formattedDate = new Date(notification.createdAt).toLocaleString();
      card.innerHTML = `
        <div class="notification-message">
          <i class="${iconClass} notification-icon"></i>${notification.message}
        </div>
        <div class="notification-timestamp">${formattedDate}</div>
        ${notification.isRead ? '' : `
          <button class="submit-btn" onclick="markAsRead(${id}, this)">
            <i class="fas fa-check me-2"></i>Mark as Read
          </button>
        `}
      `;
      return card;
    }

    async function markAsRead(id, button) {
      const card = button.closest('.notification-card');
      const originalButtonHTML = button.outerHTML;
      button.disabled = true;
      button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Marking...';

      try {
        const response = await fetch(`http://localhost:8000/notifications/${id}/read`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        card.querySelector('.notification-message').style.opacity = '0.6';
        button.remove();
      } catch (err) {
        console.error('Error marking notification as read:', err);
        button.outerHTML = originalButtonHTML;
        alert('Failed to mark as read. Please try again.');
      }
    }

    document.addEventListener("DOMContentLoaded", fetchNotifications);
  