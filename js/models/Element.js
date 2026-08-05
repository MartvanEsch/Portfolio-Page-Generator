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
    let id = "";
    if (forPreview) {
      id = this.id;
    }

    if (this.type === "Header") {
      let el = document.createElement("h1");
      el.dataset.id = id;
      el.textContent = this.text;
      return el;
    }

    if (this.type === "Paragraph") {
      let el = document.createElement("p");
      el.dataset.id = id;
      el.textContent = this.text;
      return el;
    }
    
    if (this.type === "Caption") {
      let el = document.createElement("small");
      el.dataset.id = id;
      el.textContent = this.text;
      return el;
    }

    if (this.type === "Image") {
      let el = document.createElement("img");
      if (forPreview) {
        el.dataset.id = id;
        el.alt = this.alt;
        el.src = URL.createObjectURL(this.path);
        return el;
      } else {
        el.src = `images/${this.path.name}`
        el.alt = this.alt
        return el;
      }
    }

    if (this.type === "Video") {
      let el = document.querySelector("iframe")
      el.dataset.id = id
      el.src = this.path
      return el;
    }
  }
}
