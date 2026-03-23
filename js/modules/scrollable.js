import { get } from '../utils/dom.js';

export function initScrollableAreas() {
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
      next.style.display = area.scrollLeft + area.clientWidth >= area.scrollWidth - 1 ? "none" : "flex";
    };

    area.addEventListener("scroll", toggleArrows);
    window.addEventListener("resize", toggleArrows);
    prev.addEventListener("click", () => area.scrollBy({ left: -200, behavior: "smooth" }));
    next.addEventListener("click", () => area.scrollBy({ left: 200, behavior: "smooth" }));
    setTimeout(toggleArrows, 100);
  };

  attachScrollArea("subcatList", "subcatPrev", "subcatNext");
  attachScrollArea("filtersList", "filtersPrev", "filtersNext");
}