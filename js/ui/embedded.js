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
  el.addEventListener("mouseover", (e) => sendSignal(e, "highlight"));
  el.addEventListener("click", (e) => sendSignal(e, "delete"));
});
