let inputs = document.querySelector("#inputs");
let textInput = inputs.querySelector("#text input");
let createBtns = document.querySelectorAll(".createBtn");
let preset = {
  elements: [],
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
  if (e.code.includes("Digit") && e.code.slice(5, 6) <= createBtns.length && !inputs.classList.contains("show")) {
    e.preventDefault()
    handleButton(createBtns[e.code.slice(5, 6) - 1]);
  }

  // Add text to elements
  if (e.code === "Enter" && inputs.classList.contains("show")) {
    inputs.classList.remove("show");

    preset.elements.push({ type: current, content: textInput.value });

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

// Render preview html
let preview = document.querySelector("#preview");
function renderPreview() {
  preview.innerHTML = "";
  let div = document.createElement("div");
  for (let i = 0; i < preset.elements.length; i++) {
    let element = preset.elements[i];
    let el = document.createElement(element.type);
    el.textContent = element.content;
    div.append(el);
  }

  preview.append(div);
}
