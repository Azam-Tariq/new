let editingJobId = null;
const DEFAULT_RECRUITER_ID = '6b2a3a33-45fd-4d97-be40-56d004ed8b06'; // Default recruiter ID

// Hardcoded job data
const hardcodedJobs = [
    {
        id: 1,
        recruiter_id: DEFAULT_RECRUITER_ID,
        job_title: "Frontend Developer",
        job_description: "Develop responsive web interfaces using HTML, CSS, JavaScript, and React.",
        education: "Bachelor's in Computer Science",
        experience: 2,
        skills: "HTML, CSS, JavaScript, React",
        location: "Lahore",
        job_type: "Full-Time",
        application_deadline: "2025-08-15",
        contact_details: "hr@frontendcompany.com"
    },
    {
        id: 2,
        recruiter_id: DEFAULT_RECRUITER_ID,
        job_title: "Backend Developer",
        job_description: "Build REST APIs and integrate databases using Python and Django.",
        education: "Bachelor's in Software Engineering",
        experience: 3,
        skills: "Python, Django, REST API, PostgreSQL",
        location: "Karachi",
        job_type: "Remote",
        application_deadline: "2025-08-20",
        contact_details: "careers@backendco.org"
    }
];

// Overriding fetchJobs to use hardcoded data
async function fetchJobs(recruiter_id = DEFAULT_RECRUITER_ID) {
    try {
        const jobs = hardcodedJobs.filter(job => job.recruiter_id === recruiter_id);
        renderJobs(jobs);
    } catch (err) {
        console.error('Error loading jobs:', err);
        document.getElementById("jobList").innerHTML = `<div class="col-12 text-center"><p style="color:#dc3545;">Error loading jobs. Please try again later.</p></div>`;
    }
}

function renderJobs(jobs) {
    const container = document.getElementById("jobList");
    container.innerHTML = "";
    if (jobs.length === 0) {
        container.innerHTML = `<div class="col-12 text-center"><p>No jobs found.</p></div>`;
        return;
    }

    jobs.forEach((job) => {
        const cardDiv = document.createElement("div");
        cardDiv.className = "col-12 mb-4";
        if (editingJobId === job.id) {
            cardDiv.innerHTML = createEditForm(job, job.id).outerHTML;
        } else {
            cardDiv.innerHTML = createJobCard(job, job.id).outerHTML;
        }
        container.appendChild(cardDiv);
    });
}

function toggleDropdown(id) {
    document.querySelectorAll(".dropdown-content").forEach(menu => {
        menu.style.display = menu.id === `dropdown-${id}` && menu.style.display !== "block" ? "block" : "none";
    });
}

window.addEventListener("click", e => {
    if (!e.target.classList.contains("dots-menu") && !e.target.closest(".dots-menu")) {
        document.querySelectorAll(".dropdown-content").forEach(menu => menu.style.display = "none");
    }
});

function createJobCard(job, id) {
    const card = document.createElement("div");
    card.className = "job-card animate-fade-in animate-delay-2";
    card.innerHTML = `
        <div class="dots-menu" onclick="toggleDropdown(${id})"><i class="fas fa-ellipsis-v"></i></div>
        <div id="dropdown-${id}" class="dropdown-content">
          <a onclick="startEditJob(${id})"><i class="bi bi-pencil-square me-2"></i>Edit</a>
          <a style="color:#dc3545;" onclick="deleteJob(${id})"><i class="bi bi-trash me-2"></i>Delete</a>
        </div>
        <div class="job-title">${job.job_title}</div>
        <div class="job-desc">${job.job_description}</div>
        <div class="job-details"><strong>Education:</strong> ${job.education || 'N/A'}</div>
        <div class="job-details"><strong>Experience:</strong> ${job.experience || 'N/A'} years</div>
        <div class="job-details"><strong>Skills:</strong> ${job.skills}</div>
        <div class="job-details"><strong>Location:</strong> ${job.location}</div>
        <div class="job-details"><strong>Type:</strong> ${job.job_type}</div>
        <div class="job-details"><strong>Deadline:</strong> ${job.application_deadline || 'N/A'}</div>
        <div class="job-details"><strong>Contact:</strong> ${job.contact_details}</div>
        <div class="btn-group">
          <button class="submit-btn" onclick="viewApplications(${id})"><i class="bi bi-file-earmark-text me-2"></i>Applications</button>
          <button class="submit-btn" onclick="viewInterviews(${id})"><i class="bi bi-camera-video me-2"></i>Interview</button>
        </div>
      `;
    return card;
}

