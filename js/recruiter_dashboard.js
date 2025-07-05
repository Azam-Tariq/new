function logout() {
  alert("Logging out...");
}

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
}

function loadPage(page) {
  const frame = document.getElementById("contentFrame");
  const welcome = document.getElementById("welcomeBox");
  const loader = document.getElementById("loaderContainer");
  const notification = document.getElementById("notification");

  // Hide welcome and show loader
  welcome.style.display = "none";
  frame.style.display = "none";
  loader.style.display = "flex";

  // Simulate loading time
  setTimeout(() => {
    // Hide loader and show content
    loader.style.display = "none";
    frame.src = page;
    frame.style.display = "block";

    // Show success notification
    notification.classList.add("show");
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);

    // Auto-close sidebar on mobile
    if (window.innerWidth <= 768) {
      document.getElementById("sidebar").classList.remove("active");
    }
  }, 1500); // 1.5 second loading time
}