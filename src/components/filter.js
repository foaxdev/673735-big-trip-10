import {capitalizeFirstLetter} from "../utils/format";
import AbstractComponent from "./abstract-component";
import {createItems} from "../utils/render";

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

export default class Filter extends AbstractComponent {

  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }
}
