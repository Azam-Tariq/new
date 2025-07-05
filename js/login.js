document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const candidateRadio = document.getElementById('candidateRadio');
    const recruiterRadio = document.getElementById('recruiterRadio');
    const candidateLabel = document.getElementById('candidateLabel');
    const recruiterLabel = document.getElementById('recruiterLabel');

    // Initialize carousel
    const carousel = new bootstrap.Carousel(document.getElementById('loginCarousel'), {
        interval: 5000,
        wrap: true
    });

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        const eyeIcon = togglePasswordBtn.querySelector('i');
        eyeIcon.classList.toggle('fa-eye');
        eyeIcon.classList.toggle('fa-eye-slash');
    });

    // User type selection
    candidateRadio.addEventListener('change', function () {
        if (this.checked) {
            candidateLabel.classList.add('active');
            recruiterLabel.classList.remove('active');
        }
    });

    recruiterRadio.addEventListener('change', function () {
        if (this.checked) {
            recruiterLabel.classList.add('active');
            candidateLabel.classList.remove('active');
        }
    });

    // Form submission
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        errorMessage.style.display = 'none';

        // Validate form
        if (!emailInput.value || !passwordInput.value) {
            errorText.textContent = 'Please fill in all fields';
            errorMessage.style.display = 'block';
            return;
        }

        // Get form data
        const userType = document.querySelector('input[name="userType"]:checked').value;
        const email = emailInput.value;
        const password = passwordInput.value;
        console.log(JSON.stringify({
            user_type: userType,
            email: email,
            password: password
        }))

        try {
            const formBody = `user_type=${encodeURIComponent(userType)}&email=${encodeURIComponent(email.trim())}&password=${encodeURIComponent(password)}`;

            const response = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: formBody
            });

            const data = await response.json();

            if (response.ok) {
                // Store the token in a cookie
                document.cookie = `auth_token=${data.access_token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days expiry

                // Redirect based on user type
                window.location.href = userType === 'Candidate' ? 'candidate_dashboard.html' : 'recruiter_dashboard.html';
            } else {
                // Handle error response
                errorText.textContent = data.message || 'Invalid email or password';
                errorMessage.style.display = 'block';
                passwordInput.value = '';
                passwordInput.focus();
            }
        } catch (error) {
            console.error('Login error:', error);
            errorText.textContent = 'An error occurred. Please try again.';
            errorMessage.style.display = 'block';
        }
    });

    // Forgot password link
    forgotPasswordLink.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = 'forgot-password.html';
    });
});