 
    async function fetchJobs() {
      try {
        const response = await fetch('http://localhost:8000/jobs');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jobs = await response.json();
        renderJobs(jobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
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
        cardDiv.innerHTML = createJobCard(job, job.id).outerHTML;
        container.appendChild(cardDiv);
      });
    }

    function createJobCard(job, id) {
      const card = document.createElement("div");
      card.className = "job-card animate-fade-in animate-delay-2";
      card.innerHTML = `
        <div class="job-title">${job.jobTitle}</div>
        <div class="job-company">${job.companyName}</div>
        <div class="job-desc">${job.jobDescription}</div>
        <div class="job-details"><strong>Education:</strong> ${job.education || 'N/A'}</div>
        <div class="job-details"><strong>Experience:</strong> ${job.experience || 'N/A'} years</div>
        <div class="job-details"><strong>Skills:</strong> ${job.skills}</div>
        <div class="job-details"><strong>Location:</strong> ${job.location}</div>
        <div class="job-details"><strong>Salary:</strong> ${job.salary ? '$' + job.salary : 'N/A'}</div>
        <div class="job-details"><strong>Type:</strong> ${job.jobType}</div>
        <div class="job-details"><strong>Deadline:</strong> ${job.deadline || 'N/A'}</div>
        <div class="job-details"><strong>Contact:</strong> ${job.contactEmail}</div>
        <div class="btn-group">
          <button class="submit-btn" onclick="applyForJob(${id})"><i class="bi bi-file-earmark-text me-2"></i>Apply Now</button>
        </div>
      `;
      return card;
    }

    function applyForJob(id) {
      // Redirect to application page
      window.location.href = `/apply/${id}`;
    }

    document.addEventListener("DOMContentLoaded", fetchJobs);
  