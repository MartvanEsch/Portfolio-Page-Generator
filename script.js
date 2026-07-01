class Page {
  constructor() {
    ((this.name = ""),
      (this.elements = []),
      (this.new = false),
      (this.category = "branding"),
      (this.path = ""));
  }

  updateObject(property, value) {
    if (property !== undefined) {
      this[property] = value;
    }

    updateObjPreview();
    renderPreview();
  }

  addElement(type, contentObj) {
    const newElement = new Element(type, contentObj, this.elements.length + 1);
    this.elements.push(newElement);

    updateObjPreview();
    renderPreview();
  }

  loadNewPage(page) {
    console.log(page);
    Object.assign(this, page);

    this.elements = page.elements.map((el) => {
      return new Element(el.type, el, el.id);
    });
    renderPreview();
    updateObjPreview();
  }

  moveElementUp(index) {
    let temp = this.elements[index];
    this.elements[index] = this.elements[index - 1];
    this.elements[index - 1] = temp;

    this.updateObject();
  }

  moveElementDown(index) {
    let temp = this.elements[index];
    this.elements[index] = this.elements[index + 1];
    this.elements[index + 1] = temp;

    this.updateObject();
  }

  deleteElement(index) {
    this.elements.splice(index, 1);
    this.elements.forEach((el, idx) => (el.id = idx + 1));
    this.updateObject();
  }

  exportPageHTML() {
    let elementsHTML = this.elements.map((el) => el.toHTML()).join("\n");
    console.log(elementsHTML);

    let html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="project.js" defer></script>
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
    <script type="importmap">
      {
        "imports": {
          "@material/web/": "https://esm.run/@material/web/"
        }
      }
    </script>
    <script type="module">
      import "@material/web/all.js";
      import { styles as typescaleStyles } from "@material/web/typography/md-typescale-styles.js";
      document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&family=Funnel+Display:wght@300..800&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="styles.css" />
    <title>Mart van Esch - Portfolio</title>
    <meta
      name="description"
      content="Projectpagina voor het portfolio van Mart van Esch, een student Communicatie en Multimedia Design die websites, branding, fotografie, animaties en installaties ontwerpt en maakt."
    />
    <meta
      name="keywords"
      content="portfolio, webdesign, branding, fotografie, animatie, installaties, Mart van Esch, communicatie"
    />
    <meta name="robots" content="index, follow" />
  </head>
  <body id="project" class="flex align-center">
    <main class="flex top">
      <section id="description" class="flex column gap-big align-center">
        <div class="flex gap column align-center">
          <div class="flex gap-big align-center space-between">
            <div class="flex gap align-center space-between">
              <a>
                <svg
                  class="icon"
                  width="19"
                  height="30"
                  viewBox="0 0 19 30"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.4054 30L0 15L15.4054 0L19 3.5L7.18919 15L19 26.5L15.4054 30Z"
                  />
                </svg>
              </a>
              <h1></h1>
              <a>
                <svg
                  class="icon"
                  width="18"
                  height="30"
                  viewBox="0 0 18 30"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.1892 15L0 3.5L3.40541 0L18 15L3.40541 30L0 26.5L11.1892 15Z"
                  />
                </svg>
              </a>
            </div>
            <a href="index.html">
              <svg
                class="icon"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 30L0 27L12 15L0 3L3 0L15 12L27 0L30 3L18 15L30 27L27 30L15 18L3 30Z"
                />
              </svg>
            </a>
          </div>
          <div id="images">${elementsHTML}</div>
        </div>
      </section>
    </main>
  </body>
</html>
`;

    return html;
  }
}

let myPage = new Page();

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
    let html = myPage.exportPageHTML()
    let blob = new Blob([html], {type: "text/html"})

    let url = URL.createObjectURL(blob)

    let a = document.createElement("a")
    a.href = url
    a.download = myPage.name

    a.click()
    URL.revokeObjectURL(a)
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

function updateObjPreview() {
  const preview = document.querySelector("#preview");
  let pre = preview.querySelector("#json-output");

  if (pre) {
    pre.textContent = JSON.stringify(myPage, null, 2);
  }
}

function renderPreview() {
  console.log("rendering preview");

  const preview = document.querySelector("#preview div");

  preview.innerHTML = "";

  myPage.elements.forEach((el, index) => {
    console.log(el);

    let div = document.createElement("div");

    let htmlEl;
    if (el.type === "Header") {
      htmlEl = document.createElement("h1");
      htmlEl.textContent = el.text;
    }

    if (el.type === "Subheader") {
      htmlEl = document.createElement("h2");
      htmlEl.textContent = el.text;
    }

    if (el.type === "Paragraph") {
      htmlEl = document.createElement("p");
      htmlEl.textContent = el.text;
    }

    if (el.type === "Caption") {
      htmlEl = document.createElement("p");
      htmlEl.textContent = el.text;
    }

    if (el.type === "Image") {
      htmlEl = document.createElement("img");
      htmlEl.src = "Placeholder.png";
    }

    if (el.type === "Video") {
      htmlEl = document.createElement("img");
      htmlEl.src = "Video.png";
    }

    div.append(htmlEl);

    let div2 = document.createElement("div");
    div2.classList.add("buttons");

    let upButton = document.createElement("button");
    upButton.textContent = "Up";

    upButton.addEventListener("click", () => {
      console.log("moving element " + el.id + "up");

      myPage.moveElementUp(index);
    });
    div2.append(upButton);

    let downButton = document.createElement("button");
    downButton.textContent = "Down";

    downButton.addEventListener("click", () => {
      console.log("moving element " + el.id + "down");
      myPage.moveElementDown(index);
    });
    div2.append(downButton);

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      myPage.deleteElement(index);
    });

    div.append(div2);
    div.append(deleteButton);

    preview.append(div);
  });
}

function fetchCache() {
  let cache = [];
  const keys = Object.keys(localStorage);

  keys.forEach((key) => {
    cache.push(JSON.parse(localStorage.getItem(key)));
  });

  return cache;
}

class Element {
  constructor(type, contentObj, id) {
    console.log(type, contentObj);

    this.id = id;
    this.type = type;

    this.text = contentObj.text;
    this.path = contentObj.path;
    this.alt = contentObj.alt;
    this.url = contentObj.url;
  }

  toHTML() {
    if (this.type === "Header") {
      return `<h1>${this.text}</h1>`;
    }
    if (this.type === "Subheader") {
      return `<h2>${this.text}</h2>`;
    }
    if (this.type === "Paragraph") {
      return `<p>${this.text}</p>`;
    }
    if (this.type === "Caption") {
      return `<small>${this.text}</small>`;
    }
    if (this.type === "Image") {
      return `<img src="${this.path || "Placeholder.png"}" alt="${this.alt}">`;
    }
    if (this.type === "Video") {
      return `<iframe src="${this.path}"></iframe>`;
    }
    return ""; // Fallback
  }
}

document.addEventListener("DOMContentLoaded", init);
