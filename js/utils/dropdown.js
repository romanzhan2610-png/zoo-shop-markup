export function initCustomDropdown(inputId, listId, wrapId, onSelectCallback) {
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);
  const wrap = document.getElementById(wrapId);

  if (!input || !list || !wrap) return;

  input.addEventListener("focus", () => wrap.classList.add("open"));
  input.addEventListener("click", () => wrap.classList.add("open"));

  input.addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase();
    list.querySelectorAll("li").forEach((li) => {
      li.style.display = li.textContent.toLowerCase().includes(val)
        ? "block"
        : "none";
    });
  });

  list.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      input.value = e.target.textContent;
      wrap.classList.remove("open");
      if (onSelectCallback) onSelectCallback(input.value);
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(`#${wrapId}`)) {
      wrap.classList.remove("open");
    }
  });
}