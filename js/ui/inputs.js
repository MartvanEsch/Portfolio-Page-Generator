import cssContent from "../../project/styles.css?raw";
import jsContent from "../../project/project.js?raw";

import { myPage } from "../app.js";

import { fetchCache } from "../managers/StorageManager.js";

// LIBRARIES
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Compressor from "compressorjs";

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
  let propertiesInputs = properties.querySelectorAll("div > *");
  console.log(propertiesInputs);
  const inputsNeeded = addInputsProperties[elementValue];

  propertiesInputs.forEach((el) => {
    let isImageButton = el.id === "imageButton"
    let matchesPlaceholder = inputsNeeded.includes(el.placeholder)
    console.log(el.placeholder, inputsNeeded)
    console.log(matchesPlaceholder)
    console.log("---------------------------")

    let showElement = false

    if (isImageButton) {
      showElement = elementValue === "Image" 
    } else {
      showElement = matchesPlaceholder
    }

    if (!showElement) {
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

    if (compressed) {
      contentObj.path = compressed;
      compressed = "";
    }
    myPage.addElement(type, contentObj);
  });

  const exportPageButton = document.querySelector("#exportPageBtn");
  exportPageButton.addEventListener("click", async function () {
    let html = myPage.exportPageHTML(false);
    let zip = new JSZip();

    zip.file("index.html", html);
    zip.file("styles.css", cssContent);
    zip.file("script.js", jsContent);
    zip.file("data.json", JSON.stringify(myPage));

    myPage.getImages().forEach((image) => {
      zip.file(`images/${image.path.name}`, image.path);
    });

    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, "example.zip");
    });
  });

  let compressed;
  const fileButton = document.querySelector("#imageButton");
  const fileInput = document.querySelector("#imageInput");
  fileButton.addEventListener("click", () => {
    fileInput.addEventListener("change", (e) => {
      let file = e.target.files[0];
      if (file) {
        new Compressor(file, {
          quality: 0.8,
          maxWidth: 1400,
          maxHeight: 1400,
          checkOrientation: false,
          strict: false,
          convertSize: 0,
          mimeType: "image/jpeg",

          success(result) {
            console.log("Oud:", (file.size / 1024).toFixed(1), "KB");
            console.log("Nieuw:", (result.size / 1024).toFixed(1), "KB");

            compressed = result;
          },
          error(err) {
            console.error(err.message);
          },
        });
      }
    });
    fileInput.click();
  });
}
