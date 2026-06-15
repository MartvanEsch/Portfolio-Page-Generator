let inputs = document.querySelector("#inputs");
let textInput = inputs.querySelector("#text input");
let pathInput = inputs.querySelector("#settings input")
let createBtns = document.querySelectorAll(".createBtn");
let preset = {
  elements: [],
  new: true,
  category: "",
  name: "",
};
let current;

// Handle clicks
document.addEventListener("click", (e) => {
  let btn = e.target;
  handleButton(btn);
});

// Handle keypresses
document.addEventListener("keypress", (e) => {
  // Button selecting
  if (
    e.code.includes("Digit") &&
    e.code.slice(5, 6) <= createBtns.length &&
    !inputs.classList.contains("show")
  ) {
    e.preventDefault();
    handleButton(createBtns[e.code.slice(5, 6) - 1]);
  }

  // Add text to elements
  if (e.code === "Enter" && inputs.classList.contains("show")) {
    inputs.classList.remove("show");

    preset.elements.push({ type: current, content: textInput.value, path: pathInput.value });

    renderPreview();
  }
});

// Handle button activating
function handleButton(btn) {
  if (!btn.classList.contains("createBtn")) {
    return;
  }

  current = btn.dataset.type;
  inputs.classList.add("show");
  textInput.value = "";
  textInput.focus();
}

let nameInput = document.querySelector("#name");
nameInput.addEventListener("change", () => {
  preset.name = nameInput.value;
  renderPreview()
});
let catsInput = document.querySelector("#cats")
catsInput.addEventListener("change", (e) => {
  preset.category = e.target.value
  renderPreview()
})

// Render preview html
let previewButton = document.querySelector("#previewLink");
let preview = document.querySelector("#preview");
function renderPreview() {
  preview.innerHTML = "";
  let div = document.createElement("div");
  let p = document.createElement("p");
  p.innerHTML = JSON.stringify(preset);
  div.append(p);

  for (let i = 0; i < preset.elements.length; i++) {
    let element = preset.elements[i];
    let el = document.createElement(element.type);
    el.textContent = element.content;
    div.append(el);
  }

  const presetTekst = JSON.stringify(preset);
  previewButton.href = "project.html#" + encodeURIComponent(presetTekst);
  preview.append(div);
}

renderPreview();
