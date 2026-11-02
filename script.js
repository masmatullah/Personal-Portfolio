const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const menuToggle = $("#menuToggle");
const nav = $("#nav");
menuToggle.addEventListener("click", () => {
  const opened = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(opened));
  menuToggle.textContent = opened ? "✕" : "☰";
});
$$(".nav-link").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.textContent = "☰";
}));

// Theme preference is saved in the visitor's browser.
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") document.body.classList.add("light");
$("#themeToggle").textContent = document.body.classList.contains("light") ? "☾" : "☼";
$("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  const theme = document.body.classList.contains("light") ? "light" : "dark";
  localStorage.setItem("portfolio-theme", theme);
  $("#themeToggle").textContent = theme === "light" ? "☾" : "☼";
});

// Typing headline.
const roles = ["Frontend Developer", "React Learner", "Web Creator"];
let roleIndex = 0, charIndex = 0, deleting = false;
function typeRole() {
  const current = roles[roleIndex];
  $("#typedText").textContent = current.substring(0, charIndex);
  if (!deleting && charIndex < current.length) charIndex++;
  else if (deleting && charIndex > 0) charIndex--;
  else if (!deleting) { deleting = true; setTimeout(typeRole, 1200); return; }
  else { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
  setTimeout(typeRole, deleting ? 55 : 95);
}
typeRole();

// Project category filters.
$$(".filter-btn").forEach(button => button.addEventListener("click", () => {
  $$(".filter-btn").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  const filter = button.dataset.filter;
  $$(".project-card").forEach(card => {
    card.hidden = filter !== "all" && card.dataset.category !== filter;
  });
}));

// Scroll progress, back-to-top and active navigation.
const backTop = $("#backTop");
window.addEventListener("scroll", () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  $("#progressBar").style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
  backTop.classList.toggle("show", window.scrollY > 450);
});
backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Reveal sections as they enter the viewport.
const revealTargets = $$(".section-heading, .about-intro, .facts-grid, .skill-card, .project-card, .timeline-item, .contact-panel");
revealTargets.forEach(element => element.classList.add("reveal"));
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(element => observer.observe(element));
} else {
  revealTargets.forEach(element => element.classList.add("visible"));
}

// Contact form: opens the visitor's email app; no backend/server is required.
$("#contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = $("#contactName").value.trim();
  const email = $("#contactEmail").value.trim();
  const message = $("#contactMessage").value.trim();
  if (!name || !email || !message) return;
  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
  window.location.href = `mailto:your.email@example.com?subject=${subject}&body=${body}`;
  $("#formNote").textContent = "Your email app should open with the message. Replace the demo email in script.js with your real email.";
});

$("#year").textContent = new Date().getFullYear();
