// Amour 2 Poils — interactions front-end

document.addEventListener("DOMContentLoaded", () => {
  // Menu mobile
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
      toggle.classList.toggle("active");
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.classList.remove("active");
      });
    });
  }

  // Header : ombre au scroll
  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.style.boxShadow =
        window.scrollY > 10 ? "0 4px 20px rgba(61,58,52,0.08)" : "none";
    });
  }

  // Formulaire de contact : validation simple + message de confirmation
  const form = document.querySelector("#contact-form");
  const successMsg = document.querySelector("#form-success");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (successMsg) {
        successMsg.classList.add("show");
        successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
    });
  }

  // Footer : année automatique
  const yearEl = document.querySelector("#current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
