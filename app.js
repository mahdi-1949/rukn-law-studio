const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  mainNav.classList.toggle("is-open", !isOpen);
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    mainNav.classList.remove("is-open");
  });
});

document.querySelectorAll(".service-trigger, .faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    button.setAttribute("aria-expanded", String(!isExpanded));
    if (panel) panel.hidden = isExpanded;
  });
});

const form = document.querySelector("#contact-form");
const feedback = document.querySelector("#form-feedback");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  feedback.textContent = "این نسخه نمایشی است؛ درخواست شما ارسال نشد.";
});

const mobileContactCta = document.querySelector(".mobile-contact-cta");
const contactSection = document.querySelector("#contact");
if (mobileContactCta && contactSection && "IntersectionObserver" in window) {
  const contactObserver = new IntersectionObserver(([entry]) => {
    mobileContactCta.classList.toggle("is-hidden", entry.isIntersecting);
  }, { threshold: 0.12 });
  contactObserver.observe(contactSection);
}

