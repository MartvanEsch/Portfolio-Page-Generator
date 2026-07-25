import { myPage } from "../app.js";

import { fetchCache } from "../managers/StorageManager.js";

// LIBRARIES
import JSZip from "jszip";
import { saveAs } from "file-saver";

export function setupInputFields(elementValue) {
  const addInputsProperties = {
    Header: ["Text"],
    Subheader: ["Text"],
    Paragraph: ["Text"],
    Caption: ["Text"],
    Image: ["Path", "Alt"],
    Video: ["Embed"],
    Link: ["Url"],
  };

  const properties = document.querySelector("#properties");
  let propertiesInputs = properties.querySelectorAll("div > input");
  console.log(propertiesInputs);
  const inputsNeeded = addInputsProperties[elementValue];

  propertiesInputs.forEach((el) => {
    if (!inputsNeeded.includes(el.placeholder)) {
      el.classList.add("hidden");
    } else {
      el.classList.remove("hidden");
    }
  });

  properties.classList.remove("hidden");
}

export function setupEventlisteners() {
  let type = "";

  const settingInputs = document.querySelectorAll("[data-prop]");
  settingInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      let property = e.target.dataset.prop;
      let value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      myPage.updateObject(property, value);
    });
  });

  const selectElementInputs = document.querySelectorAll(".addInput");
  selectElementInputs.forEach((input) => {
    input.addEventListener("click", (e) => {
      console.log(e.target);
      let value = e.target.value;
      type = value;
      setupInputFields(value);
      addElInput.classList.remove("hidden");
    });
  });

  const properties = document.querySelector("#properties");
  const addElInput = document.querySelector("#addElInput");
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

  const exportPageButton = document.querySelector("#exportPageBtn");
  exportPageButton.addEventListener("click", () => {
    let html = myPage.exportPageHTML();
    let zip = new JSZip();

    zip.file("index.html", html);

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "example.zip");
    });
  });

  const saveCacheButton = document.querySelector("#saveCacheBtn");
  saveCacheButton.addEventListener("click", () => {
    if (myPage.name != "") {
      localStorage.setItem(myPage.name, JSON.stringify(myPage));
    }
  });

  const loadCacheButton = document.querySelector("#loadCacheBtn");
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

  const loadInput = document.querySelector("#loadInput");
  const loadTextButton = document.querySelector("#loadTextBtn");
  loadTextButton.addEventListener("click", () => {
    myPage.loadNewPage(JSON.parse(loadInput.value));
    loadInput.value = "";
  });
}
