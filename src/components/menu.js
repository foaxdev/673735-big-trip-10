import AbstractComponent from "./abstract-component";
import {createItems} from "../utils/render";

const MENU_NAMES = [`Table`, `Stats`];

const getMenuHtml = (menuName) => {
  return (`
    <a class="trip-tabs__btn" data-name="${menuName}" href="#">${menuName}</a>
  `);
};

const createMenuTemplate = () => {
  return (`
    <nav class="trip-controls__trip-tabs  trip-tabs">
      ${createItems(MENU_NAMES, getMenuHtml)}
    </nav>
  `);
};

export default class Menu extends AbstractComponent {

  constructor() {
    super();

    this._menuTable = this.getElement().querySelector(`[data-name="Table"]`);
    this._menuStats = this.getElement().querySelector(`[data-name="Stats"]`);

    this.setMenuItemActive(this._menuTable);
  }

  getTemplate() {
    return createMenuTemplate();
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

  setClickListenersToMenuTableItem(handler) {
    this._menuTable.addEventListener(`click`, handler);
  }

  setClickListenersToMenuStatsItem(handler) {
    this._menuStats.addEventListener(`click`, handler);
  }
}
