import { get } from '../utils/dom.js';

export function initNavigation() {
  const catalogBtn = get("catalogBtn");
  const megaMenu = get("megaMenu");
  const mobileMegaMenu = get("mobileMegaMenu");
  let menuHistory = ["mobile-panel-main"];

  const resetMobileMenu = () => {
    document.querySelectorAll(".mobile-menu__panel").forEach((p) => p.classList.remove("active", "past"));
    const mainPanel = get("mobile-panel-main");
    if (mainPanel) mainPanel.classList.add("active");
    menuHistory = ["mobile-panel-main"];
  };

  if (catalogBtn) {
    catalogBtn.addEventListener("click", () => {
      const isMobile = window.innerWidth <= 1080;
      catalogBtn.classList.toggle("active");

      if (isMobile) {
        if (catalogBtn.classList.contains("active")) {
          if (mobileMegaMenu) {
            mobileMegaMenu.style.visibility = "visible";
            mobileMegaMenu.style.opacity = "1";
          }
          document.body.style.overflow = "hidden";
        } else {
          if (mobileMegaMenu) {
            mobileMegaMenu.style.opacity = "0";
            setTimeout(() => {
              mobileMegaMenu.style.visibility = "hidden";
              resetMobileMenu();
            }, 300);
          }
          document.body.style.overflow = "";
        }
      } else {
        if (megaMenu) megaMenu.classList.toggle("is-open");
      }
    });
  }

  if (mobileMegaMenu) {
    mobileMegaMenu.addEventListener("click", (e) => {
      const trigger = e.target.closest(".menu-trigger");
      const backBtn = e.target.closest(".mobile-menu__back");

      if (trigger) {
        e.preventDefault();
        const targetId = trigger.dataset.target;
        if (!targetId) return;

        const currentPanel = get(menuHistory[menuHistory.length - 1]);
        const targetPanel = get(targetId);

        if (currentPanel && targetPanel) {
          currentPanel.classList.replace("active", "past") || currentPanel.classList.add("past");
          targetPanel.classList.add("active");
          targetPanel.classList.remove("past");
          menuHistory.push(targetId);
        }
      }

      if (backBtn) {
        e.preventDefault();
        if (menuHistory.length <= 1) return;

        const currentId = menuHistory.pop();
        const prevId = menuHistory[menuHistory.length - 1];
        const currentPanel = get(currentId);
        const prevPanel = get(prevId);

        if (currentPanel && prevPanel) {
          currentPanel.classList.remove("active");
          prevPanel.classList.replace("past", "active") || prevPanel.classList.add("active");
        }
      }
    });
  }

  const menuCategories = document.querySelectorAll(".menu-category");
  const tabContents = document.querySelectorAll(".tab-content");

  menuCategories.forEach((cat) => {
    cat.addEventListener("mouseenter", () => {
      menuCategories.forEach((c) => c.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));
      cat.classList.add("active");
      const targetContent = get(cat.dataset.tab + "-content");
      if (targetContent) targetContent.classList.add("active");
    });
  });

  document.querySelectorAll(".sub-cat-list").forEach((list) => {
    const items = Array.from(list.querySelectorAll("li"));
    if (items.length > 6) {
      const wrapper = document.createElement("div");
      wrapper.className = "expand-wrapper";
      items.slice(6).forEach((item) => wrapper.appendChild(item));
      list.appendChild(wrapper);

      const btn = document.createElement("button");
      btn.className = "show-more-btn";
      btn.type = "button";
      btn.innerHTML = 'Посмотреть все <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5"/></svg>';

      btn.addEventListener("click", () => {
        wrapper.classList.toggle("open");
        btn.classList.toggle("active");
        btn.childNodes[0].textContent = wrapper.classList.contains("open") ? "Свернуть " : "Посмотреть все ";
      });
      list.parentNode.appendChild(btn);
    }
  });
}