import { myPage } from "../app.js";

export function renderPreview() {
  let iframe = document.querySelector("iframe");

  console.log(myPage.getImages());
  iframe.srcdoc = myPage.exportPageHTML(true);
}

export function updateObjPreview() {
  const preview = document.querySelector("#preview");
  let pre = preview.querySelector("#json-output");

  if (pre) {
    pre.textContent = JSON.stringify(myPage, null, 2);
  }
}

export function updateLayers() {
  console.log(myPage);

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
      
      let p = document.createElement("p")
      p.textContent = el.text

  
      let img = document.createElement("img")
      img.src = el.icon

      li.append(img)
      li.append(p)

      let div = document.createElement("div")
      let deleteButton = document.createElement("button")
      deleteButton.textContent = "Delete"
      deleteButton.addEventListener("click", (e) => {
        myPage.deleteElement(index)
      })

      let div2 = document.createElement("div")
      let upButton = document.createElement("button")
      upButton.textContent = "Up"
      upButton.addEventListener("click", () => {
        myPage.moveElementUp(index)
      })

      let downButton = document.createElement("button")
      downButton.textContent = "Down"
      downButton.addEventListener("click", () => {
        myPage.moveElementDown(index)
      })
      div2.append(upButton)
      div2.append(downButton)

      div.append(div2)

      div.append(deleteButton)

      li.append(div)
      layersDiv.append(li);
    });
  }
  console.log(layersDiv);
}

export function updateProperties() {
  console.log("setting name")
  let nameInput = document.querySelector("#nameInput")
  nameInput.value = myPage.name
}