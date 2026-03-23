import { api } from "../api/mockApi.js";
import { get } from '../utils/dom.js';

export function initCartLogic() {
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
  let originalTotalText = "";

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
        if (cartDiscountRow) cartDiscountRow.style.display = "none";
        if (cartTotal) cartTotal.textContent = originalTotalText;
        return;
      }

      const val = promoInput.value.trim().toUpperCase();
      if (!val) return;

      if (cartTotal) originalTotalText = cartTotal.textContent;

      promoBtn.style.opacity = "0.5";
      promoBtn.disabled = true;

      api
        .applyPromoCart(val)
        .then((res) => {
          isPromoApplied = true;
          promoMessage.textContent = res.msg;
          promoMessage.className = "promo-message success";
          if (iconApply) iconApply.style.display = "none";
          if (iconCancel) iconCancel.style.display = "block";
          promoInput.disabled = true;
          if (cartDiscountRow) cartDiscountRow.style.display = "flex";
          if (cartDiscount) cartDiscount.textContent = res.discount;
          if (cartTotal) cartTotal.textContent = res.total;
        })
        .catch((err) => {
          promoMessage.textContent = err.message;
          promoMessage.className = "promo-message error";
        })
        .finally(() => {
          promoBtn.style.opacity = "1";
          promoBtn.disabled = false;
        });
    });

    promoInput.addEventListener("input", () => {
      promoMessage.className = "promo-message";
      promoMessage.textContent = "";
    });
  }
}