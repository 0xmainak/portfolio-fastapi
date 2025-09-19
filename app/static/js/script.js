const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const navLinks = document.getElementById("nav-links");

mobileMenuToggle.addEventListener("click", () => {
  mobileMenuToggle.classList.toggle("active");
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenuToggle.classList.remove("active");
    navLinks.classList.remove("active");
  });
});

document.addEventListener("click", (e) => {
  if (!mobileMenuToggle.contains(e.target) && !navLinks.contains(e.target)) {
    mobileMenuToggle.classList.remove("active");
    navLinks.classList.remove("active");
  }
});

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
  const timeString = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  document.getElementById("clock").textContent = timeString;
}


updateClock();
setInterval(updateClock, 1000);

async function fetchContributions() {
  try {
    const res = await fetch("/github/contributions");
    const data = await res.json();
    const container = document.getElementById("github-contributions");
    
    if (data.days && data.total_contributions) {
      let gridHTML = `
        <div class="contributions-header">
          <h2>GitHub Contributions</h2>
          <p class="total-contributions">${data.total_contributions} contributions in the last year</p>
        </div>
        <div class="contributions-grid">
      `;
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let monthLabels = '<div class="month-labels">';
      for (let i = 0; i < 12; i++) {
        monthLabels += `<span>${months[i]}</span>`;
      }
      monthLabels += '</div>';
      
      gridHTML += monthLabels;
      
      gridHTML += '<div class="days-grid">';
      
      const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      gridHTML += '<div class="day-labels">';
      dayLabels.forEach((day, index) => {
        if (index % 2 === 1) {
          gridHTML += `<span>${day}</span>`;
        } else {
          gridHTML += '<span></span>';
        }
      });
      gridHTML += '</div>';
      
      gridHTML += '<div class="contributions-squares">';
      data.days.forEach(day => {
        const level = getContributionLevel(day.count);
        gridHTML += `<div class="day-square level-${level}" title="${day.count} contributions on ${day.date}"></div>`;
      });
      gridHTML += '</div>';
      
      gridHTML += '</div>'; 
      gridHTML += '</div>';
      
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

fetchSpotify();
setInterval(fetchSpotify, 10000);
