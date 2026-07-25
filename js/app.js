// CLASSES
import { Element } from "./models/Element.js";
import { Page } from "./models/Page.js";

// VARS
import { activePages } from "./managers/TabManager.js";

// FUNCS
import { fetchCache } from "./managers/StorageManager.js";
import { renderPreview, updateObjPreview } from "./ui/preview.js";
import { updateTabs } from "./ui/tabs.js";
import { setupInputFields } from "./ui/inputs.js";

//////////////////////////////////////

export let myPage = new Page();

function init() {
  let type = "";

  const inputs = document.querySelectorAll("[data-prop]");
  const addInputs = document.querySelectorAll(".addInput");
  const addElInput = document.querySelector("#addElInput");

  const loadInput = document.querySelector("#loadInput");
  const loadTextButton = document.querySelector("#loadTextBtn");

  const loadCacheButton = document.querySelector("#loadCacheBtn");
  const saveCacheButton = document.querySelector("#saveCacheBtn");

  const exportPageButton = document.querySelector("#exportPageBtn");

  exportPageButton.addEventListener("click", () => {
    let html = myPage.exportPageHTML();
    let blob = new Blob([html], { type: "text/html" });

    let url = URL.createObjectURL(blob);

    let a = document.createElement("a");
    a.href = url;
    a.download = myPage.name;

    a.click();
    URL.revokeObjectURL(a);
  });

  saveCacheButton.addEventListener("click", () => {
    if (myPage.name != "") {
      localStorage.setItem(myPage.name, JSON.stringify(myPage));
    }
  });

  loadCacheButton.addEventListener("click", () => {
    let cache = fetchCache();

    let optionsDiv = document.querySelector("#options");
    optionsDiv.innerHTML = "";
    cache.forEach((page, index) => {
      let pageButton = document.createElement("button");
      pageButton.textContent = page.name + `(${index + 1})`;
      pageButton.classList.add("pageButton");
      pageButton.dataset.id = index + 1;

      pageButton.addEventListener("click", () => {
        myPage.loadNewPage(cache[pageButton.dataset.id - 1]);
      });
      optionsDiv.append(pageButton);
    });

    console.log(cache);
  });

  loadTextButton.addEventListener("click", () => {
    myPage.loadNewPage(JSON.parse(loadInput.value));
    loadInput.value = "";
  });

  inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      let property = e.target.dataset.prop;
      let value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      myPage.updateObject(property, value);
    });
  });

  addInputs.forEach((input) => {
    input.addEventListener("click", (e) => {
      let value = e.target.value;
      type = value;
      setupInputFields(value);
    });
  });

  addElInput.addEventListener("click", () => {
    const propertiesInputs = Array.from(
      properties.querySelectorAll(`input[type="text"]`),
    );
    let contentObj = {};

    propertiesInputs
      .filter((el) => !el.classList.contains("hidden"))
      .forEach((el) => {
        const key = el.placeholder.toLowerCase();
        contentObj[key] = el.value;
      });

    myPage.addElement(type, contentObj);
  });

  updateObjPreview();
}

document.addEventListener("DOMContentLoaded", init);
