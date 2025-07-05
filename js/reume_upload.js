
    let selectedFile = null;

    document.getElementById("resumeFile").addEventListener("change", (event) => {
      const file = event.target.files[0];
      const errorMessage = document.getElementById("resumeFileError");
      const previewContainer = document.getElementById("resumePreview");

      errorMessage.style.display = "none";
      previewContainer.innerHTML = `<span class="preview-placeholder">No resume selected. Upload a PDF to preview.</span>`;

      if (file) {
        if (file.type !== "application/pdf") {
          errorMessage.textContent = "Please select a valid PDF file";
          errorMessage.style.display = "block";
          selectedFile = null;
          return;
        }
        selectedFile = file;
        const fileURL = URL.createObjectURL(file);
        previewContainer.innerHTML = `<iframe src="${fileURL}" title="Resume Preview"></iframe>`;
      }
    });

    function submitResume() {
      const errorMessage = document.getElementById("resumeFileError");
      errorMessage.style.display = "none";

      if (!selectedFile) {
        errorMessage.textContent = "Please select a PDF file to upload";
        errorMessage.style.display = "block";
        return;
      }

      // Simulate backend submission
      const formData = new FormData();
      formData.append("resume", selectedFile);

      // Log data for preview (replace with actual Fetch API call)
      console.log("Submitting resume:", {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type
      });

      // Simulate API call
      fetch('http://localhost:8000/resume', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        alert("Resume submitted successfully!");
        resetForm();
      })
      .catch(err => {
        console.error('Error submitting resume:', err);
        alert("Failed to submit resume. Please try again.");
      });
    }

    function resetForm() {
      selectedFile = null;
      document.getElementById("resumeFile").value = "";
      document.getElementById("resumePreview").innerHTML = `<span class="preview-placeholder">No resume selected. Upload a PDF to preview.</span>`;
      document.getElementById("resumeFileError").style.display = "none";
    }
  