(() => {
  const config = window.GLRP_CONFIG || {};
  const setText = (selector, value) => {
    if (!value) return;
    document.querySelectorAll(selector).forEach((el) => { el.textContent = value; });
  };
  const setLink = (selector, value) => {
    document.querySelectorAll(selector).forEach((el) => {
      if (!value || value === "#") {
        el.href = "#";
        el.addEventListener("click", (event) => {
          event.preventDefault();
          alert("Add this link inside config.js before publishing the website.");
        });
      } else {
        el.href = value;
        el.target = "_blank";
        el.rel = "noopener noreferrer";
      }
    });
  };

  setText(".js-status", config.serverStatus);
  setText(".js-tagline", config.tagline);
  setText(".js-notice", config.launchNotice);
  setLink(".js-discord", config.discordUrl);
  setLink(".js-connect", config.connectUrl);
  setLink(".js-youtube", config.youtubeUrl);
  setLink(".js-tiktok", config.tiktokUrl);

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 16);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "✕" : "☰";
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    }));
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add("visible"));
  }
})();
