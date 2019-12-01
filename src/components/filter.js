import {capitalizeFirstLetter} from "../utils";

const getFilterHtml = (filter) => {
  const filterName = capitalizeFirstLetter(filter);

  return(`
    <div class="trip-filters__filter">
      <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" checked>
      <label class="trip-filters__filter-label" for="filter-${filter}">${filterName}</label>
    </div>
  `);
};

const createFilterItems = (filters) => {
  const filtersContainer = document.createDocumentFragment();
  filtersContainer.innerHTML = ``;

  for (const filter of filters) {
    filtersContainer.innerHTML += getFilterHtml(filter);
  }

  return filtersContainer.innerHTML;
};

export const createFilterTemplate = (filters) => {
  return (`
    <h2 class="visually-hidden">Filter events</h2>
    <form class="trip-filters  trip-filters--hidden" action="#" method="get">
      ${createFilterItems(filters)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `);
};
