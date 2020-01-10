import AbstractComponent from "./abstract-component";
import {createItems} from "../utils/render";

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

    this.setMenuItemActive(this.getElement().querySelectorAll(`.trip-tabs__btn`)[1]);
  }

  getTemplate() {
    return createMenuTemplate(this._menuNames);
  }

  setMenuItemActive(menuElement) {
    const menuItems = this.getElement().querySelectorAll(`.trip-tabs__btn`);

    for (const menuItem of menuItems) {
      if (menuItem.classList.contains(`trip-tabs__btn--active`)) {
        menuItem.classList.remove(`trip-tabs__btn--active`);
        break;
      }
    }

    menuElement.classList.add(`trip-tabs__btn--active`);
  }
}
