document.addEventListener('DOMContentLoaded', function () {
    const jobForm = document.getElementById('job-form');
    const companyName = document.getElementById('company-name');
    const jobTitle = document.getElementById('job-title');
    const jobDesc = document.getElementById('job-desc');
    const jobEducation = document.getElementById('job-education');
    const jobExperience = document.getElementById('job-experience');
    const jobSkills = document.getElementById('job-skills');
    const jobLocation = document.getElementById('job-location');
    const jobSalary = document.getElementById('job-salary');
    const jobType = document.getElementById('job-type');
    const jobDeadline = document.getElementById('job-deadline');
    const jobEmail = document.getElementById('job-email');

    // Error message elements
    const companyNameError = document.getElementById('companyNameError');
    const jobTitleError = document.getElementById('jobTitleError');
    const jobDescError = document.getElementById('jobDescError');
    const jobExperienceError = document.getElementById('jobExperienceError');
    const jobSkillsError = document.getElementById('jobSkillsError');
    const jobLocationError = document.getElementById('jobLocationError');
    const jobTypeError = document.getElementById('jobTypeError');
    const jobEmailError = document.getElementById('jobEmailError');

    jobForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        let isValid = true;

        // Reset error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.style.display = 'none');

        // Validate company name
        if (!companyName.value.trim()) {
            companyNameError.style.display = 'block';
            isValid = false;
        }

        // Validate job title
        if (!jobTitle.value.trim()) {
            jobTitleError.style.display = 'block';
            isValid = false;
        }

        // Validate job description
        if (!jobDesc.value.trim()) {
            jobDescError.style.display = 'block';
            isValid = false;
        }

        // Validate experience (optional)
        if (!jobExperience.value) {
            const exp = parseFloat(jobExperience.value);
            if (isNaN(exp) || exp < 0 || exp > 50) {
                jobExperienceError.style.display = 'block';
                isValid = false;
            }
        }

        // Validate skills
        if (!jobSkills.value.trim()) {
            jobSkillsError.style.display = 'block';
            isValid = false;
        }

        // Validate location
        if (!jobLocation.value.trim()) {
            jobLocationError.style.display = 'block';
            isValid = false;
        }

        // Validate job type
        if (!jobType.value) {
            jobTypeError.style.display = 'block';
            isValid = false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(jobEmail.value)) {
            jobEmailError.style.display = 'block';
            isValid = false;
        }

        // Submit form if valid
        if (isValid) {
            try {
                const jobData = {
                    job_title: jobTitle.value.trim(),
                    job_description: jobDesc.value.trim(),
                    education: jobEducation.value.trim(),
                    experience: jobExperience.value ? parseFloat(jobExperience.value) : 0,
                    skills: jobSkills.value.trim(),
                    location: jobLocation.value.trim(),
                    job_type: jobType.value,
                    contact_email: jobEmail.value.trim(),
                    recruiter_id: "6b2a3a33-45fd-4d97-be40-56d004ed8b06"
                };
                alert(JSON.stringify(jobData, null, 2));

                const response = await fetch('http://127.0.0.1:8000/api/v1/job/post', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(jobData)
                });

                if (!response.ok) {
                    throw new Error('Failed to post job');
                }

                const result = await response.json();
                alert('Job posted successfully!');
                jobForm.reset();
            } catch (error) {
                console.error('Error posting job:', error);
                alert('Failed to post job. Please try again.');
            }
        }
    });
});
