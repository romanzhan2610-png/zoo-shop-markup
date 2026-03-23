import { initCustomDropdown } from "../utils/dropdown.js";

export function initProfileTabs() {
  const tabBtns = document.querySelectorAll(".profile-tab-btn");
  const tabPanes = document.querySelectorAll(".profile-tab-pane");
  const profilePage = document.querySelector(".profile-page");

  if (tabBtns.length === 0 || tabPanes.length === 0) return;

  const switchTab = (tabName, viewName = "list") => {
    tabBtns.forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    });
    tabPanes.forEach((pane) => pane.classList.remove("active"));

    const targetBtn = document.querySelector(
      `.profile-tab-btn[data-tab="${tabName}"]`,
    );
    const targetPane = document.getElementById(`tab-${tabName}`);

    if (targetBtn && targetPane) {
      targetBtn.classList.add("active");
      targetBtn.setAttribute("aria-selected", "true");
      targetPane.classList.add("active");

      if (profilePage) profilePage.classList.remove("is-subview-active");

      if (tabName === "orders") {
        const listView = document.getElementById("ordersListView");
        const detailView = document.getElementById("orderDetailView");
        if (listView && detailView) {
          if (viewName === "detail") {
            listView.classList.remove("active");
            detailView.classList.add("active");
            if (profilePage) profilePage.classList.add("is-subview-active");
          } else {
            detailView.classList.remove("active");
            listView.classList.add("active");
          }
        }
      }

      if (tabName === "auto") {
        const autoListView = document.getElementById("autoListView");
        const autoEditView = document.getElementById("autoEditView");
        if (autoListView && autoEditView) {
          if (viewName === "edit") {
            autoListView.classList.remove("active");
            autoEditView.classList.add("active");
            if (profilePage) profilePage.classList.add("is-subview-active");
          } else {
            autoEditView.classList.remove("active");
            autoListView.classList.add("active");
          }
        }
      }

      let newUrl = window.location.pathname + `?tab=${tabName}`;
      if (viewName !== "list") newUrl += `&view=${viewName}`;
      window.history.replaceState({ tab: tabName, view: viewName }, "", newUrl);
    }
  };

  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get("tab") || "main";
  const initialView = urlParams.get("view") || "list";
  switchTab(initialTab, initialView);

  document.body.addEventListener("click", (e) => {
    const navBtn = e.target.closest(".profile-tab-btn");
    if (navBtn && navBtn.dataset.tab) {
      e.preventDefault();
      switchTab(navBtn.dataset.tab);
    }

    const switchBtn = e.target.closest("[data-switch-tab]");
    if (switchBtn) {
      e.preventDefault();
      switchTab(switchBtn.dataset.switchTab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const orderItem = e.target.closest(".js-open-order");
    if (orderItem) {
      if (e.target.closest(".order-item__btn")) {
        return;
      }
      e.preventDefault();
      switchTab("orders", "detail");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (e.target.closest(".js-back-to-orders")) {
      e.preventDefault();
      switchTab("orders", "list");
    }

    if (e.target.closest(".js-edit-auto")) {
      e.preventDefault();
      switchTab("auto", "edit");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (e.target.closest(".js-back-to-auto-list")) {
      e.preventDefault();
      switchTab("auto", "list");
    }

    const autoTabBtn = e.target.closest(".js-auto-tab");
    if (autoTabBtn) {
      e.preventDefault();
      document
        .querySelectorAll(".js-auto-tab")
        .forEach((t) => t.classList.remove("active"));
      document
        .querySelectorAll(".js-auto-pane")
        .forEach((p) => p.classList.remove("active"));
      autoTabBtn.classList.add("active");
      const pane = document.getElementById(`pane-${autoTabBtn.dataset.target}`);
      if (pane) pane.classList.add("active");
    }
  });

  initCustomDropdown("profCityInput", "profCityList", "profCityDropdownWrap");

  const autoRadios = document.querySelectorAll(
    'input[name="auto_delivery_type"]',
  );
  autoRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const type = e.target.value;
      const pickupCard = document.getElementById("autoCardPickup");
      const deliveryCard = document.getElementById("autoCardDelivery");

      if (type === "pickup") {
        pickupCard.classList.add("active");
        pickupCard.querySelector(".radio-card__desc").style.display = "none";
        pickupCard
          .querySelector(".radio-card__saved-data")
          .classList.remove("hidden");
        pickupCard
          .querySelector(".radio-card__actions")
          .classList.remove("hidden");

        deliveryCard.classList.remove("active");
        deliveryCard.querySelector(".radio-card__desc").style.display = "block";
        deliveryCard
          .querySelector(".radio-card__saved-data")
          .classList.add("hidden");
        deliveryCard
          .querySelector(".radio-card__actions")
          .classList.add("hidden");
      } else {
        deliveryCard.classList.add("active");
        deliveryCard.querySelector(".radio-card__desc").style.display = "none";
        deliveryCard
          .querySelector(".radio-card__saved-data")
          .classList.remove("hidden");
        deliveryCard
          .querySelector(".radio-card__actions")
          .classList.remove("hidden");

        pickupCard.classList.remove("active");
        pickupCard.querySelector(".radio-card__desc").style.display = "block";
        pickupCard
          .querySelector(".radio-card__saved-data")
          .classList.add("hidden");
        pickupCard
          .querySelector(".radio-card__actions")
          .classList.add("hidden");
      }
    });
  });

  const autoPayRadios = document.querySelectorAll('input[name="auto_pay"]');
  autoPayRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      autoPayRadios.forEach((r) =>
        r.closest(".radio-card").classList.remove("active"),
      );
      e.target.closest(".radio-card").classList.add("active");
    });
  });

  const autoCards = {
    pickup: {
      el: document.getElementById("autoCardPickup"),
      body: document.getElementById("autoBodyPickup"),
      actions: document.getElementById("autoActionsPickup"),
      savedData: document.getElementById("autoSavedDataPickup"),
      desc: document.getElementById("autoDescPickup"),
    },
    delivery: {
      el: document.getElementById("autoCardDelivery"),
      body: document.getElementById("autoBodyDelivery"),
      actions: document.getElementById("autoActionsDelivery"),
      savedData: document.getElementById("autoSavedDataDelivery"),
      desc: document.getElementById("autoDescDelivery"),
      price: document.getElementById("autoPriceDelivery"),
    },
  };

  const autoTypeRadios = document.querySelectorAll(
    'input[name="auto_delivery_type"]',
  );

  const resetAutoCards = () => {
    Object.values(autoCards).forEach((card) => {
      if (!card.el) return;
      card.el.classList.remove("active", "saved");
      card.body.classList.add("hidden");
      card.actions.classList.add("hidden");
      card.savedData.classList.add("hidden");
      card.desc.style.display = "block";
    });
  };

  autoTypeRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      resetAutoCards();
      const type = e.target.value;
      if (autoCards[type].el) {
        autoCards[type].el.classList.add("active");
        autoCards[type].body.classList.remove("hidden");
        autoCards[type].desc.style.display = "none";
      }
    });
  });

  const autoBtnSavePickup = document.getElementById("autoBtnSavePickup");
  const autoBtnChangePickup = document.getElementById("autoBtnChangePickup");
  if (autoBtnSavePickup) {
    autoBtnSavePickup.addEventListener("click", () => {
      const selected = document.querySelector(
        'input[name="auto_branch"]:checked',
      );
      if (selected) {
        document.getElementById("autoSavedTitlePickup").textContent =
          selected.value;
        document.getElementById("autoSavedAddressPickup").textContent =
          selected.dataset.address;
        autoCards.pickup.body.classList.add("hidden");
        autoCards.pickup.el.classList.replace("active", "saved");
        autoCards.pickup.savedData.classList.remove("hidden");
        autoCards.pickup.actions.classList.remove("hidden");
      }
    });
  }
  if (autoBtnChangePickup) {
    autoBtnChangePickup.addEventListener("click", () => {
      autoCards.pickup.el.classList.replace("saved", "active");
      autoCards.pickup.body.classList.remove("hidden");
      autoCards.pickup.savedData.classList.add("hidden");
      autoCards.pickup.actions.classList.add("hidden");
    });
  }

  const autoCityInput = document.getElementById("autoCityInput");
  const autoStreetInput = document.getElementById("autoStreetInput");
  const autoFlatInput = document.getElementById("autoFlatInput");
  const autoBtnSaveDelivery = document.getElementById("autoBtnSaveDelivery");
  const autoBtnChangeDelivery = document.getElementById(
    "autoBtnChangeDelivery",
  );

  initCustomDropdown("autoCityInput", "autoCityList", "autoCityDropdownWrap");

  if (autoBtnSaveDelivery) {
    autoBtnSaveDelivery.addEventListener("click", () => {
      if (!autoCityInput.value || !autoStreetInput.value) return;
      let fullAddress = `${autoCityInput.value}, ${autoStreetInput.value}`;
      if (autoFlatInput && autoFlatInput.value)
        fullAddress += `, кв. ${autoFlatInput.value}`;

      document.getElementById("autoSavedAddressDelivery").textContent =
        fullAddress;
      if (autoCards.delivery.price)
        autoCards.delivery.price.textContent = "200 ₽";

      autoCards.delivery.body.classList.add("hidden");
      autoCards.delivery.el.classList.replace("active", "saved");
      autoCards.delivery.savedData.classList.remove("hidden");
      autoCards.delivery.actions.classList.remove("hidden");
    });
  }
  if (autoBtnChangeDelivery) {
    autoBtnChangeDelivery.addEventListener("click", () => {
      autoCards.delivery.el.classList.replace("saved", "active");
      autoCards.delivery.body.classList.remove("hidden");
      autoCards.delivery.savedData.classList.add("hidden");
      autoCards.delivery.actions.classList.add("hidden");
      if (autoCards.delivery.price)
        autoCards.delivery.price.textContent = "Узнать стоимость";
    });
  }

  const autoPayRadiosReal = document.querySelectorAll('input[name="auto_pay"]');
  const autoChangeInputWrap = document.getElementById("autoChangeInputWrap");
  autoPayRadiosReal.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      autoPayRadiosReal.forEach((r) =>
        r.closest(".radio-card").classList.remove("active"),
      );
      e.target.closest(".radio-card").classList.add("active");

      if (e.target.value === "cash") {
        autoChangeInputWrap.classList.remove("hidden");
      } else {
        autoChangeInputWrap.classList.add("hidden");
      }
    });
  });

  const btnToggleMonthly = document.getElementById("btnToggleMonthlyCalendar");
  const calendarMonthly = document.getElementById("calendarMonthly");
  const monthlyResultText = document.getElementById("monthlyResultText");

  const btnToggleWeekly = document.getElementById("btnToggleWeeklyCalendar");
  const calendarWeekly = document.getElementById("calendarWeekly");
  const weeklyResultText = document.getElementById("weeklyResultText");

  if (btnToggleMonthly && calendarMonthly) {
    btnToggleMonthly.addEventListener("click", () =>
      calendarMonthly.classList.add("active"),
    );
  }
  if (btnToggleWeekly && calendarWeekly) {
    btnToggleWeekly.addEventListener("click", () =>
      calendarWeekly.classList.add("active"),
    );
  }

  document.querySelectorAll(".js-close-calendar").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.target.closest(".calendar-popup").classList.remove("active");
    });
  });

  document.querySelectorAll(".js-cal-date").forEach((day) => {
    day.addEventListener("click", (e) => {
      document
        .querySelectorAll(".js-cal-date")
        .forEach((d) => d.classList.remove("active"));
      e.target.classList.add("active");
      if (monthlyResultText)
        monthlyResultText.textContent = `${e.target.textContent} числа`;
      setTimeout(
        () => e.target.closest(".calendar-popup").classList.remove("active"),
        300,
      );
    });
  });

  document.querySelectorAll(".js-cal-day").forEach((day) => {
    day.addEventListener("click", (e) => {
      document
        .querySelectorAll(".js-cal-day")
        .forEach((d) => d.classList.remove("active"));
      e.target.classList.add("active");
      const fullName = e.target.dataset.full || e.target.textContent;
      if (weeklyResultText) weeklyResultText.textContent = `По ${fullName}`;
      setTimeout(
        () => e.target.closest(".calendar-popup").classList.remove("active"),
        300,
      );
    });
  });
}