export class Element {
  constructor(type, contentObj, id) {
    console.log(type, contentObj);

    this.id = id;
    this.type = type;

    this.text = contentObj.text;
    this.path = contentObj.path;
    this.alt = contentObj.alt;
    this.url = contentObj.url;
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
        console.log("for export")
        console.log(this)
        return `<img src="images/${this.path.name}" alt="${this.alt}">`
      }
    }
    if (this.type === "Video") {
      return `<iframe src="${this.path}"></iframe>`;
    }
    return ""; // Fallback
  }
}
