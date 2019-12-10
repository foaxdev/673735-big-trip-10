import {capitalizeFirstLetter, createItems} from "../utils";
import AbstractComponent from "./abstract-component";
import {createElement} from "../utils/render";
import {sortOptions} from "../mock/sort";

export const SortType = {
  DEFAULT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

const getSortHtml = (sortName) => {
  const sortTitle = capitalizeFirstLetter(sortName);

  return (`
    <div class="trip-sort__item  trip-sort__item--${sortName}">
      <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortName}">
      <label class="trip-sort__btn" for="sort-${sortName}" data-sort-name="${sortName}">
        ${sortTitle}
        <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
          <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
        </svg>
      </label>
    </div>
  `);
};

const createSortTemplate = (sortItems) => {
  return (`
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${createItems(sortItems, getSortHtml)}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>
  `);
};

export default class Sort extends AbstractComponent {

  constructor(sortItems) {
    super();
    this._sortItems = sortItems;
    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate(this._sortItems);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName.toLowerCase() !== `label`) {
        return;
      }

      const sortType = evt.target.getAttribute(`data-sort-name`);
      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      handler(this._currentSortType);
      this.setSortItemChecked(evt.target.previousElementSibling);
    });
  }

  setSortItemChecked(sortItem) {
    const sortItems = this._element.querySelectorAll(`.trip-sort__input`);

    for (const sortItem of sortItems) {
      if (sortItem.hasAttribute(`checked`)) {
        sortItem.removeAttribute(`checked`);
        break;
      }
    }

    sortItem.setAttribute(`checked`, `checked`);
  }

  setEventSortActive() {
    const sortItems = this._element.querySelectorAll(`.trip-sort__input`);
    this.setSortItemChecked(sortItems[0]);
  }
}
