function print(data) {
  const evt = new CustomEvent("print_event", {
    detail: data,
  });
  window.dispatchEvent(evt);
}
function input() {
  window.addEventListener("input_event", (evt) => {});
}
