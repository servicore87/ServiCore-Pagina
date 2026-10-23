// Tema día / noche (por defecto noche)
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

function setTheme(theme) {
  root.dataset.theme = theme;
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Cambiar a tema día" : "Cambiar a tema noche");
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {}
}

setTheme(root.dataset.theme === "light" ? "light" : "dark");
themeToggle.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

// Menú hamburguesa
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");
const navLinks = document.querySelectorAll(".nav__link");

function toggleMenu(forceClose = false) {
  const isOpen = forceClose ? false : !nav.classList.contains("open");
  nav.classList.toggle("open", isOpen);
  hamburger.classList.toggle("open", isOpen);
  hamburger.setAttribute("aria-expanded", isOpen);
  hamburger.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  document.body.classList.toggle("no-scroll", isOpen);
}

hamburger.addEventListener("click", () => toggleMenu());
navLinks.forEach((link) => link.addEventListener("click", () => toggleMenu(true)));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("open")) toggleMenu(true);
});

// Cerrar el menú si se agranda la ventana por encima de 768px
window.matchMedia("(min-width: 769px)").addEventListener("change", (e) => {
  if (e.matches) toggleMenu(true);
});

// Sombra del header al hacer scroll
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
});

// Link activo según la sección visible
const sections = document.querySelectorAll("main section[id]");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-50% 0px -50% 0px" }
);
sections.forEach((section) => sectionObserver.observe(section));

// Animación de aparición al hacer scroll
const revealItems = document.querySelectorAll(".service, .step, .testimonial, .why__content, .contact__info, .form");
revealItems.forEach((el) => el.classList.add("reveal"));
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealItems.forEach((el) => revealObserver.observe(el));

// Formulario de contacto: validación y envío al mail de la empresa vía FormSubmit
const FORM_ENDPOINT = "https://formsubmit.co/ajax/servicore87@gmail.com";
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let valid = true;

  form.querySelectorAll("[required]").forEach((field) => {
    const empty = !field.value.trim();
    field.classList.toggle("invalid", empty);
    if (empty) valid = false;
  });

  if (!valid) {
    status.textContent = "Por favor, completá todos los campos.";
    status.className = "form__status error";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";
  status.textContent = "";
  status.className = "form__status";

  try {
    const response = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    });
    const result = await response.json();
    if (!response.ok || result.success === "false" || result.success === false) {
      throw new Error(result.message || "Error al enviar");
    }

    status.textContent = "¡Gracias! Recibimos tu consulta y te contactamos a la brevedad.";
    status.className = "form__status success";
    form.reset();
  } catch (err) {
    status.textContent = "No pudimos enviar la consulta. Probá de nuevo o escribinos por WhatsApp.";
    status.className = "form__status error";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar consulta";
  }
});

// Año del footer
document.getElementById("year").textContent = new Date().getFullYear();
