import {createElement, createItems} from "../utils";

const getMenuHtml = (menuName) => {
  return (`
    <a class="trip-tabs__btn" href="#">${menuName}</a>
  `);
};

const createMenuTemplate = (menuNames) => {
  return (`
    <nav class="trip-controls__trip-tabs  trip-tabs">
      ${createItems(menuNames, getMenuHtml)}
    </nav>
  `);
};

export default class Menu {
  constructor(menuNames) {
    this._menuNames = menuNames;
    this._element = null;
  }

  getTemplate() {
    return createMenuTemplate(this._menuNames);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
