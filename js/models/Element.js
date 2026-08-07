import { file } from "jszip";

export class Element {
  constructor(type, contentObj, id, files) {
    console.log(type, contentObj);

    this.id = id;
    this.type = type;

    this.text = contentObj.text;
    this.alt = contentObj.alt;
    this.url = contentObj.url;

    this.icon = `../../img/${type}.svg`;

    if (type === "Image") {
      this.initImage(contentObj, files);
    } else {
      this.path = contentObj.path;
    }
  }

  initImage(contentObj, files) {
    this.imageFileName = contentObj.imageFileName;

    this.imageFileName =
      contentObj.imageFileName ||
      contentObj.path?.name ||
      (typeof contentObj.path === "string" ? contentObj.path : undefined);

    if (contentObj.path instanceof Blob) {
      this.path = contentObj.path;
    } else if (files) {
      this.setImage(files);
    } else {
      this.path = contentObj.path;
    }
  }

  async setImage(files) {
    if (!this.imageFileName) {
      console.error("No file name found for", this);
      return;
    }

    let file = files.file("images/" + this.imageFileName);
    if (file) {
      let blob = await file.async("blob");
      this.path = new File([blob], this.imageFileName, { type: blob.type });
    } else {
      console.error(`Image images/${this.imageFileName} not found in ZIP`);
    }
  }

  toHTML(forPreview) {
    let el;
    if (this.type === "Header") {
      el = document.createElement("h1");
      el.textContent = this.text;
    }

    if (this.type === "Paragraph") {
      el = document.createElement("p");
      el.textContent = this.text;
    }

    if (this.type === "Caption") {
      el = document.createElement("small");
      el.textContent = this.text;
    }

    if (this.type === "Image") {
      el = document.createElement("img");
      if (forPreview) {
        el.alt = this.alt;
        el.src = URL.createObjectURL(this.path);
      } else {
        el.src = `images/${this.path.name}`;
        el.alt = this.alt;
      }
    }

    if (this.type === "Video") {
      el = document.querySelector("iframe");
      el.dataset.id = id;
      el.src = this.path;
    }

    if (forPreview) {
      el.dataset.id = this.id;
    }

    if (this.selected) {
      el.classList.add("highlighted")
    }

    return el.outerHTML;
  }
}
