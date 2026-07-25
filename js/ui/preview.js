import { myPage } from "../app.js";

export function renderPreview() {
  console.log("rendering preview");

  const preview = document.querySelector("#preview #html-output");

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

  let iframe = document.querySelector("iframe")

  console.log(myPage.getImages())
  iframe.srcdoc = myPage.exportPageHTML(true)
}

export function updateObjPreview() {
  const preview = document.querySelector("#preview");
  let pre = preview.querySelector("#json-output");

  if (pre) {
    pre.textContent = JSON.stringify(myPage, null, 2);
  }
}
