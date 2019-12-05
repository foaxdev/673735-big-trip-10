import {capitalizeFirstLetter, createElement, createItems} from "../utils";

const getFilterHtml = (filter) => {
  const filterName = capitalizeFirstLetter(filter);

  return(`
    <div class="trip-filters__filter">
      <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" checked>
      <label class="trip-filters__filter-label" for="filter-${filter}">${filterName}</label>
    </div>
  `);
};

const createFilterTemplate = (filters) => {
  return (`
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters  trip-filters--hidden" action="#" method="get">
      ${createItems(filters, getFilterHtml)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `);
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
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
