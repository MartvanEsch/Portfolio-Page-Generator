// CLASSES
import { Element } from "./Element.js";

// VARS
import { activePages } from "../managers/TabManager.js";

// FUNCS
import { updateObjPreview, renderPreview } from "../ui/preview.js";
import { updateTabs } from "../ui/tabs.js";

export class Page {
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
    activePages.push(this);
    console.log(page);
    Object.assign(this, page);

    this.elements = page.elements.map((el) => {
      return new Element(el.type, el, el.id);
    });

    renderPreview();
    updateObjPreview();
    updateTabs();
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

  getImages() {
    let imageElements = this.elements.filter((el) => el.type === "Image");
    return imageElements;
  }

  exportPageHTML(forPreview) {
    let elementsHTML = this.elements
      .map((el) => el.toHTML(forPreview))
      .join("\n");
    console.log(elementsHTML);

    let html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
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
    <link rel="stylesheet" href="${forPreview ? "project/styles.css" : "styles.css"}"/>
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
