import { get } from '../utils/dom.js';

export function initGlobalClickHandlers() {
  const searchOverlay = get("searchOverlay");
  const searchTriggerBtn = get("searchTriggerBtn");
  const header = get("header");
  const catalogBtn = get("catalogBtn");
  const megaMenu = get("megaMenu");
  const fabWidget = get("fabWidget");
  const fabBtn = get("fabBtn");
  const searchResults = get("searchResults");

  document.addEventListener("click", (e) => {
    if (searchOverlay && searchTriggerBtn && !searchOverlay.contains(e.target) && !searchTriggerBtn.contains(e.target)) {
      searchOverlay.classList.remove("active");
      if (header) header.classList.remove("search-active");
      if (searchResults) searchResults.classList.remove("show");
    }

    if (catalogBtn && megaMenu && !catalogBtn.contains(e.target) && !megaMenu.contains(e.target) && window.innerWidth > 1080) {
      catalogBtn.classList.remove("active");
      if (megaMenu) megaMenu.classList.remove("is-open");
    }

    if (fabWidget && fabBtn && !fabWidget.contains(e.target) && !fabBtn.contains(e.target)) {
      fabWidget.classList.remove("active");
    }

    document.querySelectorAll(".filter-dropdown").forEach((dropdown) => {
      if (!dropdown.contains(e.target) && dropdown.classList.contains("open")) {
        if (dropdown.dataset.filterType === "range") {
          const btn = dropdown.querySelector(".close-dropdown");
          if (btn) btn.click();
        } else {
          dropdown.classList.remove("open");
        }
      }
    });
  });
}