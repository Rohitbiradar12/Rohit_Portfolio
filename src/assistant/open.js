export function openAssistant(options = {}) {
  window.dispatchEvent(new CustomEvent("ask-rohit:open", { detail: options }));
}
