// CLASSES
import { Element } from "./models/Element.js";
import { Page } from "./models/Page.js";

// VARS
import { activePages } from "./managers/TabManager.js";

// FUNCS
import { fetchCache } from "./managers/StorageManager.js";
import { renderPreview, updateObjPreview } from "./ui/preview.js";
import { updateTabs } from "./ui/tabs.js";
import { setupInputFields, setupEventlisteners } from "./ui/inputs.js";

// LIBRARIES
import JSZip from "jszip";
import { saveAs } from "file-saver";

//////////////////////////////////////

export let myPage = new Page();

function init() {
  setupEventlisteners();
  updateObjPreview();
}

document.addEventListener("DOMContentLoaded", init);
