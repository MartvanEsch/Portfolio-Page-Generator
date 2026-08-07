import { myPage } from "../app.js";

export function renderPreview() {
  let iframe = document.querySelectorAll("iframe");
  let html = myPage.exportPageHTML(true);

  iframe.forEach((frame) => {
    frame.srcdoc = html;
  });
}

export function updateObjPreview() {
  const preview = document.querySelector("#preview");
  let pre = preview.querySelector("#json-output");

  if (pre) {
    pre.textContent = JSON.stringify(myPage, null, 2);
  }
}

export function updateLayers() {
  let layersDiv = document.querySelector("#layers ul");

  if (myPage.elements === 0) {
    layersDiv.innerHTML = "";

    let li = document.createElement("li");
    li.textContent = "Empty";

    layersDiv.append(li);
  } else {
    layersDiv.innerHTML = "";

    myPage.elements.forEach((el, index) => {
      let li = document.createElement("li");
      li.dataset.id = el.id;

      let p = document.createElement("p");
      if (el.text) {
        p.textContent = el.text;
      } else {
        p.textContent = "Laag " + el.id;
      }

      let img = document.createElement("img");
      img.src = el.icon;

      li.append(img);
      li.append(p);

      let div = document.createElement("div");
      let deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", (e) => {
        myPage.deleteElement(index);
      });

      let div2 = document.createElement("div");
      let upButton = document.createElement("button");
      upButton.textContent = "Up";
      upButton.addEventListener("click", () => {
        myPage.moveElementUp(index);
      });

      let downButton = document.createElement("button");
      downButton.textContent = "Down";
      downButton.addEventListener("click", () => {
        myPage.moveElementDown(index);
      });
      div2.append(upButton);
      div2.append(downButton);

      div.append(div2);

      div.append(deleteButton);

      li.append(div);
      layersDiv.append(li);
    });
  }
}

export function updateProperties() {
  let nameInput = document.querySelector("#nameInput");
  nameInput.value = myPage.name;
}
