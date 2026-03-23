import { initYandexMap } from '../utils/maps.js';

export function initProductPageLogic() {
  const localCartState = {};

  const setupBuyStates = (state1Id, state2Id, btnAddId, getActiveVariantId) => {
    const state1 = document.getElementById(state1Id);
    const state2 = document.getElementById(state2Id);
    const btnAdd = document.getElementById(btnAddId);
    const minusBtn = state2?.querySelector(".qty-minus");
    const plusBtn = state2?.querySelector(".qty-plus");
    const input = state2?.querySelector(".qty-input");

    if (!state1 || !state2 || !btnAdd || !input) return null;

    const updateUI = () => {
      const variantId = getActiveVariantId();
      const qty = localCartState[variantId] || 0;

      if (qty > 0) {
        state1.classList.add("hidden");
        state2.classList.remove("hidden");
        input.value = qty;
      } else {
        state2.classList.add("hidden");
        state1.classList.remove("hidden");
        input.value = "1";
      }
    };

    btnAdd.addEventListener("click", (e) => {
      e.preventDefault();
      const variantId = getActiveVariantId();
      localCartState[variantId] = 1;
      updateUI();
    });

    if (minusBtn && plusBtn) {
      minusBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const variantId = getActiveVariantId();
        let val = localCartState[variantId] || 1;

        if (val > 1) {
          localCartState[variantId] = val - 1;
        } else {
          delete localCartState[variantId];
        }
        updateUI();
      });

      plusBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const variantId = getActiveVariantId();
        let val = localCartState[variantId] || 1;

        if (val < 99) {
          localCartState[variantId] = val + 1;
        }
        updateUI();
      });
    }

    return updateUI;
  };

  const getProductVariant = () => {
    const activeVar = document.querySelector(
      ".product-weight-block .product-var.active",
    );
    return activeVar ? activeVar.textContent.trim() : "default_product";
  };

  const updateProductUI = setupBuyStates(
    "actionState1",
    "actionState2",
    "btnAddToCartState",
    getProductVariant,
  );

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
        if (updateProductUI) updateProductUI();
      }
    });
  }

  const getCertVariant = () => {
    const form = document.querySelector(".certificate-form-card");
    if (!form) return "default_cert";
    const amount =
      form.querySelector('input[name="cert_amount"]:checked')?.value || "0";
    const type =
      form.querySelector('input[name="cert_type"]:checked')?.value || "none";
    return `cert_${amount}_${type}`;
  };

  const updateCertUI = setupBuyStates(
    "certActionState1",
    "certActionState2",
    "btnAddCertToCart",
    getCertVariant,
  );

  const certForm = document.querySelector(".certificate-form-card");
  if (certForm) {
    certForm.addEventListener("change", (e) => {
      if (e.target.name === "cert_amount" || e.target.name === "cert_type") {
        if (updateCertUI) updateCertUI();
      }
    });
  }

  const branchesOverlay = document.getElementById("branchesModalOverlay");
  const branchesClose = document.getElementById("branchesModalClose");
  let branchesMapInstance = null;

  const openBranchesModal = (e) => {
    if (e) e.preventDefault();
    if (!branchesOverlay) return;

    branchesOverlay.classList.add("active");
    document.body.style.overflow = "hidden";

    if (!branchesMapInstance && document.getElementById("branchesMap")) {
      const branchItems = document.querySelectorAll(".branch-modal-item");
      const markersData = Array.from(branchItems).map((item) => {
        const coordsRaw = item.getAttribute("data-coords");
        return {
          coords: coordsRaw ? coordsRaw.split(",").map((c) => parseFloat(c.trim())) : [],
          title: item.querySelector(".branch-modal__name")?.textContent || "",
          address: item.querySelector(".branch-modal__address")?.textContent || "",
          element: item,
        };
      });

      initYandexMap("branchesMap", [56.008984, 92.76673], 12, markersData).then(map => {
        branchesMapInstance = map;
      });
    } else if (branchesMapInstance) {
      branchesMapInstance.container.fitToViewport();
    }
  };

  document.body.addEventListener("click", (e) => {
    const availLink = e.target.closest(".availability-link");
    if (availLink) {
      openBranchesModal(e);
    }
  });

  if (branchesClose) {
    branchesClose.addEventListener("click", () => {
      branchesOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  if (branchesOverlay) {
    branchesOverlay.addEventListener("mousedown", (e) => {
      if (e.target === branchesOverlay) {
        branchesOverlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }
}