function createEditForm(job, id) {
    const form = document.createElement("div");
    form.className = "edit-form animate-fade-in animate-delay-2";
    form.innerHTML = `
        <h4>Edit Job</h4>
        <div class="row">
          <div class="col-md-6 form-group">
            <label for="jobTitle-${id}">Job Title <span style="color:#dc3545;">*</span></label>
            <input type="text" id="jobTitle-${id}" value="${job.job_title || ''}" required />
            <div class="error-message" id="jobTitleError-${id}">Please enter the job title</div>
          </div>
        </div>
        <div class="form-group">
          <label for="jobDescription-${id}">Description <span style="color:#dc3545;">*</span></label>
          <textarea id="jobDescription-${id}" required>${job.job_description || ''}</textarea>
          <div class="error-message" id="jobDescriptionError-${id}">Please enter the job description</div>
        </div>
        <div class="row">
          <div class="col-md-6 form-group">
            <label for="education-${id}">Education</label>
            <input type="text" id="education-${id}" value="${job.education || ''}" />
          </div>
          <div class="col-md-6 form-group">
            <label for="experience-${id}">Experience (years)</label>
            <input type="number" id="experience-${id}" value="${job.experience || ''}" min="0" />
            <div class="error-message" id="experienceError-${id}">Please enter a valid number of years</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 form-group">
            <label for="skills-${id}">Skills <span style="color:#dc3545;">*</span></label>
            <input type="text" id="skills-${id}" value="${job.skills || ''}" required />
            <div class="error-message" id="skillsError-${id}">Please enter at least one skill</div>
          </div>
          <div class="col-md-6 form-group">
            <label for="location-${id}">Location <span style="color:#dc3545;">*</span></label>
            <input type="text" id="location-${id}" value="${job.location || ''}" required />
            <div class="error-message" id="locationError-${id}">Please enter the job location</div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 form-group">
            <label for="jobType-${id}">Job Type <span style="color:#dc3545;">*</span></label>
            <select id="jobType-${id}" required>
              <option value="">Select Job Type</option>
              <option value="Full-Time" ${job.job_type === 'Full-Time' ? 'selected' : ''}>Full-Time</option>
              <option value="Part-Time" ${job.job_type === 'Part-Time' ? 'selected' : ''}>Part-Time</option>
              <option value="Remote" ${job.job_type === 'Remote' ? 'selected' : ''}>Remote</option>
              <option value="Internship" ${job.job_type === 'Internship' ? 'selected' : ''}>Internship</option>
            </select>
            <div class="error-message" id="jobTypeError-${id}">Please select a job type</div>
          </div>
          <div class="col-md-6 form-group">
            <label for="deadline-${id}">Application Deadline</label>
            <input type="date" id="deadline-${id}" value="${job.application_deadline || ''}" />
          </div>
        </div>
        <div class="form-group">
          <label for="contactEmail-${id}">Contact Email <span style="color:#dc3545;">*</span></label>
          <input type="email" id="contactEmail-${id}" value="${job.contact_details || ''}" required />
          <div class="error-message" id="contactEmailError-${id}">Please enter a valid email address</div>
        </div>
        <div class="edit-actions">
          <button class="submit-btn" onclick="submitEdit(${id})"><i class="fas fa-save me-2"></i>Save</button>
          <button class="submit-btn" onclick="cancelEdit()"><i class="fas fa-times me-2"></i>Cancel</button>
        </div>
      `;
    return form;
}

function startEditJob(id) {
    editingJobId = id;
    fetchJobs();
}

function cancelEdit() {
    editingJobId = null;
    fetchJobs();
}

function submitEdit(id) {
    alert("In demo mode, editing is not connected to a backend.");
    editingJobId = null;
    fetchJobs();
}

function deleteJob(id) {
    if (!confirm("Are you sure you want to delete this job?")) return;
    const index = hardcodedJobs.findIndex(job => job.id === id);
    if (index !== -1) {
        hardcodedJobs.splice(index, 1);
        alert("Job deleted.");
        fetchJobs();
    } else {
        alert("Job not found.");
    }
}

function viewApplications(id) {
    alert(`View applications for job ID ${id}`);
}

function viewInterviews(id) {
    alert(`View interviews for job ID ${id}`);
}

// Initialize with default recruiter ID
fetchJobs(DEFAULT_RECRUITER_ID);
