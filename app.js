const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const megaTrigger = document.querySelector(".mega-trigger");
const megaMenu = document.querySelector("#service-mega-menu");
const desktopNavigation = window.matchMedia("(min-width: 1081px)");

const setMegaMenuOpen = (isOpen) => {
  megaTrigger?.setAttribute("aria-expanded", String(isOpen));
  if (megaMenu) megaMenu.hidden = !isOpen;
};

const closeResponsiveNavigation = () => {
  menuToggle?.setAttribute("aria-expanded", "false");
  mainNav?.classList.remove("is-open");
  setMegaMenuOpen(false);
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  mainNav?.classList.toggle("is-open", !isOpen);
  if (isOpen) setMegaMenuOpen(false);
});

megaTrigger?.addEventListener("click", () => {
  const isOpen = megaTrigger.getAttribute("aria-expanded") === "true";
  setMegaMenuOpen(!isOpen);
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => closeResponsiveNavigation());
});

document.addEventListener("click", (event) => {
  if (siteHeader && !siteHeader.contains(event.target)) closeResponsiveNavigation();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (megaTrigger?.getAttribute("aria-expanded") === "true") {
    setMegaMenuOpen(false);
    megaTrigger.focus();
    return;
  }
  if (menuToggle?.getAttribute("aria-expanded") === "true") {
    closeResponsiveNavigation();
    menuToggle.focus();
  }
});

mainNav?.addEventListener("focusout", (event) => {
  if (event.relatedTarget instanceof Node && !mainNav.contains(event.relatedTarget)) {
    closeResponsiveNavigation();
  }
});

const resetNavigationAtBreakpoint = () => closeResponsiveNavigation();
if (typeof desktopNavigation.addEventListener === "function") {
  desktopNavigation.addEventListener("change", resetNavigationAtBreakpoint);
} else {
  desktopNavigation.addListener(resetNavigationAtBreakpoint);
}

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

