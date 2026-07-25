import { activePages } from "../managers/TabManager.js";
import { myPage } from "../app.js";

// LIBRARIES
import JSZip from "jszip";
import { saveAs } from "file-saver";

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
