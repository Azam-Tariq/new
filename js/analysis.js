// Recruiter Profile (Hardcoded Mode)
let recruiterData = {};
let isEditing = false;

// ✅ Hardcoded profile data with a professional image
const hardcodedRecruiter = {
  photo: "https://randomuser.me/api/portraits/men/75.jpg", // Professional-looking man's photo
  fullName: "Azam Tariq",
  email: "azam.tariq@example.com",
  phone: "+92-300-1234567",
  jobTitle: "Senior Talent Acquisition Specialist",
  companyName: "Talent Lens Pvt Ltd",
  industry: "Human Resources",
  companyWebsite: "https://www.talentlens.pk",
  companySize: "51-200 employees"
};

// Render profile
function renderProfile(data, editable = false) {
  const formOrText = (id, label, required = false, type = "text") => {
    const value = data[id] || '';
    return editable
      ? `
        <div class="form-group mb-3">
          <label for="${id}">${label}${required ? ' <span style="color:#dc3545;">*</span>' : ''}</label>
          <input type="${type}" class="form-control" id="${id}" value="${value}" ${required ? 'required' : ''} />
          <div class="error-message text-danger small" id="${id}Error" style="display:none;">Please enter a valid ${label.toLowerCase()}</div>
        </div>
      `
      : `<p><strong>${label}:</strong> ${value || 'N/A'}</p>`;
  };

  document.getElementById("profileCard").innerHTML = `
    <div class="card p-4 shadow-sm animate-fade-in animate-delay-2">
      <div class="text-center mb-4">
        <img src="${data.photo || 'https://via.placeholder.com/150'}" alt="Profile Photo" class="rounded-circle" width="120" height="120" id="profileImage">
      </div>
      ${
        editable
          ? `
            <div class="form-group mb-3">
              <label for="photo">Profile Photo URL</label>
              <input type="url" class="form-control" id="photo" value="${data.photo || ''}" />
              <div class="error-message text-danger small" id="photoError" style="display:none;">Please enter a valid URL</div>
            </div>
          `
          : ''
      }
      <div class="profile-info">
        ${formOrText("fullName", "Full Name", true)}
        ${formOrText("email", "Email", true, "email")}
        ${formOrText("phone", "Phone", false, "tel")}
        ${formOrText("jobTitle", "Job Title", true)}
        ${formOrText("companyName", "Company Name", true)}
        ${formOrText("industry", "Industry")}
        ${formOrText("companyWebsite", "Company Website", false, "url")}
        ${formOrText("companySize", "Company Size")}
      </div>
      <div class="text-center mt-4">
        ${
          editable
            ? `
              <button class="btn btn-success me-2" onclick="saveProfile()"><i class="fas fa-save me-1"></i>Save</button>
              <button class="btn btn-secondary" onclick="cancelEdit()"><i class="fas fa-times me-1"></i>Cancel</button>
            `
            : `
              <button class="btn btn-primary" onclick="enableEdit()"><i class="fas fa-edit me-1"></i>Edit Profile</button>
            `
        }
      </div>
    </div>
  `;
}

// Enable edit mode
function enableEdit() {
  isEditing = true;
  renderProfile(recruiterData, true);
}

// Cancel edit mode
function cancelEdit() {
  isEditing = false;
  renderProfile(recruiterData);
}

// Save updated profile (in browser only)
function saveProfile() {
  const fields = ["photo", "fullName", "email", "phone", "jobTitle", "companyName", "industry", "companyWebsite", "companySize"];
  const updatedData = {};
  fields.forEach(field => {
    updatedData[field] = document.getElementById(field)?.value?.trim() || '';
  });

  let isValid = true;
  document.querySelectorAll('.error-message').forEach(msg => msg.style.display = 'none');

  if (!updatedData.fullName) {
    document.getElementById('fullNameError').style.display = 'block';
    isValid = false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(updatedData.email)) {
    document.getElementById('emailError').style.display = 'block';
    isValid = false;
  }
  if (!updatedData.jobTitle) {
    document.getElementById('jobTitleError').style.display = 'block';
    isValid = false;
  }
  if (!updatedData.companyName) {
    document.getElementById('companyNameError').style.display = 'block';
    isValid = false;
  }
  if (updatedData.photo && !isValidUrl(updatedData.photo)) {
    document.getElementById('photoError').style.display = 'block';
    isValid = false;
  }
  if (updatedData.companyWebsite && !isValidUrl(updatedData.companyWebsite)) {
    document.getElementById('companyWebsiteError').style.display = 'block';
    isValid = false;
  }

  if (isValid) {
    recruiterData = updatedData;
    isEditing = false;
    alert("Profile updated (demo mode)!");
    renderProfile(recruiterData);
  }
}

// URL validator
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Load profile from hardcoded data
function loadProfile() {
  recruiterData = hardcodedRecruiter;
  renderProfile(recruiterData);
}

// Load on page ready
document.addEventListener("DOMContentLoaded", loadProfile);
