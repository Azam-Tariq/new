// Recruiter Profile (Hardcoded Mode)
const API_URL = 'http://localhost:8000/api/v1/user/recruiter/{de95e6ac-60eb-4cd7-bfd0-b0650d2d7f82}'; // Not used
let recruiterData = {};
let isEditing = false;

// ✅ Hardcoded profile data
const hardcodedRecruiter = {
  photo: "https://i.ibb.co/mNSJ8yD/recruiter-profile.jpg", // ✅ Replace with your image if you want
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
        <div class="form-group">
          <label for="${id}">${label}${required ? ' <span style="color:#dc3545;">*</span>' : ''}</label>
          <input type="${type}" class="form-control" id="${id}" value="${value}" ${required ? 'required' : ''} />
          <div class="error-message" id="${id}Error">Please enter a valid ${label.toLowerCase()}</div>
        </div>
      `
      : `<p><label>${label}:</label> ${value || 'N/A'}</p>`;
  };

  document.getElementById("profileCard").innerHTML = `
    <div class="profile-card animate-fade-in animate-delay-2">
      <img src="${data.photo || 'C:\Users\Azam\Desktop\frontend\assets'}" alt="Profile Photo" class="profile-img" id="profileImage">
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
        ${formOrText("fullName", "Full Name", true)}
        ${formOrText("email", "Email", true, "email")}
        ${formOrText("phone", "Phone", false, "tel")}
        ${formOrText("jobTitle", "Job Title", true)}
        ${formOrText("companyName", "Company Name", true)}
        ${formOrText("industry", "Industry")}
        ${formOrText("companyWebsite", "Company Website", false, "url")}
        ${formOrText("companySize", "Company Size")}
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

// Enable edit mode
function enableEdit() {
  isEditing = true;
  renderProfile(recruiterData, true);
}

// Cancel edit
function cancelEdit() {
  isEditing = false;
  renderProfile(recruiterData);
}

// Save updated profile (in browser only)
async function saveProfile() {
  const fields = ["photo", "fullName", "email", "phone", "jobTitle", "companyName", "industry", "companyWebsite", "companySize"];
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

// Validate URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Load hardcoded profile
function loadProfile() {
  try {
    recruiterData = hardcodedRecruiter;
    renderProfile(recruiterData);
  } catch (err) {
    console.error('Error loading profile:', err);
    document.getElementById("profileCard").innerHTML = `
      <div class="col-12 text-center"><p style="color:#dc3545;">Error loading profile. Please try again later.</p></div>
    `;
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", loadProfile);
