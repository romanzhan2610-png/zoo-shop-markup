import { get } from '../utils/dom.js';
import { initYandexMap } from '../utils/maps.js';

export function initContactsMap() {
  const mapContainer = get("map");
  if (!mapContainer) return;

  const branches = document.querySelectorAll(".branch-item");
  const markersData = Array.from(branches).map((branch) => {
    const coordsRaw = branch.getAttribute("data-coords");
    return {
      coords: coordsRaw ? coordsRaw.split(",").map((c) => parseFloat(c.trim())) : [],
      title: branch.querySelector("h3")?.textContent || "",
      address: branch.querySelector("p")?.textContent || "",
      element: branch,
    };
  });

  initYandexMap("map", [56.015283, 92.893247], 12, markersData);
}