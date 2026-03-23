import { get } from '../utils/dom.js';

export function initFab() {
  const fabWidget = get("fabWidget");
  const fabBtn = get("fabBtn");

  if (fabBtn && fabWidget) {
    fabBtn.addEventListener("click", () => fabWidget.classList.toggle("active"));
  }
}