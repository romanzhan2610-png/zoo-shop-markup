document.addEventListener("DOMContentLoaded", () => {
  const get = (id) => document.getElementById(id);

  initNavigation();
  initSearch();
  initSliders();
  initFilters();
  initProductCards();
  initScrollableAreas();
  initFab();
  initGlobalClickHandlers();
  initContactsMap();
  initAuthModal();
  initCartLogic();
  initCheckout();
  initProductPageLogic();

  function initNavigation() {
    const catalogBtn = get("catalogBtn");
    const megaMenu = get("megaMenu");
    const mobileMegaMenu = get("mobileMegaMenu");
    let menuHistory = ["mobile-panel-main"];

    const resetMobileMenu = () => {
      document
        .querySelectorAll(".mobile-menu__panel")
        .forEach((p) => p.classList.remove("active", "past"));
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
            currentPanel.classList.replace("active", "past") ||
              currentPanel.classList.add("past");
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
            prevPanel.classList.replace("past", "active") ||
              prevPanel.classList.add("active");
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
        btn.innerHTML =
          'Посмотреть все <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5"/></svg>';

        btn.addEventListener("click", () => {
          wrapper.classList.toggle("open");
          btn.classList.toggle("active");
          btn.childNodes[0].textContent = wrapper.classList.contains("open")
            ? "Свернуть "
            : "Посмотреть все ";
        });
        list.parentNode.appendChild(btn);
      }
    });
  }

  function initSearch() {
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

  function initSliders() {
    const heroCat = get("heroCat");

    if (document.querySelector(".mySwiper")) {
      const catPoses = [
        "img/cat-pose-1.png",
        "img/cat-pose-2.png",
        "img/cat-pose-3.png",
        "img/cat-pose-4.png",
        "img/cat-pose-5.png",
      ];
      const stepPixels = 10;

      new Swiper(".mySwiper", {
        loop: true,
        speed: 800,
        pagination: { el: ".swiper-pagination", clickable: true },
        navigation: {
          nextEl: ".slider-nav-btn.next-slide",
          prevEl: ".slider-nav-btn.prev-slide",
        },
        autoplay: { delay: 6000, disableOnInteraction: false },
        effect: "fade",
        fadeEffect: { crossFade: true },
        on: {
          slideChange: function () {
            if (heroCat) {
              heroCat.src = catPoses[this.realIndex] || catPoses[0];
              heroCat.style.transform = `translateX(${this.realIndex * stepPixels}px)`;
            }
          },
        },
      });
    }

    document.querySelectorAll(".products-slider-wrapper").forEach((wrapper) => {
      const container = wrapper.querySelector(".products-swiper");
      if (container) {
        new Swiper(container, {
          slidesPerView: 1.2,
          spaceBetween: 16,
          navigation: {
            nextEl: wrapper.querySelector(".products-slider-next"),
            prevEl: wrapper.querySelector(".products-slider-prev"),
          },
          breakpoints: {
            576: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 24 },
            1080: { slidesPerView: 4, spaceBetween: 30 },
          },
        });
      }
    });

    const articlesSwiperContainer = document.querySelector(".articles-swiper");
    if (articlesSwiperContainer) {
      new Swiper(articlesSwiperContainer, {
        slidesPerView: 1.2,
        spaceBetween: 16,
        navigation: {
          nextEl: ".articles-slider-next",
          prevEl: ".articles-slider-prev",
        },
        breakpoints: {
          576: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 24 },
          1080: { slidesPerView: 3, spaceBetween: 30 },
        },
      });
    }
  }

  function initFilters() {
    const filterDropdowns = document.querySelectorAll(".filter-dropdown");
    if (!filterDropdowns.length) return;

    document.querySelectorAll(".filter-btn__text").forEach((span) => {
      span.dataset.originalText = span.textContent;
    });

    const formatWeight = (val) => {
      const num = parseFloat(val);
      return num < 1 ? Math.round(num * 1000) + " г" : num + " кг";
    };

    const updatePopoverPosition = (dropdown) => {
      if (window.innerWidth <= 1080) return;
      const trigger = dropdown.querySelector(".dropdown-trigger");
      const popover = dropdown.querySelector(".filter-popover");
      if (!trigger || !popover || !dropdown.classList.contains("open")) return;

      const rect = trigger.getBoundingClientRect();
      popover.style.top = `${rect.bottom + 12}px`;

      const popoverWidth = 320;
      popover.style.left =
        rect.left + popoverWidth > window.innerWidth
          ? `${window.innerWidth - popoverWidth - 20}px`
          : `${rect.left}px`;
    };

    filterDropdowns.forEach((dropdown) => {
      const trigger = dropdown.querySelector(".dropdown-trigger");
      const badge = dropdown.querySelector(".filter-btn__badge");
      const textSpan = trigger.querySelector(".filter-btn__text");
      const filterType = dropdown.dataset.filterType;
      const closeBtns = dropdown.querySelectorAll(".close-dropdown");
      const clearBtns = dropdown.querySelectorAll(".clear-filter");

      if (trigger) {
        trigger.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = dropdown.classList.contains("open");

          if (!isOpen) {
            filterDropdowns.forEach((d) => d.classList.remove("open"));
            dropdown.classList.add("open");
            updatePopoverPosition(dropdown);
          } else {
            dropdown.classList.remove("open");
            updateFilterState();
          }
        });
      }

      closeBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropdown.classList.remove("open");
          updateFilterState();
        });
      });

      const updateFilterState = () => {
        let count = 0;
        const originalLabel = textSpan.dataset.originalText;

        if (filterType === "checkbox") {
          count = dropdown.querySelectorAll(
            'input[type="checkbox"]:checked',
          ).length;
          if (badge) badge.textContent = count;
        } else if (filterType === "range") {
          const wrap = dropdown.querySelector(".range-slider-wrap");
          if (wrap) {
            const defaultMin = parseFloat(wrap.dataset.min);
            const defaultMax = parseFloat(wrap.dataset.max);
            const currentMin = parseFloat(
              dropdown.querySelector(".input-min").value,
            );
            const currentMax = parseFloat(
              dropdown.querySelector(".input-max").value,
            );

            if (currentMin > defaultMin || currentMax < defaultMax) {
              count = 1;
              if (originalLabel.toLowerCase().includes("цена")) {
                textSpan.textContent = `${currentMin} - ${currentMax} ₽`;
              } else if (originalLabel.toLowerCase().includes("вес")) {
                textSpan.textContent = `${formatWeight(currentMin)} - ${formatWeight(currentMax)}`;
              } else {
                textSpan.textContent = `${currentMin} - ${currentMax}`;
              }
            } else {
              textSpan.textContent = originalLabel;
            }
          }
        } else if (filterType === "sort") {
          const checkedRadio = dropdown.querySelector(
            'input[type="radio"]:checked',
          );
          if (checkedRadio) {
            textSpan.textContent =
              checkedRadio.nextElementSibling.nextElementSibling.textContent;
            dropdown.classList.add("has-selection");
            return;
          }
        }

        dropdown.classList.toggle("has-selection", count > 0);
        if (count === 0 && filterType === "range")
          textSpan.textContent = originalLabel;
      };

      dropdown
        .querySelectorAll('input[type="checkbox"], input[type="radio"]')
        .forEach((input) => {
          input.addEventListener("change", updateFilterState);
        });

      clearBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          if (filterType === "checkbox") {
            dropdown
              .querySelectorAll('input[type="checkbox"]')
              .forEach((i) => (i.checked = false));
          } else if (filterType === "range") {
            const wrap = dropdown.querySelector(".range-slider-wrap");
            dropdown.querySelector(".input-min").value = wrap.dataset.min;
            dropdown.querySelector(".range-thumb-min").value = wrap.dataset.min;
            dropdown.querySelector(".input-max").value = wrap.dataset.max;
            dropdown.querySelector(".range-thumb-max").value = wrap.dataset.max;
            dropdown
              .querySelector(".range-thumb-min")
              .dispatchEvent(new Event("input"));
          }
          updateFilterState();
          dropdown.classList.remove("open");
        });
      });

      if (filterType === "range") {
        const wrap = dropdown.querySelector(".range-slider-wrap");
        const thumbMin = dropdown.querySelector(".range-thumb-min");
        const thumbMax = dropdown.querySelector(".range-thumb-max");
        const inputMin = dropdown.querySelector(".input-min");
        const inputMax = dropdown.querySelector(".input-max");
        const rangeFill = dropdown.querySelector(".range-fill");
        const minVal = parseFloat(wrap.dataset.min);
        const maxVal = parseFloat(wrap.dataset.max);

        const updateSliderVisuals = () => {
          let valMin = parseFloat(thumbMin.value);
          let valMax = parseFloat(thumbMax.value);

          if (valMin >= valMax) {
            if (document.activeElement === thumbMin) {
              thumbMin.value = valMax;
              valMin = valMax;
            } else {
              thumbMax.value = valMin;
              valMax = valMin;
            }
          }

          inputMin.value = valMin;
          inputMax.value = valMax;

          const percentMin = ((valMin - minVal) / (maxVal - minVal)) * 100;
          const percentMax = ((valMax - minVal) / (maxVal - minVal)) * 100;

          rangeFill.style.left = percentMin + "%";
          rangeFill.style.right = 100 - percentMax + "%";
        };

        const handleInputChange = () => {
          let valMin = parseFloat(inputMin.value) || minVal;
          let valMax = parseFloat(inputMax.value) || maxVal;
          if (valMin < minVal) valMin = minVal;
          if (valMax > maxVal) valMax = maxVal;
          if (valMin > valMax) valMin = valMax;

          thumbMin.value = valMin;
          thumbMax.value = valMax;
          updateSliderVisuals();
        };

        thumbMin.addEventListener("input", updateSliderVisuals);
        thumbMax.addEventListener("input", updateSliderVisuals);
        inputMin.addEventListener("change", handleInputChange);
        inputMax.addEventListener("change", handleInputChange);

        updateSliderVisuals();
        updateFilterState();
      }
    });

    const handleScrollReposition = () => {
      filterDropdowns.forEach((dropdown) => {
        if (dropdown.classList.contains("open"))
          updatePopoverPosition(dropdown);
      });
    };

    window.addEventListener("scroll", handleScrollReposition, {
      passive: true,
    });
    const filtersList = get("filtersList");
    if (filtersList)
      filtersList.addEventListener("scroll", handleScrollReposition, {
        passive: true,
      });

    const resetAllBtn = get("resetAllFilters");
    if (resetAllBtn) {
      resetAllBtn.addEventListener("click", (e) => {
        e.preventDefault();
        filterDropdowns.forEach((dropdown) => {
          const clearBtn = dropdown.querySelector(".clear-filter");
          if (clearBtn) clearBtn.click();
        });
      });
    }
  }

  function initProductCards() {
    document.addEventListener("click", (e) => {
      const varBtn = e.target.closest(".product-var");
      if (varBtn) {
        e.preventDefault();
        e.stopPropagation();
        const parent = varBtn.closest(".product-card__vars");
        if (parent) {
          parent
            .querySelectorAll(".product-var")
            .forEach((btn) => btn.classList.remove("active"));
          varBtn.classList.add("active");
        }
      }

      const favBtn = e.target.closest(".product-card__fav");
      if (favBtn) {
        e.preventDefault();
        e.stopPropagation();
        favBtn.classList.toggle("active");
      }
    });
  }

  function initScrollableAreas() {
    const attachScrollArea = (areaId, prevId, nextId) => {
      const area = get(areaId);
      const prev = get(prevId);
      const next = get(nextId);
      if (!area || !prev || !next) return;

      const toggleArrows = () => {
        if (window.innerWidth <= 1080) return;
        const isScrollable = area.scrollWidth > area.clientWidth;
        if (!isScrollable) {
          prev.style.display = "none";
          next.style.display = "none";
          return;
        }
        prev.style.display = area.scrollLeft <= 0 ? "none" : "flex";
        next.style.display =
          area.scrollLeft + area.clientWidth >= area.scrollWidth - 1
            ? "none"
            : "flex";
      };

      area.addEventListener("scroll", toggleArrows);
      window.addEventListener("resize", toggleArrows);
      prev.addEventListener("click", () =>
        area.scrollBy({ left: -200, behavior: "smooth" }),
      );
      next.addEventListener("click", () =>
        area.scrollBy({ left: 200, behavior: "smooth" }),
      );
      setTimeout(toggleArrows, 100);
    };

    attachScrollArea("subcatList", "subcatPrev", "subcatNext");
    attachScrollArea("filtersList", "filtersPrev", "filtersNext");
  }

  function initFab() {
    const fabWidget = get("fabWidget");
    const fabBtn = get("fabBtn");

    if (fabBtn && fabWidget) {
      fabBtn.addEventListener("click", () =>
        fabWidget.classList.toggle("active"),
      );
    }
  }

  function initGlobalClickHandlers() {
    const searchOverlay = get("searchOverlay");
    const searchTriggerBtn = get("searchTriggerBtn");
    const header = get("header");
    const catalogBtn = get("catalogBtn");
    const megaMenu = get("megaMenu");
    const fabWidget = get("fabWidget");
    const fabBtn = get("fabBtn");
    const searchResults = get("searchResults");

    document.addEventListener("click", (e) => {
      if (
        searchOverlay &&
        searchTriggerBtn &&
        !searchOverlay.contains(e.target) &&
        !searchTriggerBtn.contains(e.target)
      ) {
        searchOverlay.classList.remove("active");
        if (header) header.classList.remove("search-active");
        if (searchResults) searchResults.classList.remove("show");
      }

      if (
        catalogBtn &&
        megaMenu &&
        !catalogBtn.contains(e.target) &&
        !megaMenu.contains(e.target) &&
        window.innerWidth > 1080
      ) {
        catalogBtn.classList.remove("active");
        megaMenu.classList.remove("is-open");
      }

      if (
        fabWidget &&
        fabBtn &&
        !fabWidget.contains(e.target) &&
        !fabBtn.contains(e.target)
      ) {
        fabWidget.classList.remove("active");
      }

      document.querySelectorAll(".filter-dropdown").forEach((dropdown) => {
        if (
          !dropdown.contains(e.target) &&
          dropdown.classList.contains("open")
        ) {
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

  function initContactsMap() {
    const mapContainer = get("map");
    if (!mapContainer || typeof ymaps === "undefined") return;

    ymaps.ready(() => {
      const initialCenter = [56.015283, 92.893247];

      const map = new ymaps.Map("map", {
        center: initialCenter,
        zoom: 12,
        controls: ["zoomControl"],
      });

      const customMarkerIcon = {
        iconLayout: "default#image",
        iconImageHref: "img/map-pin.svg",
        iconImageSize: [32, 40],
        iconImageOffset: [-16, -40],
      };

      const branches = document.querySelectorAll(".branch-item");
      const placemarks = [];

      branches.forEach((branch) => {
        const coordsRaw = branch.getAttribute("data-coords");
        if (!coordsRaw) return;

        const coords = coordsRaw
          .split(",")
          .map((coord) => parseFloat(coord.trim()));
        const title = branch.querySelector("h3").textContent;
        const address = branch.querySelector("p").textContent;

        const placemark = new ymaps.Placemark(
          coords,
          {
            balloonContentHeader: title,
            balloonContentBody: address,
          },
          customMarkerIcon,
        );

        map.geoObjects.add(placemark);
        placemarks.push(placemark);

        branch.addEventListener("click", () => {
          branches.forEach((b) => b.classList.remove("active"));
          branch.classList.add("active");

          map.panTo(coords, {
            flying: true,
            duration: 500,
          });
        });
      });

      map.behaviors.disable("scrollZoom");
    });
  }

  function initAuthModal() {
    const authOverlay = get("authModalOverlay");
    const authModal = get("authModal");
    const closeBtn = get("authModalClose");
    const openBtns = document.querySelectorAll('[aria-label="Личный кабинет"]');

    if (!authOverlay) return;

    const getScrollbarWidth = () => {
      return window.innerWidth - document.documentElement.clientWidth;
    };

    const openModal = (e) => {
      e?.preventDefault();
      const scrollbarWidth = getScrollbarWidth();
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      const fab = document.getElementById("fabWidget");
      if (fab) fab.style.paddingRight = `${scrollbarWidth}px`;

      authOverlay.classList.add("active");
      switchView("login");
      document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
      authOverlay.classList.remove("active");

      setTimeout(() => {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        const fab = document.getElementById("fabWidget");
        if (fab) fab.style.paddingRight = "";

        authOverlay.querySelectorAll("form").forEach((f) => {
          f.reset();
          f.querySelectorAll(".is-invalid").forEach((el) =>
            el.classList.remove("is-invalid"),
          );
        });
        authOverlay
          .querySelectorAll(".form-global-error")
          .forEach((el) => el.classList.remove("active"));
      }, 300);
    };

    openBtns.forEach((btn) => btn.addEventListener("click", openModal));
    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    const successCloseBtn = get("btnSuccessClose");
    if (successCloseBtn) successCloseBtn.addEventListener("click", closeModal);

    authOverlay.addEventListener("mousedown", (e) => {
      if (e.target === authOverlay) closeModal();
    });

    const switchView = (viewName) => {
      authOverlay
        .querySelectorAll(".auth-view")
        .forEach((v) => v.classList.remove("active"));
      authOverlay
        .querySelectorAll(".form-global-error")
        .forEach((el) => el.classList.remove("active"));
      const target = authOverlay.querySelector(`[data-view="${viewName}"]`);
      if (target) target.classList.add("active");
    };

    authOverlay.addEventListener("click", (e) => {
      const switchBtn = e.target.closest("[data-switch-view]");
      if (switchBtn) {
        e.preventDefault();
        switchView(switchBtn.dataset.switchView);
      }
    });

    authOverlay.addEventListener("click", (e) => {
      const toggleBtn = e.target.closest(".btn-toggle-password");
      if (toggleBtn) {
        const input = toggleBtn.previousElementSibling;
        if (input && input.type === "password") {
          input.type = "text";
          toggleBtn.style.color = "var(--primary)";
        } else if (input) {
          input.type = "password";
          toggleBtn.style.color = "";
        }
      }
    });

    authOverlay.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => {
        input.classList.remove("is-invalid");
      });
    });

    const setError = (input, msgText) => {
      input.classList.add("is-invalid");
      const msg = input.parentElement.querySelector(".form-error-msg");
      if (msg && msgText) msg.textContent = msgText;
    };

    const setGlobalError = (id, msg) => {
      const el = get(id);
      if (el) {
        el.textContent = msg;
        el.classList.add("active");
      }
    };

    const simulateBackend = (callback) => {
      authModal.classList.add("is-loading");
      setTimeout(() => {
        authModal.classList.remove("is-loading");
        callback();
      }, 1000);
    };

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePhone = (phone) => {
      const digits = phone.replace(/\D/g, "");
      return digits.length >= 10;
    };

    const validateLoginStr = (str) => {
      return validateEmail(str) || validatePhone(str);
    };

    const formLogin = get("formLogin");
    if (formLogin) {
      formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        const login = formLogin.login;
        const pass = formLogin.password;
        let isValid = true;

        if (!login.value.trim() || !validateLoginStr(login.value.trim())) {
          setError(login, "Введите корректный email или телефон");
          isValid = false;
        }
        if (!pass.value.trim()) {
          setError(pass, "Введите пароль");
          isValid = false;
        }

        if (isValid) {
          simulateBackend(() => {
            if (
              login.value.trim() === "test@mail.ru" &&
              pass.value === "123456"
            ) {
              closeModal();
            } else {
              setGlobalError("loginGlobalError", "Неверный логин или пароль");
            }
          });
        }
      });
    }

    const formRegister = get("formRegister");
    if (formRegister) {
      formRegister.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = formRegister.name;
        const phone = formRegister.phone;
        const pass1 = formRegister.new_password;
        const pass2 = formRegister.new_password_confirm;
        const policy = formRegister.policy;
        let isValid = true;

        if (!name.value.trim()) {
          setError(name, "Укажите имя");
          isValid = false;
        }
        if (!validatePhone(phone.value)) {
          setError(phone, "Введите корректный номер");
          isValid = false;
        }
        if (pass1.value.length < 6) {
          setError(pass1, "Минимум 6 символов");
          isValid = false;
        }
        if (pass1.value !== pass2.value) {
          setError(pass2, "Пароли не совпадают");
          isValid = false;
        }
        if (!policy.checked) {
          setGlobalError(
            "registerGlobalError",
            "Необходимо согласие с политикой",
          );
          isValid = false;
        }

        if (isValid) {
          simulateBackend(() => {
            get("codeTargetInfo").textContent = phone.value;
            switchView("code");
          });
        }
      });
    }

    const formRecovery = get("formRecovery");
    if (formRecovery) {
      formRecovery.addEventListener("submit", (e) => {
        e.preventDefault();
        const contact = formRecovery.contact;

        if (validateEmail(contact.value.trim())) {
          simulateBackend(() => {
            get("codeTargetInfo").textContent = contact.value;
            switchView("code");
          });
        } else {
          setError(contact, "Укажите корректный email");
        }
      });
    }

    const codeInputs = document.querySelectorAll(".code-input");
    codeInputs.forEach((input, index) => {
      input.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "");
        if (this.value.length === 1 && index < codeInputs.length - 1) {
          codeInputs[index + 1].focus();
        }
      });

      input.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && this.value === "" && index > 0) {
          codeInputs[index - 1].focus();
        }
      });

      input.addEventListener("paste", function (e) {
        e.preventDefault();
        const pasteData = e.clipboardData
          .getData("text")
          .replace(/[^0-9]/g, "")
          .slice(0, 4);
        pasteData.split("").forEach((char, i) => {
          if (codeInputs[i]) {
            codeInputs[i].value = char;
            if (i < 3) codeInputs[i + 1].focus();
          }
        });
      });
    });

    const formCode = get("formCode");
    if (formCode) {
      formCode.addEventListener("submit", (e) => {
        e.preventDefault();
        const code = Array.from(codeInputs)
          .map((i) => i.value)
          .join("");

        if (code.length === 4) {
          simulateBackend(() => {
            if (code === "1111") {
              switchView("new-password");
            } else {
              setGlobalError("codeGlobalError", "Введен неверный код");
              codeInputs.forEach((i) => i.classList.add("is-invalid"));
            }
          });
        } else {
          setGlobalError("codeGlobalError", "Введите 4 цифры");
        }
      });
    }

    const formNewPassword = get("formNewPassword");
    if (formNewPassword) {
      formNewPassword.addEventListener("submit", (e) => {
        e.preventDefault();
        const p1 = formNewPassword.pass1;
        const p2 = formNewPassword.pass2;
        let isValid = true;

        if (p1.value.length < 6) {
          setError(p1, "Минимум 6 символов");
          isValid = false;
        }
        if (p1.value !== p2.value) {
          setError(p2, "Пароли не совпадают");
          isValid = false;
        }

        if (isValid) {
          simulateBackend(() => {
            get("successMessage").textContent = "Ваш пароль успешно изменен!";
            switchView("success");
          });
        }
      });
    }
  }

  function initCartLogic() {
    const cartOverlay = get("cartOverlay");
    const cartClose = get("cartClose");
    const btnPromptLogin = get("btnPromptLogin");
    const authOverlay = get("authModalOverlay");
    const headerCartBtn = get("headerCartBtn");

    const getScrollbarWidth = () =>
      window.innerWidth - document.documentElement.clientWidth;

    const openCart = (e) => {
      e?.preventDefault();
      if (!cartOverlay) return;

      const scrollWidth = getScrollbarWidth();
      document.body.style.paddingRight = `${scrollWidth}px`;
      const fab = document.getElementById("fabWidget");
      if (fab) fab.style.paddingRight = `${scrollWidth}px`;

      document.body.style.overflow = "hidden";
      cartOverlay.classList.add("active");

      const cartDrawer = get("cartDrawer");
      if (cartDrawer) {
        cartDrawer
          .querySelectorAll(".cart-view")
          .forEach((v) => v.classList.remove("active"));
        const target = cartDrawer.querySelector('[data-cart-view="list"]');
        if (target) target.classList.add("active");
      }
    };

    if (headerCartBtn) {
      headerCartBtn.addEventListener("click", openCart);
    }

    const certForm = document.querySelector(".certificate-form-card");
    if (certForm) {
      certForm.addEventListener("submit", (e) => {
        e.preventDefault();
        openCart();
      });
    }

    document.addEventListener("click", (e) => {
      const addToCartBtn =
        e.target.closest(".btn-add-cart-desktop") ||
        e.target.closest(".btn-add-cart-mobile");
      if (addToCartBtn) {
        e.preventDefault();
        openCart();
      }

      const removeBtn = e.target.closest(".cart-remove-btn");
      if (removeBtn) {
        const item = removeBtn.closest(".cart-item");
        if (item) item.remove();
      }

      const minusBtn = e.target.closest(".qty-minus");
      const plusBtn = e.target.closest(".qty-plus");
      if (minusBtn || plusBtn) {
        const input = (minusBtn || plusBtn).parentElement.querySelector(
          ".qty-input",
        );
        let val = parseInt(input.value);
        if (minusBtn && val > 1) input.value = val - 1;
        if (plusBtn && val < 99) input.value = val + 1;
      }

      const switchBtn = e.target.closest("[data-switch-cart]");
      if (switchBtn) {
        e.preventDefault();
        const drawer = switchBtn.closest(".cart-drawer");
        if (drawer) {
          drawer
            .querySelectorAll(".cart-view")
            .forEach((v) => v.classList.remove("active"));
          const target = drawer.querySelector(
            `[data-cart-view="${switchBtn.dataset.switchCart}"]`,
          );
          if (target) target.classList.add("active");
        }
      }
    });

    const closeCart = () => {
      if (!cartOverlay) return;
      cartOverlay.classList.remove("active");
      setTimeout(() => {
        if (!authOverlay?.classList.contains("active")) {
          document.body.style.overflow = "";
          document.body.style.paddingRight = "";
          const fab = document.getElementById("fabWidget");
          if (fab) fab.style.paddingRight = "";
        }
      }, 400);
    };

    if (cartClose) cartClose.addEventListener("click", closeCart);

    if (cartOverlay) {
      cartOverlay.addEventListener("mousedown", (e) => {
        if (e.target === cartOverlay) closeCart();
      });
    }

    if (btnPromptLogin && authOverlay) {
      btnPromptLogin.addEventListener("click", () => {
        closeCart();
        authOverlay.classList.add("active");

        authOverlay
          .querySelectorAll(".auth-view")
          .forEach((v) => v.classList.remove("active"));
        const loginView = authOverlay.querySelector('[data-view="login"]');
        if (loginView) loginView.classList.add("active");
      });
    }

    const promoForm = get("promoForm");
    const promoInput = get("promoInput");
    const promoBtn = get("promoBtn");
    const promoMessage = get("promoMessage");
    const cartDiscountRow = get("cartDiscountRow");
    const cartDiscount = get("cartDiscount");
    const cartTotal = get("cartTotal");

    let isPromoApplied = false;

    if (promoForm && promoBtn) {
      promoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const iconApply = promoBtn.querySelector(".icon-apply");
        const iconCancel = promoBtn.querySelector(".icon-cancel");

        if (isPromoApplied) {
          isPromoApplied = false;
          promoInput.value = "";
          promoInput.disabled = false;
          if (iconApply) iconApply.style.display = "block";
          if (iconCancel) iconCancel.style.display = "none";
          promoMessage.className = "promo-message";
          promoMessage.textContent = "";
          cartDiscountRow.style.display = "none";
          cartTotal.textContent = "3 600 ₽";
          return;
        }

        const val = promoInput.value.trim().toUpperCase();
        if (!val) return;

        promoBtn.style.opacity = "0.5";
        promoBtn.disabled = true;

        setTimeout(() => {
          promoBtn.style.opacity = "1";
          promoBtn.disabled = false;

          if (val === "TEST" || val === "SALE") {
            isPromoApplied = true;
            promoMessage.textContent = "Промокод успешно применен!";
            promoMessage.className = "promo-message success";
            if (iconApply) iconApply.style.display = "none";
            if (iconCancel) iconCancel.style.display = "block";
            promoInput.disabled = true;

            cartDiscountRow.style.display = "flex";
            cartDiscount.textContent = "- 360 ₽";
            cartTotal.textContent = "3 240 ₽";
          } else {
            promoMessage.textContent = "Промокод не найден или устарел";
            promoMessage.className = "promo-message error";
          }
        }, 600);
      });

      promoInput.addEventListener("input", () => {
        promoMessage.className = "promo-message";
        promoMessage.textContent = "";
      });
    }
  }

  function initCheckout() {
    const checkoutForm = get("checkoutForm");
    if (!checkoutForm) return;

    const cards = {
      pickup: {
        el: get("cardPickup"),
        body: get("bodyPickup"),
        actions: get("actionsPickup"),
        savedData: get("savedDataPickup"),
        desc: get("descPickup"),
      },
      delivery: {
        el: get("cardDelivery"),
        body: get("bodyDelivery"),
        actions: get("actionsDelivery"),
        savedData: get("savedDataDelivery"),
        desc: get("descDelivery"),
        price: get("priceDelivery"),
      },
    };

    const typeRadios = document.querySelectorAll('input[name="delivery_type"]');
    const dateTimeBlock = get("dateTimeBlock");
    const checkoutDeliveryCost = get("checkoutDeliveryCost");

    const resetCards = () => {
      Object.values(cards).forEach((card) => {
        if (!card.el) return;
        card.el.classList.remove("active", "saved");
        card.body.classList.add("hidden");
        card.actions.classList.add("hidden");
        card.savedData.classList.add("hidden");
        card.desc.style.display = "block";
      });
      if (dateTimeBlock) dateTimeBlock.classList.add("hidden");
      if (checkoutDeliveryCost) checkoutDeliveryCost.style.display = "none";
    };

    typeRadios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        resetCards();
        const type = e.target.value;
        if (cards[type].el) {
          cards[type].el.classList.add("active");
          cards[type].body.classList.remove("hidden");
        }
      });
    });

    const btnSavePickup = get("btnSavePickup");
    const btnChangePickup = get("btnChangePickup");
    const btnClosePickup = get("btnClosePickup");

    if (btnSavePickup) {
      btnSavePickup.addEventListener("click", () => {
        const selectedBranch = document.querySelector(
          'input[name="branch"]:checked',
        );
        if (selectedBranch) {
          get("savedTitlePickup").textContent = selectedBranch.value;
          get("savedAddressPickup").textContent =
            selectedBranch.dataset.address;

          cards.pickup.body.classList.add("hidden");
          cards.pickup.desc.style.display = "none";
          cards.pickup.el.classList.replace("active", "saved");
          cards.pickup.savedData.classList.remove("hidden");
          cards.pickup.actions.classList.remove("hidden");
        }
      });
    }

    if (btnChangePickup) {
      btnChangePickup.addEventListener("click", () => {
        cards.pickup.el.classList.replace("saved", "active");
        cards.pickup.body.classList.remove("hidden");
        cards.pickup.savedData.classList.add("hidden");
        cards.pickup.actions.classList.add("hidden");
        cards.pickup.desc.style.display = "block";
      });
    }

    if (btnClosePickup) {
      btnClosePickup.addEventListener("click", () => {
        cards.pickup.el.classList.remove("active");
        cards.pickup.body.classList.add("hidden");
        const pRadio = document.querySelector('input[value="pickup"]');
        if (pRadio) pRadio.checked = false;
      });
    }

    const cityDropdownWrap = get("cityDropdownWrap");
    const cityInput = get("cityInput");
    const cityList = get("cityList");
    const streetInput = get("streetInput");
    const flatInput = get("flatInput");

    if (cityInput && cityList && cityDropdownWrap) {
      cityInput.addEventListener("focus", () =>
        cityDropdownWrap.classList.add("open"),
      );
      cityInput.addEventListener("click", () =>
        cityDropdownWrap.classList.add("open"),
      );

      cityInput.addEventListener("input", (e) => {
        const val = e.target.value.toLowerCase();
        const items = cityList.querySelectorAll("li");
        items.forEach((item) => {
          if (item.textContent.toLowerCase().includes(val)) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });

      cityList.addEventListener("click", (e) => {
        if (e.target.tagName === "LI") {
          cityInput.value = e.target.textContent;
          cityDropdownWrap.classList.remove("open");
          checkDeliveryForm();
        }
      });

      document.addEventListener("click", (e) => {
        if (!e.target.closest("#cityDropdownWrap")) {
          cityDropdownWrap.classList.remove("open");
        }
      });
    }

    const btnSaveDelivery = get("btnSaveDelivery");
    const btnChangeDelivery = get("btnChangeDelivery");

    const checkDeliveryForm = () => {
      if (!btnSaveDelivery || !cityInput || !streetInput) return;
      if (
        cityInput.value.trim().length > 2 &&
        streetInput.value.trim().length > 2
      ) {
        btnSaveDelivery.disabled = false;
      } else {
        btnSaveDelivery.disabled = true;
      }
    };

    if (cityInput) cityInput.addEventListener("input", checkDeliveryForm);
    if (streetInput) streetInput.addEventListener("input", checkDeliveryForm);

    if (btnSaveDelivery) {
      btnSaveDelivery.addEventListener("click", () => {
        let fullAddress = `${cityInput.value}, ${streetInput.value}`;
        if (flatInput && flatInput.value.trim() !== "") {
          fullAddress += `, кв. ${flatInput.value}`;
        }

        const savedAddrElem = get("savedAddressDelivery");
        if (savedAddrElem) savedAddrElem.textContent = fullAddress;
        if (cards.delivery.price) cards.delivery.price.textContent = "200 ₽";

        cards.delivery.body.classList.add("hidden");
        cards.delivery.desc.style.display = "none";
        cards.delivery.el.classList.replace("active", "saved");
        cards.delivery.savedData.classList.remove("hidden");
        cards.delivery.actions.classList.remove("hidden");

        if (dateTimeBlock) dateTimeBlock.classList.remove("hidden");
        if (checkoutDeliveryCost) checkoutDeliveryCost.style.display = "flex";
      });
    }

    if (btnChangeDelivery) {
      btnChangeDelivery.addEventListener("click", () => {
        cards.delivery.el.classList.replace("saved", "active");
        cards.delivery.body.classList.remove("hidden");
        cards.delivery.savedData.classList.add("hidden");
        cards.delivery.actions.classList.add("hidden");
        cards.delivery.desc.style.display = "block";
        if (cards.delivery.price)
          cards.delivery.price.textContent = "Узнать стоимость";

        if (dateTimeBlock) dateTimeBlock.classList.add("hidden");
        if (checkoutDeliveryCost) checkoutDeliveryCost.style.display = "none";
      });
    }

    const payRadios = document.querySelectorAll('input[name="payment_type"]');
    const changeInputWrap = get("changeInputWrap");

    if (changeInputWrap) {
      payRadios.forEach((radio) => {
        radio.addEventListener("change", (e) => {
          if (e.target.value === "cash") {
            changeInputWrap.classList.remove("hidden");
          } else {
            changeInputWrap.classList.add("hidden");
          }
        });
      });
    }

    const changeAmountInput = get("changeAmountInput");
    if (changeAmountInput) {
      changeAmountInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "");
      });
    }

    const promoBtn = get("checkoutPromoBtn");
    const promoInput = get("checkoutPromoInput");
    const promoMessage = get("checkoutPromoMessage");
    const discountRow = get("checkoutDiscountRow");
    let isPromoApplied = false;

    if (promoBtn && promoInput && promoMessage) {
      promoBtn.addEventListener("click", () => {
        const iconApply = promoBtn.querySelector(".icon-apply");
        const iconCancel = promoBtn.querySelector(".icon-cancel");

        if (isPromoApplied) {
          isPromoApplied = false;
          promoInput.value = "";
          promoInput.disabled = false;
          if (iconApply) iconApply.style.display = "block";
          if (iconCancel) iconCancel.style.display = "none";
          promoMessage.className = "promo-message";
          promoMessage.textContent = "";
          if (discountRow) discountRow.style.display = "none";
          return;
        }

        const val = promoInput.value.trim().toUpperCase();
        if (!val) return;

        promoBtn.style.opacity = "0.5";
        promoBtn.disabled = true;

        setTimeout(() => {
          promoBtn.style.opacity = "1";
          promoBtn.disabled = false;

          if (val === "TEST" || val === "SALE") {
            isPromoApplied = true;
            promoMessage.textContent = "Промокод успешно применен!";
            promoMessage.className = "promo-message success";
            if (iconApply) iconApply.style.display = "none";
            if (iconCancel) iconCancel.style.display = "block";
            promoInput.disabled = true;
            if (discountRow) {
              discountRow.style.display = "flex";
              const spanVal = discountRow.querySelector("span:last-child");
              if (spanVal) spanVal.textContent = "- 240 ₽";
            }
          } else {
            promoMessage.textContent = "Промокод не найден";
            promoMessage.className = "promo-message error";
          }
        }, 500);
      });

      promoInput.addEventListener("input", () => {
        promoMessage.className = "promo-message";
        promoMessage.textContent = "";
      });
    }

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const userName = get("userName");
    const userPhone = get("userPhone");
    const userEmail = get("userEmail");
    const userPolicy = get("userPolicy");

    checkoutForm.addEventListener("submit", (e) => {
      let isValid = true;

      checkoutForm
        .querySelectorAll(".is-invalid")
        .forEach((el) => el.classList.remove("is-invalid"));

      if (userName && !userName.value.trim()) {
        userName.classList.add("is-invalid");
        isValid = false;
      }

      if (userPhone) {
        const digits = userPhone.value.replace(/\D/g, "");
        if (digits.length < 10) {
          userPhone.classList.add("is-invalid");
          isValid = false;
        }
      }

      if (
        userEmail &&
        userEmail.value.trim() &&
        !validateEmail(userEmail.value.trim())
      ) {
        userEmail.classList.add("is-invalid");
        isValid = false;
      }

      if (userPolicy && !userPolicy.checked) {
        userPolicy.classList.add("is-invalid");
        isValid = false;
      }

      if (!isValid) {
        e.preventDefault();
        const firstError = checkoutForm.querySelector(".is-invalid");
        if (firstError) {
          firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    });

    checkoutForm.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () =>
        input.classList.remove("is-invalid"),
      );
      input.addEventListener("change", () =>
        input.classList.remove("is-invalid"),
      );
    });
  }

  function initProductPageLogic() {
    const productInfoVars = document.querySelector(
      ".product-weight-block .product-card__vars",
    );
    if (productInfoVars) {
      productInfoVars.addEventListener("click", (e) => {
        const btn = e.target.closest(".product-var");
        if (btn) {
          productInfoVars
            .querySelectorAll(".product-var")
            .forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
        }
      });
    }

    const btnAddToCartState = document.getElementById("btnAddToCartState");
    const actionState1 = document.getElementById("actionState1");
    const actionState2 = document.getElementById("actionState2");

    if (btnAddToCartState && actionState1 && actionState2) {
      btnAddToCartState.addEventListener("click", (e) => {
        e.preventDefault();
        actionState1.classList.add("hidden");
        actionState2.classList.remove("hidden");
      });
    }

    const branchesOverlay = document.getElementById("branchesModalOverlay");
    const branchesClose = document.getElementById("branchesModalClose");
    const availabilityLinks = document.querySelectorAll(
      ".product-status-block .availability-link",
    );

    let branchesMapInstance = null;

    const openBranchesModal = (e) => {
      e.preventDefault();
      if (!branchesOverlay) return;

      branchesOverlay.classList.add("active");
      document.body.style.overflow = "hidden";

      if (typeof ymaps !== "undefined") {
        ymaps.ready(() => {
          if (!branchesMapInstance && document.getElementById("branchesMap")) {
            branchesMapInstance = new ymaps.Map("branchesMap", {
              center: [56.008984, 92.76673],
              zoom: 12,
              controls: ["zoomControl"],
            });

            const customMarkerIcon = {
              iconLayout: "default#image",
              iconImageHref: "img/map-pin.svg",
              iconImageSize: [32, 40],
              iconImageOffset: [-16, -40],
            };

            const branchItems = document.querySelectorAll(".branch-modal-item");

            branchItems.forEach((item) => {
              const coordsRaw = item.getAttribute("data-coords");
              if (!coordsRaw) return;

              const coords = coordsRaw
                .split(",")
                .map((c) => parseFloat(c.trim()));
              const title = item.querySelector(
                ".branch-modal__name",
              ).textContent;
              const address = item.querySelector(
                ".branch-modal__address",
              ).textContent;

              const placemark = new ymaps.Placemark(
                coords,
                {
                  balloonContentHeader: title,
                  balloonContentBody: address,
                },
                customMarkerIcon,
              );

              branchesMapInstance.geoObjects.add(placemark);

              item.addEventListener("click", (evt) => {
                if (evt.target.closest(".btn-buy-outline")) return;

                branchItems.forEach((b) => b.classList.remove("active"));
                item.classList.add("active");

                branchesMapInstance.panTo(coords, {
                  flying: true,
                  duration: 500,
                });
              });
            });

            branchesMapInstance.behaviors.disable("scrollZoom");
          } else if (branchesMapInstance) {
            branchesMapInstance.container.fitToViewport();
          }
        });
      }
    };

    const closeBranchesModal = () => {
      if (!branchesOverlay) return;
      branchesOverlay.classList.remove("active");
      document.body.style.overflow = "";
    };

    availabilityLinks.forEach((link) => {
      link.addEventListener("click", openBranchesModal);
    });

    if (branchesClose) {
      branchesClose.addEventListener("click", closeBranchesModal);
    }

    if (branchesOverlay) {
      branchesOverlay.addEventListener("mousedown", (e) => {
        if (e.target === branchesOverlay) closeBranchesModal();
      });
    }
  }
});
