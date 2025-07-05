document.addEventListener('DOMContentLoaded', function () {
    // Form elements
    const form = document.getElementById('recruiterSignupForm');
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const jobTitle = document.getElementById('jobTitle');
    const profilePicture = document.getElementById('profilePicture');
    const profileBtn = document.getElementById('profileBtn');
    const profileName = document.getElementById('profileName');
    const profilePreview = document.getElementById('profilePreview');
    const profilePlaceholder = document.getElementById('profilePlaceholder');
    const companyName = document.getElementById('companyName');
    const industry = document.getElementById('industry');
    const industryTags = document.getElementById('industryTags');
    const companyWebsite = document.getElementById('companyWebsite');
    const companySize = document.getElementById('companySize');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordStrengthBar = document.getElementById('passwordStrengthBar');
    const passwordStrengthText = document.getElementById('passwordStrengthText');

    // Error message elements
    const fullNameError = document.getElementById('fullNameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const jobTitleError = document.getElementById('jobTitleError');
    const companyNameError = document.getElementById('companyNameError');
    const industryError = document.getElementById('industryError');
    const websiteError = document.getElementById('websiteError');
    const companySizeError = document.getElementById('companySizeError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    // Industry tags array
    let industries = [];

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

    // Industry tags handler
    industry.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && industry.value.trim() !== '') {
            e.preventDefault();

            const tag = industry.value.trim();
            if (!industries.includes(tag)) {
                industries.push(tag);
                renderIndustryTags();
            }

            industry.value = '';
        }
    });

    // Render industry tags
    function renderIndustryTags() {
        industryTags.innerHTML = '';

        industries.forEach((tag, index) => {
            const tagElement = document.createElement('div');
            tagElement.className = 'industry-tag';
            tagElement.innerHTML = `${tag} <i class="fas fa-times" data-index="${index}"></i>`;
            industryTags.appendChild(tagElement);
        });

        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.industry-tag i');
        removeButtons.forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                industries.splice(index, 1);
                renderIndustryTags();
            });
        });
    }

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

        // Validate job title
        if (!jobTitle.value.trim()) {
            jobTitleError.style.display = 'block';
            isValid = false;
        }

        // Validate company name
        if (!companyName.value.trim()) {
            companyNameError.style.display = 'block';
            isValid = false;
        }

        // // Validate industry
        // if (industries.length === 0) {
        //     industryError.style.display = 'block';
        //     isValid = false;
        // }

        // Validate website if provided
        if (companyWebsite.value.trim() !== '') {
            try {
                new URL(companyWebsite.value);
            } catch (e) {
                websiteError.style.display = 'block';
                isValid = false;
            }
        }

        // Validate company size
        if (!companySize.value) {
            companySizeError.style.display = 'block';
            isValid = false;
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

        // Submit form if valid
        if (isValid) {
            const formData = new FormData();

            formData.append('full_name', fullName.value.trim());
            formData.append('email', email.value.trim());
            formData.append('phone_number', phone.value.trim());
            formData.append('password', password.value);
            formData.append('job_title', jobTitle.value.trim());
            formData.append('company_name', companyName.value.trim());
            formData.append('industry', industries.join(','));
            formData.append('company_website', companyWebsite.value.trim());
            formData.append('company_size', companySize.value);

            // Add profile image if selected
            if (profilePicture.files[0]) {
                formData.append('profile_image', profilePicture.files[0]);
            }
            console.log(formData)

            fetch('http://127.0.0.1:8000/api/v1/auth/recruiter/signup', {
                method: 'POST',
                body: formData
                // Do NOT set Content-Type header; browser will set it automatically for FormData
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => { throw data; });
                }
                return response.json();
            })
            .then(data => {
                alert('Registration successful! You can now log in to your recruiter account.');
                window.location.href = 'login.html';
            })
            .catch(error => {
                alert('Signup failed: ' + (error.message || JSON.stringify(error)));
            });
        }
    });
});