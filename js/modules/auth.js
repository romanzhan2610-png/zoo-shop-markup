import { api } from '../api/mockApi.js';
import { get } from '../utils/dom.js';

export function initAuthModal() {
  const authOverlay = get("authModalOverlay");
  const authModal = get("authModal");
  const closeBtn = get("authModalClose");
  const openBtns = document.querySelectorAll('[aria-label="Личный кабинет"]');

  if (!authOverlay) return;

  const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;

  const openModal = (e) => {
    e?.preventDefault();
    const scrollbarWidth = getScrollbarWidth();
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    const fab = document.getElementById("fabWidget");
    if (fab) fab.style.paddingRight = `${scrollbarWidth}px`;

    authOverlay.classList.add("active");
    switchView("login");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    authOverlay.classList.remove("active");
    setTimeout(() => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      const fab = document.getElementById("fabWidget");
      if (fab) fab.style.paddingRight = "";

      authOverlay.querySelectorAll("form").forEach((f) => {
        f.reset();
        f.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
      });
      authOverlay.querySelectorAll(".form-global-error").forEach((el) => el.classList.remove("active"));
    }, 300);
  };

  openBtns.forEach((btn) => btn.addEventListener("click", openModal));
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  const successCloseBtn = get("btnSuccessClose");
  if (successCloseBtn) successCloseBtn.addEventListener("click", closeModal);

  authOverlay.addEventListener("mousedown", (e) => {
    if (e.target === authOverlay) closeModal();
  });

  const switchView = (viewName) => {
    authOverlay.querySelectorAll(".auth-view").forEach((v) => v.classList.remove("active"));
    authOverlay.querySelectorAll(".form-global-error").forEach((el) => el.classList.remove("active"));
    const target = authOverlay.querySelector(`[data-view="${viewName}"]`);
    if (target) target.classList.add("active");
  };

  authOverlay.addEventListener("click", (e) => {
    const switchBtn = e.target.closest("[data-switch-view]");
    if (switchBtn) {
      e.preventDefault();
      switchView(switchBtn.dataset.switchView);
    }
  });

  authOverlay.addEventListener("click", (e) => {
    const toggleBtn = e.target.closest(".btn-toggle-password");
    if (toggleBtn) {
      const input = toggleBtn.previousElementSibling;
      if (input && input.type === "password") {
        input.type = "text";
        toggleBtn.style.color = "var(--primary)";
      } else if (input) {
        input.type = "password";
        toggleBtn.style.color = "";
      }
    }
  });

  authOverlay.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("is-invalid");
    });
  });

  const setError = (input, msgText) => {
    input.classList.add("is-invalid");
    const msg = input.parentElement.querySelector(".form-error-msg");
    if (msg && msgText) msg.textContent = msgText;
  };

  const setGlobalError = (id, msg) => {
    const el = get(id);
    if (el) {
      el.textContent = msg;
      el.classList.add("active");
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => phone.replace(/\D/g, "").length >= 10;
  const validateLoginStr = (str) => validateEmail(str) || validatePhone(str);

  const formLogin = get("formLogin");
  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();
      const login = formLogin.login;
      const pass = formLogin.password;
      let isValid = true;

      if (!login.value.trim() || !validateLoginStr(login.value.trim())) {
        setError(login, "Введите корректный email или телефон");
        isValid = false;
      }
      if (!pass.value.trim()) {
        setError(pass, "Введите пароль");
        isValid = false;
      }

      if (isValid) {
        authModal.classList.add("is-loading");
        api.login(login.value.trim(), pass.value)
          .then(() => closeModal())
          .catch((err) => setGlobalError("loginGlobalError", err.message))
          .finally(() => authModal.classList.remove("is-loading"));
      }
    });
  }

  const formRegister = get("formRegister");
  if (formRegister) {
    formRegister.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = formRegister.name;
      const email = formRegister.email;
      const phone = formRegister.phone;
      const pass1 = formRegister.new_password;
      const pass2 = formRegister.new_password_confirm;
      const policy = formRegister.policy;
      let isValid = true;

      if (!name.value.trim()) {
        setError(name, "Укажите имя");
        isValid = false;
      }
      if (!validateEmail(email.value.trim())) {
        setError(email, "Укажите корректный email");
        isValid = false;
      }
      if (!validatePhone(phone.value)) {
        setError(phone, "Введите корректный номер");
        isValid = false;
      }
      if (pass1.value.length < 6) {
        setError(pass1, "Минимум 6 символов");
        isValid = false;
      }
      if (pass1.value !== pass2.value) {
        setError(pass2, "Пароли не совпадают");
        isValid = false;
      }
      if (!policy.checked) {
        setGlobalError("registerGlobalError", "Необходимо согласие с политикой");
        isValid = false;
      }

      if (isValid) {
        authModal.classList.add("is-loading");
        api.register()
          .then(() => {
            get("codeTargetInfo").textContent = email.value.trim();
            switchView("code");
          })
          .catch((err) => setGlobalError("registerGlobalError", err.message))
          .finally(() => authModal.classList.remove("is-loading"));
      }
    });
  }

  const formRecovery = get("formRecovery");
  if (formRecovery) {
    formRecovery.addEventListener("submit", (e) => {
      e.preventDefault();
      const contact = formRecovery.contact;

      if (validateEmail(contact.value.trim())) {
        authModal.classList.add("is-loading");
        api.recovery()
          .then(() => {
            get("codeTargetInfo").textContent = contact.value;
            switchView("code");
          })
          .catch((err) => setGlobalError("recoveryGlobalError", err.message))
          .finally(() => authModal.classList.remove("is-loading"));
      } else {
        setError(contact, "Укажите корректный email");
      }
    });
  }

  const codeInputs = document.querySelectorAll(".code-input");
  codeInputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9]/g, "");
      if (this.value.length === 1 && index < codeInputs.length - 1) {
        codeInputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Backspace" && this.value === "" && index > 0) {
        codeInputs[index - 1].focus();
      }
    });

    input.addEventListener("paste", function (e) {
      e.preventDefault();
      const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 4);
      pasteData.split("").forEach((char, i) => {
        if (codeInputs[i]) {
          codeInputs[i].value = char;
          if (i < 3) codeInputs[i + 1].focus();
        }
      });
    });
  });

  const formCode = get("formCode");
  if (formCode) {
    formCode.addEventListener("submit", (e) => {
      e.preventDefault();
      const code = Array.from(codeInputs).map((i) => i.value).join("");

      if (code.length === 4) {
        authModal.classList.add("is-loading");
        api.verifyCode(code)
          .then(() => switchView("new-password"))
          .catch((err) => {
            setGlobalError("codeGlobalError", err.message);
            codeInputs.forEach((i) => i.classList.add("is-invalid"));
          })
          .finally(() => authModal.classList.remove("is-loading"));
      } else {
        setGlobalError("codeGlobalError", "Введите 4 цифры");
      }
    });
  }

  const formNewPassword = get("formNewPassword");
  if (formNewPassword) {
    formNewPassword.addEventListener("submit", (e) => {
      e.preventDefault();
      const p1 = formNewPassword.pass1;
      const p2 = formNewPassword.pass2;
      let isValid = true;

      if (p1.value.length < 6) {
        setError(p1, "Минимум 6 символов");
        isValid = false;
      }
      if (p1.value !== p2.value) {
        setError(p2, "Пароли не совпадают");
        isValid = false;
      }

      if (isValid) {
        authModal.classList.add("is-loading");
        api.newPassword()
          .then(() => {
            get("successMessage").textContent = "Ваш пароль успешно изменен!";
            switchView("success");
          })
          .catch((err) => setGlobalError("newPassGlobalError", err.message))
          .finally(() => authModal.classList.remove("is-loading"));
      }
    });
  }
}