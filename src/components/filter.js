import AbstractComponent from "./abstract-component";
import {createItems} from "../utils/render";

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const getFilterHtml = (filter) => {
  return (`
    <div class="trip-filters__filter">
      <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}">
      <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
    </div>
  `);
};

const createFilterTemplate = (filters) => {
  return (`
    <form class="trip-filters" action="#" method="get">
      ${createItems(filters, getFilterHtml)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `);
};

export default class Filter extends AbstractComponent {

  constructor(filters) {
    super();
    this._filters = filters;

    this.highlightActiveFilter(this.element.querySelectorAll(`.trip-filters__filter-input`)[0]);
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  highlightActiveFilter(filterElement) {
    const filterItems = this.element.querySelectorAll(`.trip-filters__filter-input`);

    for (let i = 0; i < filterItems.length; i++) {
      if (filterItems[i].hasAttribute(`checked`)) {
        filterItems[i].removeAttribute(`checked`);
        break;
      }
    }

    filterElement.setAttribute(`checked`, `checked`);
  }

  setupFilterChangeHandler(handler) {
    this.element.addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }

  unableAllFilters() {
    this.element.querySelectorAll(`input`).forEach((filter) => {
      filter.removeAttribute(`disabled`);
    });
  }

  makeFilterUnable(filterType) {
    this.element.querySelector(`#filter-${filterType}`).setAttribute(`disabled`, `disabled`);
  }
}
