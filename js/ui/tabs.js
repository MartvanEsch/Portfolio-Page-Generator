import { activePages } from "../managers/TabManager.js";

export function updateTabs() {
  let tabsEl = document.querySelector("#preview #tabs");
  tabsEl.innerHTML = "";
  activePages.forEach((page) => {
    let button = document.createElement("button");
    button.dataset.page = JSON.stringify(page);
    button.textContent = page.name;

    button.addEventListener("click", (e) => {
      myPage.loadNewPage(JSON.parse(e.target.dataset.page));
    });

    tabsEl.append(button);
  });
}









