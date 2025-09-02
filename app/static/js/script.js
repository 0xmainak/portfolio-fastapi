// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const navLinks = document.getElementById("nav-links");

mobileMenuToggle.addEventListener("click", () => {
  mobileMenuToggle.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenuToggle.classList.remove("active");
    navLinks.classList.remove("active");
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target)) {
    mobileMenuToggle.classList.remove("active");
    navLinks.classList.remove("active");
  }
});

// Smooth scroll for navigation
document.querySelectorAll(".nav-links a").forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    document.getElementById(targetId).scrollIntoView({
      behavior: "smooth"
    });
  });
});


function updateClock() {
  const now = new Date();
  // Format time in your timezone (e.g., Asia/Kolkata)
  const timeString = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  document.getElementById("clock").textContent = timeString;
}


// Run immediately + repeat every second
updateClock();
setInterval(updateClock, 1000);

// GitHub Contributions Graph
async function fetchContributions() {
  try {
    const res = await fetch("/github/contributions");
    const data = await res.json();
    const container = document.getElementById("github-contributions");
    
    if (data.days && data.total_contributions) {
      // Create the contribution grid
      let gridHTML = `
        <div class="contributions-header">
          <h2>GitHub Contributions</h2>
          <p class="total-contributions">${data.total_contributions} contributions in the last year</p>
        </div>
        <div class="contributions-grid">
      `;
      
      // Create month labels
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let monthLabels = '<div class="month-labels">';
      for (let i = 0; i < 12; i++) {
        monthLabels += `<span>${months[i]}</span>`;
      }
      monthLabels += '</div>';
      
      gridHTML += monthLabels;
      
      // Create day grid
      gridHTML += '<div class="days-grid">';
      
      // Add day labels
      const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      gridHTML += '<div class="day-labels">';
      dayLabels.forEach((day, index) => {
        if (index % 2 === 1) { // Show only Mon, Wed, Fri
          gridHTML += `<span>${day}</span>`;
        } else {
          gridHTML += '<span></span>';
        }
      });
      gridHTML += '</div>';
      
      // Add contribution squares
      gridHTML += '<div class="contributions-squares">';
      data.days.forEach(day => {
        const level = getContributionLevel(day.count);
        gridHTML += `<div class="day-square level-${level}" title="${day.count} contributions on ${day.date}"></div>`;
      });
      gridHTML += '</div>';
      
      gridHTML += '</div>'; // close days-grid
      gridHTML += '</div>'; // close contributions-grid
      
      // Add legend
      gridHTML += `
        <div class="contrib-legend">
          <span>Less</span>
          <div class="legend-squares">
            <div class="legend-square level-0"></div>
            <div class="legend-square level-1"></div>
            <div class="legend-square level-2"></div>
            <div class="legend-square level-3"></div>
            <div class="legend-square level-4"></div>
          </div>
          <span>More</span>
        </div>
      `;
      
      container.innerHTML = gridHTML;
    } else {
      container.innerHTML = "<p>Unable to load contributions.</p>";
    }
  } catch (err) {
    document.getElementById("github-contributions").innerHTML = "<p>Error loading contributions.</p>";
  }
}

function getContributionLevel(count) {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

fetchContributions();





async function fetchSpotify() {
  try {
    const res = await fetch("/spotify/now-playing");
    const data = await res.json();

    const widget = document.getElementById("spotify-widget");

    if (data.is_playing) {
      widget.innerHTML = `
        <img src="${data.cover}" alt="Album cover" style="width:80px;height:80px;border-radius:8px;" />
        <div>
          <p><strong>${data.song}</strong></p>
          <p>${data.artist}</p>
          <a href="${data.url}" target="_blank">Open in Spotify</a>
        </div>
      `;
    } else {
      widget.innerHTML = "<p>Not playing anything right now 🎧</p>";
    }
  } catch (err) {
    console.error(err);
  }
}

// Run every 10s
fetchSpotify();
setInterval(fetchSpotify, 10000);
