document.addEventListener('DOMContentLoaded', function () {
    const screeningBtn = document.getElementById('start-screening');
    const loader = document.getElementById('loader');
    const tableContainer = document.getElementById('table-container');
    const chartContainer = document.getElementById('chart-container');
    const applicantsTable = document.getElementById('applicants-table');
    const jobTitleElement = document.getElementById('job-title');
    const applicationCountElement = document.getElementById('application-count');
  
    screeningBtn.addEventListener('click', function () {
      loader.style.display = 'block';
      tableContainer.style.display = 'none';
      chartContainer.style.display = 'none';
      screeningBtn.disabled = true;
  
      // ✅ Hardcoded Applicant Data
      const data = {
        job_title: "Frontend Developer",
        application_count: 7,
        applicants: [
          { id: 1, name: "Ali", email: "ali@example.com", score: 45, profile: "#", resume: "#" },
          { id: 2, name: "Sara", email: "sara@example.com", score: 55, profile: "#", resume: "#" },
          { id: 3, name: "Umer", email: "umer@example.com", score: 68, profile: "#", resume: "#" },
          { id: 4, name: "Ayesha", email: "ayesha@example.com", score: 75, profile: "#", resume: "#" },
          { id: 5, name: "Bilal", email: "bilal@example.com", score: 82, profile: "#", resume: "#" },
          { id: 6, name: "Nida", email: "nida@example.com", score: 91, profile: "#", resume: "#" },
          { id: 7, name: "Zain", email: "zain@example.com", score: 94, profile: "#", resume: "#" }
        ]
      };
  
      const { job_title, application_count, applicants } = data;
  
      // Update job info
      jobTitleElement.textContent = job_title;
      applicationCountElement.textContent = `Applications: ${application_count}`;
  
      // Sort by score
      applicants.sort((a, b) => b.score - a.score);
  
      // Display Table
      applicantsTable.innerHTML = '';
      applicants.forEach((applicant, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${applicant.name}</td>
          <td>${applicant.email}</td>
          <td>${applicant.score}</td>
          <td>
            <button class="action-btn profile-btn" data-profile="${applicant.profile}">View Profile</button>
            <button class="action-btn resume-btn" data-resume="${applicant.resume}">View Resume</button>
            <button class="action-btn invite-btn" data-id="${applicant.id}">Invite</button>
            <button class="action-btn reject-btn" data-id="${applicant.id}">Reject</button>
          </td>
        `;
        applicantsTable.appendChild(row);
      });
  
      // Score ranges
      const scoreRanges = [
        { range: '0-60', count: 0 },
        { range: '61-70', count: 0 },
        { range: '71-80', count: 0 },
        { range: '81-90', count: 0 },
        { range: '91-100', count: 0 }
      ];
  
      applicants.forEach(applicant => {
        const s = applicant.score;
        if (s <= 60) scoreRanges[0].count++;
        else if (s <= 70) scoreRanges[1].count++;
        else if (s <= 80) scoreRanges[2].count++;
        else if (s <= 90) scoreRanges[3].count++;
        else scoreRanges[4].count++;
      });
  
      // Bar Chart
      const ctx = document.getElementById('score-chart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: scoreRanges.map(r => r.range),
          datasets: [{
            label: 'Number of Applications',
            data: scoreRanges.map(r => r.count),
            backgroundColor: '#ffc107',
            borderColor: '#000',
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            legend: {
              labels: {
                font: {
                  family: "'Poppins', sans-serif",
                  size: 14,
                  weight: '600'
                },
                color: '#000'
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Score Ranges',
                font: {
                  family: "'Poppins', sans-serif",
                  size: 14,
                  weight: '600'
                },
                color: '#000'
              },
              ticks: {
                font: {
                  family: "'Poppins', sans-serif",
                  size: 12
                },
                color: '#333'
              },
              grid: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Applications',
                font: {
                  family: "'Poppins', sans-serif",
                  size: 14,
                  weight: '600'
                },
                color: '#000'
              },
              ticks: {
                stepSize: 1,
                precision: 0,
                font: {
                  family: "'Poppins', sans-serif",
                  size: 12
                },
                color: '#333'
              },
              grid: {
                color: '#e0e0e0'
              }
            }
          }
        }
      });
  
      loader.style.display = 'none';
      tableContainer.style.display = 'block';
      chartContainer.style.display = 'block';
      screeningBtn.disabled = false;
    });
  
    applicantsTable.addEventListener('click', function (e) {
      const btn = e.target.closest('.action-btn');
      if (!btn) return;
      const id = btn.dataset.id;
  
      if (btn.classList.contains('profile-btn')) {
        window.open(btn.dataset.profile, '_blank');
      } else if (btn.classList.contains('resume-btn')) {
        window.open(btn.dataset.resume, '_blank');
      } else if (btn.classList.contains('invite-btn')) {
        alert(`Interview Invite sent to ID: ${id}`);
      } else if (btn.classList.contains('reject-btn')) {
        alert(`Applicant ID ${id} Rejected`);
      }
    });
  });
  