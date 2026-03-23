export function initProductCards() {
  document.body.addEventListener("click", (e) => {
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

    const favBtn = e.target.closest(".product-card__fav, .order-product__fav");
    if (favBtn) {
      e.preventDefault();
      e.stopPropagation();
      favBtn.classList.toggle("active");
    }
  });
}