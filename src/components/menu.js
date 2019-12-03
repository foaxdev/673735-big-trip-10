import {createItems} from "../utils";

const getMenuHtml = (menuName) => {
  return (`
    <a class="trip-tabs__btn" href="#">${menuName}</a>
  `);
};

export const createMenuTemplate = (menuNames) => {
  return (`
    <nav class="trip-controls__trip-tabs  trip-tabs">
      ${createItems(menuNames, getMenuHtml)}
    </nav>
  `);
};
