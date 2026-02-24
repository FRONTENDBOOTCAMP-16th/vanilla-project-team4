export function createElement(tag, classNames = [], attrs = null, text = '') {
  const element = document.createElement(tag);

  if (Array.isArray(classNames) && classNames.length) {
    element.classList.add(...classNames);
  }

  if (typeof attrs === 'object' && attrs) {
    for (const key in attrs) {
      element.setAttribute(key, attrs[key]);
    }
  }

  element.textContent = text;

  return element;
}
