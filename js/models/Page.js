// CLASSES
import { Element } from "./Element.js";

// VARS
import { activePages } from "../managers/TabManager.js";

// FUNCS
import {
  updateProperties,
  updateObjPreview,
  renderPreview,
  updateLayers,
} from "../ui/preview.js";
import { updateTabs } from "../ui/tabs.js";

// LIBS
import { Octokit } from "octokit";

///////////////////////

let octokit = new Octokit();

export class Page {
  constructor() {
    ((this.name = ""),
      (this.elements = []),
      (this.new = false),
      (this.category = "branding"),
      (this.path = ""));

    this.setVersion();
  }

  async setVersion() {
    try {
      const { data } = await octokit.rest.repos.listCommits({
        owner: "MartvanEsch",
        repo: "Portfolio-Page-Generator",
        per_page: 1,
      });

      const { commit } = data[0];

      let version = commit.message.split("\n\n")[0];
      let url = data[0].html_url;

      this.release = { version: version, url: url };

      console.log(this);
    } catch (error) {
      console.error("Kon laatste push niet ophalen:", error);
    }
  }

  updateObject(property, value) {
    if (property !== undefined) {
      this[property] = value;
    }

    this.refresh();
  }

  addElement(type, contentObj) {
    const newElement = new Element(type, contentObj, this.elements.length + 1);
    console.log(newElement);
    this.elements.push(newElement);

    this.refresh();
  }

  async loadNewPage(page, files) {
    activePages.push(this);
    Object.assign(this, page);

    this.elements = await Promise.all(
      page.elements.map(async (el) => {
        let element = new Element(el.type, el, el.id, files);

        if (el.type === "Image" && files) {
          await element.setImage(files);
        }
        return element;
      }),
    );

    this.refresh();
  }

  moveElementUp(index) {
    if (!this.elements[index - 1]) {
      return;
    }

    let temp = this.elements[index];
    this.elements[index] = this.elements[index - 1];
    this.elements[index - 1] = temp;

    this.refresh();
  }

  moveElementDown(index) {
    if (!this.elements[index + 1]) {
      return;
    }

    let temp = this.elements[index];
    this.elements[index] = this.elements[index + 1];
    this.elements[index + 1] = temp;

    this.refresh();
  }

  deleteElement(index) {
    console.log("Deleting element with index: ", index);

    this.elements.splice(index, 1);
    this.elements.forEach((el, idx) => (el.id = idx + 1));
    this.updateObject();

    this.refresh();
  }

  getImages() {
    let imageElements = this.elements.filter((el) => el.type === "Image");
    return imageElements;
  }

  exportPageHTML(forPreview) {
    // 1. Genereer eerst de HTML-string voor alle elementen in de array
    const elementsHTML = this.elements
      .map((el) => el.toHTML(forPreview))
      .join(""); // Plak alle element-strings aan elkaar

    // 2. Stop die string direct op de juiste plek (#images) in het template
    let html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mart van Esch - Portfolio</title>
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
${forPreview ? '<script src="/js/ui/embedded.js" defer></script>' : ""}
    <link rel="stylesheet" href="${forPreview ? "project/styles.css" : "styles.css"}"/>
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
          <div id="images">
            ${elementsHTML}
          </div>
        </div>
      </section>
    </main>
  </body>
</html>`;

    // 3. Geef de complete HTML-string terug
    return html;
  }

  refresh() {
    updateObjPreview();
    renderPreview();
    updateLayers();
    updateProperties();
    updateTabs();
  }
}
