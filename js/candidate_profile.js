
    const API_URL = 'https://your-backend.com/api/candidate/profile/1'; // Replace with actual backend endpoint
    let candidateData = {};
    let isEditing = false;

    function renderProfile(data, editable = false) {
      const inputOrText = (key, label, type = "text") => {
        return editable
          ? `
            <div class="form-group">
              <label for="${key}">${label}<span style="color:#dc3545;">*</span></label>
              <input type="${type}" class="form-control" id="${key}" value="${data[key] || ''}" required />
              <div class="error-message" id="${key}Error">Please enter a valid ${label.toLowerCase()}</div>
            </div>
          `
          : `<p><label>${label}:</label> ${data[key] || 'N/A'}</p>`;
      };

      document.getElementById("profileCard").innerHTML = `
        <div class="profile-card animate-fade-in animate-delay-2">
          <img src="${data.photo || 'https://via.placeholder.com/150'}" alt="Profile Photo" class="profile-img" id="profileImage">
          ${
            editable
              ? `
                <div class="form-group">
                  <label for="photo">Profile Photo URL</label>
                  <input type="url" class="form-control" id="photo" value="${data.photo || ''}" />
                  <div class="error-message" id="photoError">Please enter a valid URL</div>
                </div>
              `
              : ''
          }
          <div class="profile-info">
            ${inputOrText("fullName", "Full Name")}
            ${inputOrText("email", "Email", "email")}
            ${inputOrText("phone", "Phone Number", "tel")}
            ${inputOrText("education", "Highest Qualification")}
            ${inputOrText("experience", "Years of Experience", "number")}
            ${inputOrText("skills", "Skills")}
            ${
              editable
                ? `
                  <div class="form-group">
                    <label for="resume">Resume URL<span style="color:#dc3545;">*</span></label>
                    <input type="url" class="form-control" id="resume" value="${data.resume || ''}" required />
                    <div class="error-message" id="resumeError">Please enter a valid URL</div>
                  </div>
                `
                : `<p><label>Resume:</label> ${data.resume ? `<a href="${data.resume}" target="_blank">View Resume</a>` : "Not uploaded"}</p>`
            }
          </div>
          ${
            editable
              ? `
                <div class="edit-actions">
                  <button class="submit-btn" onclick="saveProfile()"><i class="fas fa-save me-2"></i>Save</button>
                  <button class="submit-btn" onclick="cancelEdit()"><i class="fas fa-times me-2"></i>Cancel</button>
                </div>
              `
              : `
                <button class="submit-btn" onclick="enableEdit()"><i class="fas fa-edit me-2"></i>Edit Profile</button>
              `
          }
        </div>
      `;
    }

    function enableEdit() {
      isEditing = true;
      renderProfile(candidateData, true);
    }

    function cancelEdit() {
      isEditing = false;
      renderProfile(candidateData);
    }

    async function saveProfile() {
      const fields = ["photo", "fullName", "email", "phone", "education", "experience", "skills", "resume"];
      const updatedData = {};
      fields.forEach(field => {
        updatedData[field] = document.getElementById(field).value.trim();
      });

      let isValid = true;
      const errorMessages = document.querySelectorAll('.error-message');
      errorMessages.forEach(msg => (msg.style.display = 'none'));

      if (!updatedData.fullName) {
        document.getElementById('fullNameError').style.display = 'block';
        isValid = false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!updatedData.email || !emailRegex.test(updatedData.email)) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
      }
      if (!updatedData.resume || !isValidUrl(updatedData.resume)) {
        document.getElementById('resumeError').style.display = 'block';
        isValid = false;
      }
      if (updatedData.photo && !isValidUrl(updatedData.photo)) {
        document.getElementById('photoError').style.display = 'block';
        isValid = false;
      }

      if (isValid) {
        try {
          const res = await fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
          });
          if (!res.ok) throw new Error("Update failed");

          candidateData = updatedData;
          isEditing = false;
          alert("Profile updated successfully!");
          renderProfile(candidateData);
        } catch (err) {
          console.error(err);
          alert("Failed to update profile.");
        }
      }
    }

    function isValidUrl(string) {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    }

    async function loadProfile() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch profile");
        candidateData = await res.json();
        renderProfile(candidateData);
      } catch (err) {
        console.error(err);
        document.getElementById("profileCard").innerHTML = `
          <div class="col-12 text-center"><p style="color:#dc3545;">Error loading profile. Please try again later.</p></div>
        `;
      }
    }

    document.addEventListener("DOMContentLoaded", loadProfile);
  