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


const officeConfig = window.RUKN_CONFIG || {};
const form = document.querySelector("#contact-form");
const feedback = document.querySelector("#form-feedback");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const subject = String(data.get("subject") || "").trim();
  const email = String(officeConfig.contactEmail || "").trim();
  if (!email) {
    feedback.textContent = "راه تماس هنوز تنظیم نشده است؛ اطلاعات شما ارسال یا ذخیره نشد.";
    return;
  }
  const mailSubject = encodeURIComponent("درخواست مشاوره حقوقی از وب‌سایت رُکن");
  const mailBody = encodeURIComponent(`نام: ${name}\nشماره تماس: ${phone}\nموضوع کلی: ${subject}\n\nلطفاً زمان و شیوه گفت‌وگو را هماهنگ کنید.`);
  feedback.textContent = "پیش‌نویس ایمیل آماده می‌شود؛ ارسال نهایی با شماست.";
  window.location.href = `mailto:${encodeURIComponent(email)}?subject=${mailSubject}&body=${mailBody}`;
});

const profile = officeConfig.attorneyProfile || {};
const profileCard = document.querySelector("#attorney-profile");
if (profileCard && profile.name && profile.title && profile.licenseNumber) {
  profileCard.querySelectorAll("[data-attorney-field]").forEach((node) => {
    const value = profile[node.dataset.attorneyField];
    if (node.tagName === "IMG") {
      if (value) {
        node.src = value;
        node.alt = `تصویر ${profile.name}`;
        node.closest("[data-photo-wrap]")?.removeAttribute("hidden");
      }
    } else {
      node.textContent = value || "";
    }
  });
  const education = profileCard.querySelector("[data-education-row]");
  if (education && !profile.education) education.hidden = true;
  profileCard.hidden = false;
  document.querySelector("#profile-placeholder")?.setAttribute("hidden", "");
}

const search = document.querySelector("#guide-search");
const guideCardsList = [...document.querySelectorAll("[data-guide-card]")];
const filters = [...document.querySelectorAll("[data-filter]")];
const resultCount = document.querySelector("#guide-result");
const emptyState = document.querySelector("#guide-empty");
let activeGuideFilter = "all";
const updateGuides = () => {
  if (!guideCardsList.length) return;
  const query = (search?.value || "").trim().toLocaleLowerCase("fa");
  let visible = 0;
  for (const card of guideCardsList) {
    const matchesCategory = activeGuideFilter === "all" || card.dataset.category === activeGuideFilter;
    const matchesQuery = !query || card.textContent.toLocaleLowerCase("fa").includes(query);
    card.hidden = !(matchesCategory && matchesQuery);
    if (!card.hidden) visible++;
  }
  if (resultCount) resultCount.textContent = `${visible.toLocaleString("fa")} راهنما`;
  if (emptyState) emptyState.hidden = visible !== 0;
};
search?.addEventListener("input", updateGuides);
filters.forEach((button) => button.addEventListener("click", () => {
  activeGuideFilter = button.dataset.filter || "all";
  filters.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  updateGuides();
}));
updateGuides();

const mobileContactCta = document.querySelector(".mobile-contact-cta");
const contactSection = document.querySelector("#contact");
if (mobileContactCta && contactSection && "IntersectionObserver" in window) {
  const contactObserver = new IntersectionObserver(([entry]) => {
    mobileContactCta.classList.toggle("is-hidden", entry.isIntersecting);
  }, { threshold: 0.12 });
  contactObserver.observe(contactSection);
}


document.querySelectorAll("[data-contact-link]").forEach((link) => {
  const key = link.dataset.contactLink;
  const value = String(officeConfig[key] || "").trim();
  if (!value) return;
  if (key === "phone") link.href = `tel:${value.replace(/[^+\d]/g, "")}`;
  else if (key === "whatsapp") {
    const number = value.replace(/\D/g, "");
    if (!number) return;
    link.href = `https://wa.me/${number}`;
  } else {
    link.href = value;
  }
  link.removeAttribute("hidden");
});
