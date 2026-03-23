import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";
import { resolve, extname } from "path";
import fs from "fs";

function getHtmlFiles() {
  const pages = {};
  const files = fs.readdirSync(__dirname);

  files.forEach((file) => {
    if (extname(file) === ".html") {
      const name = file.replace(".html", "");
      pages[name] = resolve(__dirname, file);
    }
  });

  return pages;
}

export default defineConfig({
  base: "/zoo-shop-markup/",
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, "partials"),

      context(pagePath) {
        const pageData = {
          "/index.html": { title: "Главная", preloadSlide: true },
          "/catalog.html": { title: "Каталог", preloadSlide: false },
          "/certificate.html": {
            title: "Подарочный сертификат",
            preloadSlide: false,
          },
          "/checkout.html": { title: "Оформление заказа", preloadSlide: false },
          "/contacts.html": { title: "Контакты", preloadSlide: false },
          "/delivery.html": { title: "Доставка и оплата", preloadSlide: false },
          "/product.html": { title: "Страница товара", preloadSlide: false },
          "/favorites.html": { title: "Избранное", preloadSlide: false },
          "/profile.html": { title: "Личный кабинет", preloadSlide: false },
          "/return-policy.html": {
            title: "Политика возврата",
            preloadSlide: false,
          },
          "/privacy.html": {
            title: "Политика конфиденциальности",
            preloadSlide: false,
          },
        };

        return (
          pageData[pagePath] || { title: "Зоомагазин", preloadSlide: false }
        );
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: getHtmlFiles(),
    },
  },
});
