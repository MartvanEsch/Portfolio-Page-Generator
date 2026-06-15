function getProject() {
  let hash = decodeURIComponent(window.location.hash.substring(1));
  if (hash) {
    let parsedHash = JSON.parse(hash);
    return parsedHash;
  }
}

function renderNewProject(project) {
  let h1 = document.querySelector("h1")
  h1.textContent = project.name
  console.log(project);

  let div = document.querySelector("#description div");
  let divChildren = div.children;

  for (let i = divChildren.length - 1; i >= 2; i--) {
    divChildren[i].remove();
  }

  project.elements.forEach((element) => {
    let htmlEl = document.createElement(element.type);
    htmlEl.textContent = element.content;
    console.log(htmlEl);

    if (element.type === "img") {
      let src =
        "img/" + project.category + "/" + project.name + "/" + element.path;
      htmlEl.src = src;

      let images = document.createElement("div")
      images.id = "images"
      images.append(htmlEl)
      htmlEl = images
    }

    div.append(htmlEl);
  });
}

function router() {
  let project = getProject();
  if (project.new) {
    console.log("-NEW PROJECT-");
    renderNewProject(project);
  }
}

router();
/*

for (let i = 0; i < contentArr.length; i++) {
  let currentProject = contentArr[i];

  if (projectKey === currentProject.key) {
    // Als de key van het project die van de url is
    document.querySelector("h1").innerHTML = currentProject.header;
    document.querySelector("p").innerHTML = currentProject.body;

    const target = document.querySelector(
      "#description > div > p:nth-child(3)",
    );

    if (target && Array.isArray(currentProject.html)) {
      currentProject.html.forEach((fn) => {
        const element = fn(); // functie uitvoeren → DOM node krijgen
        target.after(element);
      });
    }

    let links = document.querySelectorAll("a");
    const isLastProject = i === contentArr.length - 1;
    const isFirstProject = i === 0;
    if (isLastProject) {
      links[1].style.display = "none";
      console.log("last project");
    } else {
      links[1].href = `project.html#${contentArr[i + 1].key}`;
    }
    if (isFirstProject) {
      links[0].style.display = "none";
      console.log("first project");
    } else {
      links[0].href = `project.html#${contentArr[i - 1].key}`;
    }

    currentProject.imgArray.forEach((image) => {
      let imgElement = document.createElement("img");
      imgElement.src = currentProject.path + image;
      document.querySelector("#images").append(imgElement);
    });
  }
}

// Loads the right settings from the query params
let params = new URLSearchParams(window.location.search);
let settingsButtons = document.querySelectorAll("#settings md-switch");
let settings = {};
if (params) {
  settings = {
    dutch: params.get("dutch") === "true",
    light: params.get("light") === "true",
  };
} else {
  settings = {
    dutch: settingsButtons[0].selected,
    light: settingsButtons[1].selected,
  };
}
updateSettings(settings); // Update the color mode
updateButtons(settingsButtons, settings); // Update the state of the buttons

// Updates the settings object
settingsButtons.forEach((button) => {
  button.addEventListener("change", () => {
    settings.dutch = settingsButtons[0].selected;
    settings.light = settingsButtons[1].selected;
    updateSettings(settings);
  });
});

// Apply the settings to the page
function updateSettings(settings) {
  if (settings.light === true) {
    // Enable light mode
    document.documentElement.setAttribute("data-mode", "light");
  } else {
    document.documentElement.removeAttribute("data-mode");
  }

  let searchParams = new URLSearchParams();
  searchParams.set("light", settings.light);
  searchParams.set("dutch", settings.dutch);
  updateLinks(searchParams);
}

// Updates the state of the buttons based on the settings object
function updateButtons(settingsButtons, settings) {
  settingsButtons.forEach((button, index) => {
    if (index === 0) {
      button.selected = settings.dutch;
    } else if (index === 1) {
      button.selected = settings.light;
    }
  });
}

// Updates the links in the page based on the settings object
function updateLinks(searchParams) {
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    const url = new URL(link.href, window.location.origin);
    url.search = searchParams.toString();
    link.href = url.toString();
  });
}

// Reloads the content when the hash in the URL changes
window.addEventListener("hashchange", () => {
  location.reload();
});
*/
