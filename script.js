let pageObject = {
  name: "",
  elements: [],
  category: "branding",
  new: false,
};

function init() {
  let type = "";

  const inputs = document.querySelectorAll("[data-prop]");
  const addInputs = document.querySelectorAll(".addInput");
  const addElInput = document.querySelector("#addElInput");
  console.log(addElInput);

  inputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      let property = e.target.dataset.prop;
      let value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      updateObject(property, value);
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
    addElement(type);
  });

  updateObjPreview();
}

function setupInputFields(elementValue) {
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
  const propertiesInputs = properties.querySelectorAll(`input[type="text"]`);
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

function updateObject(property, value) {
  pageObject[property] = value;
  console.log(pageObject);
  updateObjPreview();
  renderPreview();
}

function updateObjPreview() {
  const preview = document.querySelector("#preview");
  // We zoeken nu naar ons pre-element
  let pre = preview.querySelector("#json-output");

  if (pre) {
    // De 'null' is voor een optionele filter-functie (niet nodig nu)
    // De '2' zorgt voor de mooie VS Code-achtige inspringing met 2 spaties
    pre.textContent = JSON.stringify(pageObject, null, 2);
  }
}
function addElement(type) {
  console.log("adding input");

  const propertieInputs = Array.from(
    document
      .querySelector(`#properties`)
      .querySelectorAll(`input[type="text"]`),
  );

  let contentObj = {};

  propertieInputs
    .filter((el) => !el.classList.contains("hidden"))
    .forEach((el) => {
      const key = el.placeholder.toLowerCase();
      contentObj[key] = el.value;
    });

  console.log(contentObj);

  let elements = pageObject.elements;

  elements.push(new Element(type, contentObj));

  updateObject("elements", elements);
}

function renderPreview() {
  console.log("rendering preview");

  const preview = document.querySelector("#preview div");

  preview.innerHTML = "";

  pageObject.elements.forEach((el) => {
    if (el.type === "Header") {
      let h1 = document.createElement("h1");
      h1.textContent = el.text;
      preview.append(h1);
    }

    if (el.type === "Subheader") {
      let h2 = document.createElement("h2");
      h2.textContent = el.text;
      preview.append(h2);
    }

    if (el.type === "Paragraph") {
      let p = document.createElement("p");
      p.textContent = el.text;
      preview.append(p);
    }

    if (el.type === "Image") {
      let img = document.createElement("img");
      img.src = "Placeholder.png";
      preview.append(img);
    }

    if (el.type === "Video") {
      let img = document.createElement("img");
      img.src = "Video.png";
      preview.append(img);
    }
  });
}

class Element {
  constructor(type, contentObj) {
    this.id = pageObject.elements.length + 1;
    this.type = type;

    this.text = contentObj.text;
    this.path = contentObj.path;
    this.alt = contentObj.alt;
    this.url = contentObj.url;

    console.log(this);
  }
}

document.addEventListener("DOMContentLoaded", init);
