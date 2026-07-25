export function fetchCache() {
  let cache = [];
  const keys = Object.keys(localStorage);

  keys.forEach((key) => {
    cache.push(JSON.parse(localStorage.getItem(key)));
  });

  return cache;
}