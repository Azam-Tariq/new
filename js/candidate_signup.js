document.addEventListener('DOMContentLoaded', function () {
    // Form elements
    const form = document.getElementById('candidateSignupForm');
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const education = document.getElementById('education');
    const experience = document.getElementById('experience');
    const skills = document.getElementById('skills');
    const profilePicture = document.getElementById('profilePicture');
    const profileBtn = document.getElementById('profileBtn');
    const profileName = document.getElementById('profileName');
    const profilePreview = document.getElementById('profilePreview');
    const profilePlaceholder = document.getElementById('profilePlaceholder');
    const resume = document.getElementById('resume');
    const resumeBtn = document.getElementById('resumeBtn');
    const resumeName = document.getElementById('resumeName');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordStrengthBar = document.getElementById('passwordStrengthBar');
    const passwordStrengthText = document.getElementById('passwordStrengthText');
    const termsCheck = document.getElementById('termsCheck');

    // Error message elements
    const fullNameError = document.getElementById('fullNameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const educationError = document.getElementById('educationError');
    const experienceError = document.getElementById('experienceError');
    const skillsError = document.getElementById('skillsError');
    const resumeError = document.getElementById('resumeError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const termsError = document.getElementById('termsError');

    // Profile picture upload button click handler
    profileBtn.addEventListener('click', function () {
        profilePicture.click();
    });

    // Profile picture change handler
    profilePicture.addEventListener('change', function () {
        const file = profilePicture.files[0];
        if (file) {
            // Validate file size (5MB = 5 * 1024 * 1024 bytes)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size exceeds 5MB. Please choose a smaller file.');
                profilePicture.value = '';
                return;
            }
            profileName.textContent = file.name;
            profileName.style.display = 'block';

            // Preview image
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePreview.src = e.target.result;
                profilePreview.style.display = 'block';
                profilePlaceholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        } else {
            profileName.textContent = 'No file chosen';
            profilePreview.style.display = 'none';
            profilePlaceholder.style.display = 'block';
        }
    });

    // Resume upload button click handler
    resumeBtn.addEventListener('click', function () {
        resume.click();
    });

    // Resume change handler
    resume.addEventListener('change', function () {
        const file = resume.files[0];
        if (file) {
            // Validate file size (10MB = 10 * 1024 * 1024 bytes)
            if (file.size > 10 * 1024 * 1024) {
                alert('File size exceeds 10MB. Please choose a smaller file.');
                resume.value = '';
                return;
            }
            resumeName.textContent = file.name;
            resumeName.style.display = 'block';
        } else {
            resumeName.textContent = 'No file chosen';
        }
    });

    // Password toggle handlers
    togglePassword.addEventListener('click', function () {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        togglePassword.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    toggleConfirmPassword.addEventListener('click', function () {
        const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPassword.setAttribute('type', type);
        toggleConfirmPassword.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    // Password strength checker
    password.addEventListener('input', function () {
        const value = password.value;
        let strength = 0;

        if (value.length >= 8) strength += 25;
        if (value.match(/[a-z]+/)) strength += 25;
        if (value.match(/[A-Z]+/)) strength += 25;
        if (value.match(/[0-9]+/) || value.match(/[^a-zA-Z0-9]+/)) strength += 25;

        passwordStrengthBar.style.width = strength + '%';

        if (strength <= 25) {
            passwordStrengthBar.style.backgroundColor = '#dc3545';
            passwordStrengthText.textContent = 'Weak';
        } else if (strength <= 50) {
            passwordStrengthBar.style.backgroundColor = '#ffc107';
            passwordStrengthText.textContent = 'Fair';
        } else if (strength <= 75) {
            passwordStrengthBar.style.backgroundColor = '#17a2b8';
            passwordStrengthText.textContent = 'Good';
        } else {
            passwordStrengthBar.style.backgroundColor = '#28a745';
            passwordStrengthText.textContent = 'Strong';
        }
    });

    // Form validation
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        // Reset error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.style.display = 'none');

        // Validate full name
        if (!fullName.value.trim()) {
            fullNameError.style.display = 'block';
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            emailError.style.display = 'block';
            isValid = false;
        }

        // Validate phone
        const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
        if (!phoneRegex.test(phone.value)) {
            phoneError.style.display = 'block';
            isValid = false;
        }

        // Validate education
        if (!education.value.trim()) {
            educationError.style.display = 'block';
            isValid = false;
        }

        // Validate experience
        if (experience.value === '' || isNaN(experience.value) || experience.value < 0 || experience.value > 50) {
            experienceError.style.display = 'block';
            isValid = false;
        }

        // Validate skills
        if (!skills.value.trim()) {
            skillsError.style.display = 'block';
            isValid = false;
        }

        // Validate resume
        if (resume.files.length === 0) {
            resumeError.style.display = 'block';
            isValid = false;
        } else {
            const file = resume.files[0];
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

            if (!allowedTypes.includes(file.type)) {
                resumeError.textContent = 'Please upload a PDF, DOC, or DOCX file';
                resumeError.style.display = 'block';
                isValid = false;
            }
        }

        // Validate profile picture if selected
        if (profilePicture.files.length > 0) {
            const file = profilePicture.files[0];
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

            if (!allowedTypes.includes(file.type)) {
                alert('Please select a valid image file (JPG, PNG)');
                isValid = false;
            }
        }

        // Validate password
        if (password.value.length < 8) {
            passwordError.style.display = 'block';
            isValid = false;
        }

        // Validate confirm password
        if (password.value !== confirmPassword.value) {
            confirmPasswordError.style.display = 'block';
            isValid = false;
        }

        // Validate terms
        if (!termsCheck.checked) {
            termsError.style.display = 'block';
            isValid = false;
        }

        // Submit form if valid
        if (isValid) {
            // In a real application, you would submit the form data to the server here
            alert('Registration successful! You can now log in to your account.');
            window.location.href = 'login.html';
        }
    });
});