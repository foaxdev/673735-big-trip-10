import {createItems} from "../utils";
import AbstractComponent from "./abstract-component";
import {createElement} from "../utils/render";

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

export default class Menu extends AbstractComponent {

  constructor(menuNames) {
    super();
    this._menuNames = menuNames;
  }

  getTemplate() {
    return createMenuTemplate(this._menuNames);
  }
}
