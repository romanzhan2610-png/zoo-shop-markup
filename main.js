document.addEventListener("DOMContentLoaded", () => {
  const get = (id) => document.getElementById(id);

  // Инициализация всех модулей
  initNavigation();
  initSearch();
  initSliders();
  initFilters();
  initProductCards();
  initScrollableAreas();
  initFab();
  initGlobalClickHandlers();
  initContactsMap();

  /* ==========================================================================
     МОДУЛЬ НАВИГАЦИИ (ДЕСКТОП И МОБИЛЬНОЕ МЕНЮ)
  ========================================================================== */
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

    // Открытие/закрытие каталога
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

    // Логика переходов внутри мобильного меню
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

    // Ховеры десктопного меню категорий
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

    // Сворачивание длинных списков подкатегорий (> 6 элементов)
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

  /* ==========================================================================
     МОДУЛЬ ПОИСКА
  ========================================================================== */
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

    // Ввод в поле поиска (Debounce)
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

            // BACKEND: Здесь необходимо добавить fetch() для поиска по сайту.
            // При успешном ответе заменить содержимое searchResultsContent
            // и убрать лоадер. Сейчас стоит мок-заглушка на 800ms.

            searchLoader.style.display = "none";
            searchResultsContent.style.opacity = "1";
          }, 800);
        } else {
          searchResults.classList.remove("show");
        }
      });
    }
  }

  /* ==========================================================================
     МОДУЛЬ СЛАЙДЕРОВ (SWIPER)
  ========================================================================== */
  function initSliders() {
    const heroCat = get("heroCat");

    // Главный слайдер
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

    // Слайдеры товаров
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

    // Слайдер статей
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

  /* ==========================================================================
     МОДУЛЬ ФИЛЬТРОВ И СОРТИРОВКИ
  ========================================================================== */
  function initFilters() {
    const filterDropdowns = document.querySelectorAll(".filter-dropdown");
    if (!filterDropdowns.length) return;

    // Сохраняем изначальный текст кнопок
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

            // BACKEND: Если фильтры применяются по клику (закрытию дропдауна) или AJAX,
            // вызов функции обновления каталога стоит делать здесь.
          }
        });
      }

      closeBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropdown.classList.remove("open");
          updateFilterState();

          // BACKEND: Кнопка "ГОТОВО". Отправка формы / AJAX запрос.
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

            // BACKEND: Сортировка применяется сразу. Запуск AJAX/перезагрузки страницы.
            return;
          }
        }

        dropdown.classList.toggle("has-selection", count > 0);
        if (count === 0 && filterType === "range")
          textSpan.textContent = originalLabel;
      };

      // Слушатели инпутов
      dropdown
        .querySelectorAll('input[type="checkbox"], input[type="radio"]')
        .forEach((input) => {
          input.addEventListener("change", updateFilterState);
        });

      // Очистка конкретного фильтра
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

          // BACKEND: Сброс группы фильтров завершен. Триггер обновления списка товаров.
        });
      });

      // Логика двойного ползунка range (цена/вес)
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

    // Репозиционирование поповеров при скролле
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

    // Кнопка полного сброса всех фильтров
    const resetAllBtn = get("resetAllFilters");
    if (resetAllBtn) {
      resetAllBtn.addEventListener("click", (e) => {
        e.preventDefault();
        filterDropdowns.forEach((dropdown) => {
          const clearBtn = dropdown.querySelector(".clear-filter");
          if (clearBtn) clearBtn.click();
        });

        // BACKEND: Вызов очистки всей формы фильтров и сброс URL
      });
    }
  }

  /* ==========================================================================
     МОДУЛЬ КАРТОЧЕК ТОВАРОВ (Избранное, Фасовки)
  ========================================================================== */
  function initProductCards() {
    // Делегирование событий на весь документ для динамически загружаемых карточек (AJAX)
    document.addEventListener("click", (e) => {
      // 1. Выбор вариации/фасовки (веса) товара
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

          // BACKEND: При клике на фасовку здесь можно обновлять:
          // 1) Цену в .product-card__price
          // 2) data-id товара у кнопки добавления в корзину (.btn-add-cart-desktop / mobile)
        }
      }

      // 2. Добавление в избранное
      const favBtn = e.target.closest(".product-card__fav");
      if (favBtn) {
        e.preventDefault();
        e.stopPropagation();
        favBtn.classList.toggle("active");

        // BACKEND: Здесь запрос fetch()/AJAX к API добавления в wishlist.
        // const productId = favBtn.closest('.product-card').dataset.id;
        // Если ответ API успешный -> оставляем класс active, если ошибка -> убираем класс.
      }

      // 3. Добавление в корзину
      const cartBtn =
        e.target.closest(".btn-add-cart-desktop") ||
        e.target.closest(".btn-add-cart-mobile");
      if (cartBtn && cartBtn.closest(".product-card")) {
        e.preventDefault();

        // BACKEND: Здесь запрос добавления товара в корзину (закрытие стандартного перехода по ссылке)
      }
    });
  }

  /* ==========================================================================
     МОДУЛЬ ГОРИЗОНТАЛЬНОГО СКРОЛЛА (Стрелки у подкатегорий и фильтров)
  ========================================================================== */
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

  /* ==========================================================================
     МОДУЛЬ FAB-КНОПКИ (Связь)
  ========================================================================== */
  function initFab() {
    const fabWidget = get("fabWidget");
    const fabBtn = get("fabBtn");

    if (fabBtn && fabWidget) {
      fabBtn.addEventListener("click", () =>
        fabWidget.classList.toggle("active"),
      );
    }
  }

  /* ==========================================================================
     ГЛОБАЛЬНЫЕ КЛИКИ (ЗАКРЫТИЕ ВЫПАДАШЕК)
  ========================================================================== */
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
      // Закрытие поиска
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

      // Закрытие мега-меню (десктоп)
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

      // Закрытие FAB кнопки
      if (
        fabWidget &&
        fabBtn &&
        !fabWidget.contains(e.target) &&
        !fabBtn.contains(e.target)
      ) {
        fabWidget.classList.remove("active");
      }

      // Закрытие дропдаунов фильтров
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
  /* ==========================================================================
     МОДУЛЬ КАРТЫ (Контакты)
  ========================================================================== */
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

      // SVG-иконка пина
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
});
