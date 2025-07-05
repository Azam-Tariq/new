 document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('reset-password-form');
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

      // Real-time password validation
      newPasswordInput.addEventListener('input', () => {
        clearMessages();
        const password = newPasswordInput.value.trim();

        if (password && !passwordRegex.test(password)) {
          errorMessage.textContent = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
          errorMessage.style.display = 'block';
        } else if (password && passwordRegex.test(password)) {
          successMessage.textContent = 'Password strength is valid.';
          successMessage.style.display = 'block';
        }
      });

      // Real-time confirm password validation
      confirmPasswordInput.addEventListener('input', () => {
        clearMessages();
        const password = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (confirmPassword && confirmPassword !== password) {
          errorMessage.textContent = 'Passwords do not match.';
          errorMessage.style.display = 'block';
        } else if (confirmPassword && confirmPassword === password && passwordRegex.test(password)) {
          successMessage.textContent = 'Passwords match and are valid.';
          successMessage.style.display = 'block';
        }
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearMessages();

        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Validate password strength
        if (!passwordRegex.test(newPassword)) {
          errorMessage.textContent = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
          errorMessage.style.display = 'block';
          return;
        }

        // Validate password match
        if (newPassword !== confirmPassword) {
          errorMessage.textContent = 'Passwords do not match.';
          errorMessage.style.display = 'block';
          return;
        }

        // Example endpoint for resetting password
        // Note: You may need to include a token or user ID in the URL or body, depending on your backend
        const apiUrl = 'http://localhost:8000/api/update-password';

        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPassword }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.detail || 'Failed to reset password');
          }

          // Success: Password reset
          successMessage.textContent = 'Password successfully reset! You can now log in.';
          successMessage.style.display = 'block';
          showNotification('Password reset successfully!');
          form.reset();
        } catch (error) {
          errorMessage.textContent = 'Error: ' + error.message;
          errorMessage.style.display = 'block';
        }
      });
    });