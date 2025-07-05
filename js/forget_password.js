 document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('forget-password-form');
      const emailInput = document.getElementById('email');
      const errorMessage = document.getElementById('error-message');
      const successMessage = document.getElementById('success-message');

      // Basic email format validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Function to clear messages
      const clearMessages = () => {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        errorMessage.textContent = '';
        successMessage.textContent = '';
      };

      // Function to show notification
      const showNotification = (message) => {
        const notificationDiv = document.createElement('div');
        notificationDiv.className = 'notification';
        notificationDiv.innerHTML = `
          <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="fas fa-check-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
        document.body.appendChild(notificationDiv);

        // Auto-remove notification after 5 seconds
        setTimeout(() => {
          notificationDiv.remove();
        }, 5000);
      };

      // Real-time email validation
      emailInput.addEventListener('input', () => {
        clearMessages();
        const email = emailInput.value.trim();
        
        if (email && !emailRegex.test(email)) {
          errorMessage.textContent = 'Please enter a valid email address.';
          errorMessage.style.display = 'block';
        } else if (email && emailRegex.test(email)) {
          successMessage.textContent = 'Email format is valid.';
          successMessage.style.display = 'block';
        }
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearMessages();
        
        const email = emailInput.value.trim();

        // Validate email format
        if (!emailRegex.test(email)) {
          errorMessage.textContent = 'Please enter a valid email address.';
          errorMessage.style.display = 'block';
          return;
        }

        // Example endpoint for checking email existence and sending reset link
        const apiUrl = 'http://localhost:8000/api/reset-password';

        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();

          if (!response.ok) {
            if (data.detail === 'Email not found') {
              errorMessage.textContent = 'This email does not exist in our records.';
              errorMessage.style.display = 'block';
            } else {
              throw new Error(data.detail || 'Failed to send reset link');
            }
            return;
          }

          // Success: Email exists and reset link sent
          successMessage.textContent = 'Password reset link sent! Please check your email.';
          successMessage.style.display = 'block';
          showNotification('Password reset link sent successfully!');
          form.reset();
        } catch (error) {
          errorMessage.textContent = 'Error: ' + error.message;
          errorMessage.style.display = 'block';
        }
      });
    });