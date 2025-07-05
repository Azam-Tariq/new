 document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('change-password-form');
      const currentPasswordInput = document.getElementById('current-password');
      const newPasswordInput = document.getElementById('new-password');
      const confirmPasswordInput = document.getElementById('confirm-password');
      const errorMessage = document.getElementById('error-message');
      const successMessage = document.getElementById('success-message');

      // Password strength regex: at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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

      // Real-time new password validation
      newPasswordInput.addEventListener('input', () => {
        clearMessages();
        const newPassword = newPasswordInput.value.trim();

        if (newPassword && !passwordRegex.test(newPassword)) {
          errorMessage.textContent = 'New password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
          errorMessage.style.display = 'block';
        } else if (newPassword && passwordRegex.test(newPassword)) {
          successMessage.textContent = 'New password strength is valid.';
          successMessage.style.display = 'block';
        }
      });

      // Real-time confirm password validation
      confirmPasswordInput.addEventListener('input', () => {
        clearMessages();
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (confirmPassword && confirmPassword !== newPassword) {
          errorMessage.textContent = 'Passwords do not match.';
          errorMessage.style.display = 'block';
        } else if (confirmPassword && confirmPassword === newPassword && passwordRegex.test(newPassword)) {
          successMessage.textContent = 'Passwords match and are valid.';
          successMessage.style.display = 'block';
        }
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearMessages();

        const currentPassword = currentPasswordInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Validate new password strength
        if (!passwordRegex.test(newPassword)) {
          errorMessage.textContent = 'New password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
          errorMessage.style.display = 'block';
          return;
        }

        // Validate password match
        if (newPassword !== confirmPassword) {
          errorMessage.textContent = 'New passwords do not match.';
          errorMessage.style.display = 'block';
          return;
        }

        // Example endpoint for changing password
        const apiUrl = 'http://localhost:8000/api/change-password';

        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Note: You may need to include an Authorization header with a token for authenticated requests
              // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              current_password: currentPassword,
              new_password: newPassword
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            if (data.detail === 'Current password is incorrect') {
              errorMessage.textContent = 'Current password is incorrect.';
              errorMessage.style.display = 'block';
            } else {
              throw new Error(data.detail || 'Failed to change password');
            }
            return;
          }

          // Success: Password changed
          successMessage.textContent = 'Password successfully changed! You can now use your new password.';
          successMessage.style.display = 'block';
          showNotification('Password changed successfully!');
          form.reset();
        } catch (error) {
          errorMessage.textContent = 'Error: ' + error.message;
          errorMessage.style.display = 'block';
        }
      });
    });