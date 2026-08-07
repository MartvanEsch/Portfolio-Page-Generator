// 1. Gebruik een class (bijv. .portfolio-image) voor meerdere elementen
const images = document.querySelectorAll("#images > *");

function sendSignal(e, signal) {
  const targetElement = e.currentTarget;

  const data = {
    id: Number(targetElement.dataset.id) || "",
    src: targetElement.src || "",
    signal: signal,
  };

  window.parent.postMessage(data, "*");
}

images.forEach((el) => {
  el.addEventListener("click", (e) => sendSignal(e, "select"));
});


document.addEventListener("click", (e) => {
  const targetElement = e.target.closest("[data-id]");
  if (!targetElement) return;

  const data = {
    id: Number(targetElement.dataset.id) || targetElement.dataset.id,
    src: targetElement.src || "",
    signal: "select",
  };

  window.parent.postMessage(data, "*");
});

