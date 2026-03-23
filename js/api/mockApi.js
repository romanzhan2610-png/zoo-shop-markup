export const api = {
  login: (login, pass) => new Promise((resolve, reject) => {
    setTimeout(() => {
      if (login === "test@mail.ru" && pass === "123456") resolve();
      else reject(new Error("Неверный логин или пароль"));
    }, 1000);
  }),
  register: () => new Promise(resolve => setTimeout(resolve, 1000)),
  recovery: () => new Promise(resolve => setTimeout(resolve, 1000)),
  verifyCode: (code) => new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code === "1111") resolve();
      else reject(new Error("Введен неверный код"));
    }, 1000);
  }),
  newPassword: () => new Promise(resolve => setTimeout(resolve, 1000)),
  applyPromoCart: (code) => new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code === "TEST" || code === "SALE") {
        resolve({ msg: "Промокод успешно применен!", discount: "- 360 ₽", total: "3 240 ₽" });
      } else {
        reject(new Error("Промокод не найден или устарел"));
      }
    }, 600);
  }),
  applyPromoCheckout: (code) => new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code === "TEST" || code === "SALE") {
        resolve({ msg: "Промокод успешно применен!", discount: "- 240 ₽" });
      } else {
        reject(new Error("Промокод не найден"));
      }
    }, 500);
  })
};