import {RenderPosition} from "./const";

export const capitalizeFirstLetter = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const leftPad = (str, padString, targetLength) => {
  return str.toString().padStart(targetLength, padString);
};

export const createItems = (elementsData, getHtml) => {
  const container = document.createDocumentFragment();
  container.innerHTML = ``;

  for (const elementData of elementsData) {
    container.innerHTML += getHtml(elementData);
  }

  return container.innerHTML;
};

export const millisecondsToHm = (timeInMs) => {
  const hours = Math.floor(timeInMs / 3600000);
  const minutes = Math.floor(timeInMs % 3600000 / 60);

  return `${hours}H ${minutes}M`;
};

export const formatDate = (date, isLong) => {
  const dateYear = date.getFullYear();
  const dateMonth = leftPad(date.getMonth() + 1, `0`, 2);
  const dateDay = leftPad(date.getDate(), `0`, 2);

  return isLong ? `${dateYear}-${dateMonth}-${dateDay}` : `${dateDay}/${dateMonth}/${dateYear.toString().slice(-2)}`
};

export const formatTime = (hours, minutes) => {
  return `${hours}:${leftPad(minutes, `0`, 2)}`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild.nextSibling;
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTEREND:
      container.parentNode.insertBefore(element, container.nextSibling);
  }
};
