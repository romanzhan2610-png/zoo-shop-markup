import { get } from '../utils/dom.js';

export function initFilters() {
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
        count = dropdown.querySelectorAll('input[type="checkbox"]:checked').length;
        if (badge) badge.textContent = count;
      } else if (filterType === "range") {
        const wrap = dropdown.querySelector(".range-slider-wrap");
        if (wrap) {
          const defaultMin = parseFloat(wrap.dataset.min);
          const defaultMax = parseFloat(wrap.dataset.max);
          const currentMin = parseFloat(dropdown.querySelector(".input-min").value);
          const currentMax = parseFloat(dropdown.querySelector(".input-max").value);

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
        const checkedRadio = dropdown.querySelector('input[type="radio"]:checked');
        if (checkedRadio) {
          textSpan.textContent = checkedRadio.nextElementSibling.nextElementSibling.textContent;
          dropdown.classList.add("has-selection");
          return;
        }
      }

      dropdown.classList.toggle("has-selection", count > 0);
      if (count === 0 && filterType === "range") textSpan.textContent = originalLabel;
    };

    dropdown.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach((input) => {
      input.addEventListener("change", updateFilterState);
    });

    clearBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (filterType === "checkbox") {
          dropdown.querySelectorAll('input[type="checkbox"]').forEach((i) => (i.checked = false));
        } else if (filterType === "range") {
          const wrap = dropdown.querySelector(".range-slider-wrap");
          dropdown.querySelector(".input-min").value = wrap.dataset.min;
          dropdown.querySelector(".range-thumb-min").value = wrap.dataset.min;
          dropdown.querySelector(".input-max").value = wrap.dataset.max;
          dropdown.querySelector(".range-thumb-max").value = wrap.dataset.max;
          dropdown.querySelector(".range-thumb-min").dispatchEvent(new Event("input"));
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
      if (dropdown.classList.contains("open")) updatePopoverPosition(dropdown);
    });
  };

  window.addEventListener("scroll", handleScrollReposition, { passive: true });
  const filtersList = get("filtersList");
  if (filtersList) filtersList.addEventListener("scroll", handleScrollReposition, { passive: true });

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