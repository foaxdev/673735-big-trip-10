const SHAKE_ANIMATION_TIMEOUT = 600;

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  AFTEREND: `afterend`,
  BEFOREBEGIN: `beforebegin`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild.nextSibling;
};

export const render = (container, component, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(component.element);
      break;
    case RenderPosition.AFTEREND:
      container.parentNode.insertBefore(component.element, container.nextSibling);
      break;
    default:
      container.append(component.element);
      break;
  }
};

export const remove = (component) => {
  component.element.remove();
  component.removeElement();
};

export const replace = (newComponent, oldComponent) => {
  const oldElement = oldComponent.element;
  const parentElement = oldElement.parentElement;
  const newElement = newComponent.element;

  const isExistElements = Boolean(parentElement && newElement && oldElement);

  if (isExistElements && parentElement.contains(oldElement)) {
    parentElement.replaceChild(newElement, oldElement);
  }
};

export const createItems = (elementsData, getHtml) => {
  const container = document.createDocumentFragment();
  container.innerHTML = ``;

  for (const elementData of elementsData) {
    container.innerHTML += getHtml(elementData);
  }

  return container.innerHTML;
};

export const shake = (component, isEditCard) => {
  component.element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

  setTimeout(() => {
    component.element.style.animation = ``;

    component.changeSaveButtonTitle(`Save`);
    if (isEditCard) {
      component.changeButtonDeleteTitle(`Delete`);
    }
    component.unblockForm();
  }, SHAKE_ANIMATION_TIMEOUT);
};
