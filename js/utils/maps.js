export function initYandexMap(containerId, centerCoords, zoom, markersData) {
  return new Promise((resolve) => {
    if (typeof ymaps === "undefined") {
      resolve(null);
      return;
    }
    ymaps.ready(() => {
      const mapContainer = document.getElementById(containerId);
      if (!mapContainer) {
        resolve(null);
        return;
      }
      const map = new ymaps.Map(containerId, {
        center: centerCoords,
        zoom: zoom,
        controls: ["zoomControl"],
      });
      const customMarkerIcon = {
        iconLayout: "default#image",
        iconImageHref: "img/map-pin.svg",
        iconImageSize: [32, 40],
        iconImageOffset: [-16, -40],
      };
      markersData.forEach((marker) => {
        if (!marker.coords || marker.coords.length === 0) return;
        const placemark = new ymaps.Placemark(
          marker.coords,
          {
            balloonContentHeader: marker.title,
            balloonContentBody: marker.address,
          },
          customMarkerIcon
        );
        map.geoObjects.add(placemark);
        if (marker.element) {
          marker.element.addEventListener("click", (e) => {
            if (e.target.closest(".btn-buy-outline")) return;
            markersData.forEach(m => m.element.classList.remove("active"));
            marker.element.classList.add("active");
            map.panTo(marker.coords, { flying: true, duration: 500 });
          });
        }
      });
      map.behaviors.disable("scrollZoom");
      resolve(map);
    });
  });
}