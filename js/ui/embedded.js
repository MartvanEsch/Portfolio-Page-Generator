// 1. Gebruik een class (bijv. .portfolio-image) voor meerdere elementen
const images = document.querySelectorAll("#images > *")

function sendSignal(e) {
  // 2. e.currentTarget pakt altijd het element waar de listener op zit
  // 3. getAttribute met dubbel 't'
  const targetElement = e.currentTarget;

  const data = {
    id: targetElement.dataset.id || "",
    src: targetElement.src || "",
  };

  // Stuur alleen een schoon data-object
  window.parent.postMessage(data, "*");
}

// 4. Koppel de event listener expliciet aan 'el'
images.forEach((el) => {
  el.addEventListener("mouseover", (e) => sendSignal(e));
});
