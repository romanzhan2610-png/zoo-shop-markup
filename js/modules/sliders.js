import cat1 from '../../img/cat-pose-1.png';
import cat2 from '../../img/cat-pose-2.png';
import cat3 from '../../img/cat-pose-3.png';
import cat4 from '../../img/cat-pose-4.png';
import cat5 from '../../img/cat-pose-5.png';
import { get } from '../utils/dom.js';

export function initSliders() {
  const heroCat = get("heroCat");

  if (document.querySelector(".mySwiper")) {
    const catPoses = [cat1, cat2, cat3, cat4, cat5];
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