import cssContent from "../../project/styles.css?raw";
import jsContent from "../../project/project.js?raw";

// CLASSES
import { myPage } from "../app.js";

// FUNCS
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
  const inputsNeeded = addInputsProperties[elementValue];

  propertiesInputs.forEach((el) => {
    let isImageButton = el.id === "imageButton";
    let matchesPlaceholder = inputsNeeded.includes(el.placeholder);
    let showElement = isImageButton
      ? elementValue === "Image"
      : matchesPlaceholder;
    el.classList.toggle("hidden", !showElement);
  });

  properties.classList.remove("hidden");
}

export function setupEventlisteners() {
  let type = "";
  let compressed;

  const settingInputs = document.querySelectorAll("[data-prop]");
  settingInputs.forEach((input) => {
    input.addEventListener("input", (e) => handleSettingChange(e));
  });

  const selectElementInputs = document.querySelectorAll(".addInput");
  selectElementInputs.forEach((input) => {
    input.addEventListener("click", (e) => {
      type = handleSelectElement(e);
    });
  });

  const addElInput = document.querySelector("#addElInput");
  addElInput.addEventListener("click", () =>
    handleAddElement(compressed, type),
  );

  const exportPageButton = document.querySelector("#exportPageBtn");
  exportPageButton.addEventListener("click", () => handleExport());

  const importPageButton = document.querySelector("#importPageBtn");
  const zipInput = document.querySelector("#zipInput");
  importPageButton.addEventListener("click", () => {
    zipInput.addEventListener("change", async (e) => await handleImport(e));
    zipInput.click();
  });

  const fileButton = document.querySelector("#imageButton");
  const fileInput = document.querySelector("#imageInput");
  fileButton.addEventListener("click", () => {
    fileInput.addEventListener("change", async (e) => {
      compressed = await handleCompression(e);
    });
    fileInput.click();
  });

  let editButton = document.querySelector("#editBtn");
  let saveButton = document.querySelector("#saveBtn");
  editButton.addEventListener("click", (e) => toggleJsonPreview(true, e));
  saveButton.addEventListener("click", (e) => toggleJsonPreview(false, e));

  window.addEventListener("message", (e) => handleMessage(e));
}

function handleMessage(event) {
  if (!event.data) {
    return;
  }

  const ontvangenData = event.data;
  let receivedId = ontvangenData.id;

  if (ontvangenData.signal === "delete") {
    let index = myPage.elements.findIndex((el) => el.id === receivedId);
    myPage.deleteElement(index);
  }

  if (ontvangenData.signal === "highlight") {
    const layers = Array.from(document.querySelectorAll("#layers ul > *"));
    const targetLayer = layers.find((layer) => layer.dataset.id == receivedId);

    layers.forEach((layer) => layer.classList.remove("highlighted"));

    if (targetLayer) {
      targetLayer.classList.add("highlighted");
    } else {
      console.log("Layer not found");
    }
  }
}

function toggleJsonPreview(isEditing, event) {
  let editButton = document.querySelector("#editBtn");
  let saveButton = document.querySelector("#saveBtn");
  let jsonOutput = document.querySelector("#json-output");
  let textArea = document.querySelector("#jsonTextArea");

  editButton.classList.toggle("hidden", isEditing);
  saveButton.classList.toggle("hidden", !isEditing);
  jsonOutput.classList.toggle("hidden", isEditing);
  textArea.classList.toggle("hidden", !isEditing);

  event.target.classList.add("hidden");

  if (isEditing) {
    textArea.innerHTML = jsonOutput.textContent;
    const aantalRegels = jsonOutput.textContent.split("\n").length;
    textArea.setAttribute("rows", aantalRegels);
    textArea.focus();
  } else {
    myPage.loadNewPage(JSON.parse(textArea.value));
  }
}

function handleCompression(e) {
  const addElInput = document.querySelector("#addElInput");
  addElInput.classList.add("hidden");

  let file = e.target.files[0];

  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }

    new Compressor(file, {
      quality: 0.8,
      maxWidth: 1400,
      maxHeight: 1400,
      checkOrientation: false,
      strict: false,
      convertSize: 0,
      mimeType: "image/jpeg",

      success(result) {
        addElInput.classList.remove("hidden");
        resolve(result);
      },
      error(err) {
        console.error(err.message);
        reject(err);
      },
    });
  });
}

async function handleExport() {
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
    saveAs(content, "page.zip");
  });
}

async function handleImport(e) {
  let file = e.target.files[0];

  try {
    const zip = await JSZip.loadAsync(file);
    const jsonFile = zip.file("data.json");

    if (jsonFile) {
      const jsonContent = await jsonFile.async("string");
      const pageData = JSON.parse(jsonContent);
      await myPage.loadNewPage(pageData, zip);
    }
  } catch (error) {
    console.log(error);
  }
}

function handleAddElement(compressedFile, inputType) {
  const propertiesInputs = Array.from(
    properties.querySelectorAll(`#properties input[type="text"]`),
  );
  let contentObj = {};

  propertiesInputs
    .filter((el) => !el.classList.contains("hidden"))
    .forEach((el) => {
      const key = el.placeholder.toLowerCase();
      contentObj[key] = el.value;
    });

  if (compressedFile) {
    contentObj.path = compressedFile;
  }

  myPage.addElement(inputType, contentObj);
}

function handleSelectElement(e) {
  let type = e.target.value;
  setupInputFields(type);
  addElInput.classList.remove("hidden");

  return type;
}

function handleSettingChange(e) {
  let property = e.target.dataset.prop;
  let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
  myPage.updateObject(property, value);
}
