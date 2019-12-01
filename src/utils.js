export const capitalizeFirstLetter = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const createItems = (elementsData, getHtml) => {
  const container = document.createDocumentFragment();
  container.innerHTML = ``;

  for (const elementData of elementsData) {
    container.innerHTML += getHtml(elementData);
  }

  return container.innerHTML;
};
