export function element(event: any): HTMLElement | null {
  return event.srcElement || event.target;
}

export function clickInsideElement(event: any, className: string): HTMLElement | null {
  let el = element(event);

  if (el) {
    if (el.classList && el.classList.contains(className) ) {
      return el;
    } else {
      while (el = el.parentNode as HTMLElement | null) {
        if (el.classList && el.classList.contains(className)) {
          return el;
        }
      }
    }
  }

  return null;
}