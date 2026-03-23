import { get } from '../utils/dom.js';

export function initSearch() {
  const searchTriggerBtn = get("searchTriggerBtn");
  const searchOverlay = get("searchOverlay");
  const header = get("header");
  const searchInput = get("searchInput");
  const searchClear = get("searchClear");
  const searchResults = get("searchResults");
  const searchLoader = get("searchLoader");
  const searchResultsContent = get("searchResultsContent");

  if (searchTriggerBtn) {
    searchTriggerBtn.addEventListener("click", () => {
      searchOverlay.classList.add("active");
      header.classList.add("search-active");
      setTimeout(() => {
        if (searchInput) searchInput.focus();
      }, 100);
    });
  }

  if (searchClear && searchInput) {
    searchClear.addEventListener("click", (e) => {
      e.preventDefault();
      if (searchInput.value.trim() !== "") {
        searchInput.value = "";
        searchResults.classList.remove("show");
        searchInput.focus();
      } else {
        searchOverlay.classList.remove("active");
        header.classList.remove("search-active");
        searchResults.classList.remove("show");
      }
    });
  }

  if (searchInput) {
    let timeout = null;
    let abortController = null;

    searchInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      if (abortController) abortController.abort();

      if (val.length > 0) {
        searchResults.classList.add("show");
        searchLoader.style.display = "block";
        searchResultsContent.style.opacity = "0.3";

        clearTimeout(timeout);
        timeout = setTimeout(() => {
          abortController = new AbortController();
          searchLoader.style.display = "none";
          searchResultsContent.style.opacity = "1";
        }, 800);
      } else {
        searchResults.classList.remove("show");
      }
    });
  }
}