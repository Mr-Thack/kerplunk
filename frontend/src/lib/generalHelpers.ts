export function removeClass(styleClass: string) {
  // Remove a Style Class from the Document
  document.documentElement.classList.remove(styleClass);
}

export function addClass(styleClass: string) {
  // Add a Style Class to the Document
  document.documentElement.classList.add(styleClass);
}

export function isClass(styleClass: string) {
  // Check if a style class is currently in use
  return document.documentElement.classList.contains(styleClass);
}
