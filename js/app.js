// CLASSES
import { Page } from "./models/Page.js";

// FUNCS
import { updateObjPreview } from "./ui/preview.js";
import { setupEventlisteners } from "./ui/inputs.js";

//////////////////////////////////////

export let myPage = new Page();

function init() {
  setupEventlisteners();
  updateObjPreview();
}

document.addEventListener("DOMContentLoaded", init);
