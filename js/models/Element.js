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
      if (forPreview) {
        return `<img src="${URL.createObjectURL(this.path)}" alt="${this.alt}">`;
      } else {
        console.log("for export");
        console.log(this);
        return `<img src="images/${this.path.name}" alt="${this.alt}">`;
      }
    }
    if (this.type === "Video") {
      return `<iframe src="${this.path}"></iframe>`;
    }
    return ""; // Fallback
  }
}
