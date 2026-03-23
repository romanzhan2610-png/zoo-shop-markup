import { api } from "../api/mockApi.js";
import { initCustomDropdown } from "../utils/dropdown.js";
import { get } from '../utils/dom.js';

export function initCheckout() {
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
        get("savedAddressPickup").textContent = selectedBranch.dataset.address;

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

  const cityInput = get("cityInput");
  const streetInput = get("streetInput");
  const flatInput = get("flatInput");
  const btnSaveDelivery = get("btnSaveDelivery");
  const btnChangeDelivery = get("btnChangeDelivery");

  const checkDeliveryForm = () => {
    if (!btnSaveDelivery || !cityInput || !streetInput) return;
    if (
      cityInput.value.trim().length > 2 &&
      streetInput.value.trim().length > 2
    ) {
      btnSaveDelivery.disabled = false;
      btnSaveDelivery.style.opacity = "1";
    } else {
      btnSaveDelivery.disabled = true;
      btnSaveDelivery.style.opacity = "0.5";
    }
  };

  initCustomDropdown(
    "cityInput",
    "cityList",
    "cityDropdownWrap",
    checkDeliveryForm,
  );

  if (cityInput) cityInput.addEventListener("input", checkDeliveryForm);
  if (streetInput) streetInput.addEventListener("input", checkDeliveryForm);

  checkDeliveryForm();

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
  let cachedTotalText = "";

  if (promoBtn && promoInput && promoMessage) {
    promoBtn.addEventListener("click", () => {
      const iconApply = promoBtn.querySelector(".icon-apply");
      const iconCancel = promoBtn.querySelector(".icon-cancel");
      const cartTotal = get("cartTotal");

      if (isPromoApplied) {
        isPromoApplied = false;
        promoInput.value = "";
        promoInput.disabled = false;
        if (iconApply) iconApply.style.display = "block";
        if (iconCancel) iconCancel.style.display = "none";
        promoMessage.className = "promo-message";
        promoMessage.textContent = "";
        if (discountRow) discountRow.style.display = "none";

        if (cartTotal && cachedTotalText)
          cartTotal.textContent = cachedTotalText;
        return;
      }

      const val = promoInput.value.trim().toUpperCase();
      if (!val) return;

      if (cartTotal) cachedTotalText = cartTotal.textContent;

      promoBtn.style.opacity = "0.5";
      promoBtn.disabled = true;

      api
        .applyPromoCheckout(val)
        .then((res) => {
          isPromoApplied = true;
          promoMessage.textContent = res.msg;
          promoMessage.className = "promo-message success";
          if (iconApply) iconApply.style.display = "none";
          if (iconCancel) iconCancel.style.display = "block";
          promoInput.disabled = true;
          if (discountRow) {
            discountRow.style.display = "flex";
            const spanVal = discountRow.querySelector("span:last-child");
            if (spanVal) spanVal.textContent = res.discount;
          }
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

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const userName = get("userName");
  const userPhone = get("userPhone");
  const userEmail = get("userEmail");
  const userPolicy = get("userPolicy");
  const finalSubmitBtn = get("finalSubmitBtn");

  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;
    let firstErrorElement = null;

    checkoutForm
      .querySelectorAll(".is-invalid")
      .forEach((el) => el.classList.remove("is-invalid"));

    const isPickupSaved =
      cards.pickup.el && cards.pickup.el.classList.contains("saved");
    const isDeliverySaved =
      cards.delivery.el && cards.delivery.el.classList.contains("saved");

    if (!isPickupSaved && !isDeliverySaved) {
      alert("Пожалуйста, выберите и сохраните способ доставки или самовывоза.");
      if (cards.pickup.el) firstErrorElement = cards.pickup.el;
      isValid = false;
    }

    if (userName && !userName.value.trim()) {
      userName.classList.add("is-invalid");
      if (!firstErrorElement) firstErrorElement = userName;
      isValid = false;
    }

    if (userPhone) {
      const digits = userPhone.value.replace(/\D/g, "");
      if (digits.length < 10) {
        userPhone.classList.add("is-invalid");
        if (!firstErrorElement) firstErrorElement = userPhone;
        isValid = false;
      }
    }

    if (
      userEmail &&
      userEmail.value.trim() &&
      !validateEmail(userEmail.value.trim())
    ) {
      userEmail.classList.add("is-invalid");
      if (!firstErrorElement) firstErrorElement = userEmail;
      isValid = false;
    }

    if (userPolicy && !userPolicy.checked) {
      userPolicy.classList.add("is-invalid");
      if (!firstErrorElement)
        firstErrorElement = userPolicy.closest(".custom-checkbox");
      isValid = false;
    }

    if (!isValid) {
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } else {
      const originalText = finalSubmitBtn.textContent;
      finalSubmitBtn.disabled = true;
      finalSubmitBtn.style.opacity = "0.7";
      finalSubmitBtn.textContent = "ОБРАБОТКА...";

      setTimeout(() => {
        alert("Заказ успешно оформлен!");
        finalSubmitBtn.disabled = false;
        finalSubmitBtn.style.opacity = "1";
        finalSubmitBtn.textContent = originalText;

        checkoutForm.reset();
        resetCards();

        if (promoBtn && isPromoApplied) promoBtn.click();
      }, 1500);
    }
  });

  checkoutForm.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => input.classList.remove("is-invalid"));
    input.addEventListener("change", () =>
      input.classList.remove("is-invalid"),
    );
  });
}