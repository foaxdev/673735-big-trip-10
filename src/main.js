import {createMenuTemplate} from "./components/menu";
import {createFilterTemplate} from "./components/filter";
import {createRouteTemplate} from "./components/route";
import {createSortTemplate} from "./components/sort";
import {createEditCardTemplate, createCardTemplate} from "./components/card";
import {createAddEventTemplate} from "./components/event";
import {createTasksTemplate, TASK_COUNT} from "./components/task";
import {generateCards} from "./mock/card";
import {menuNames} from "./mock/menu";
import {filters} from "./mock/filter";
import {sortOptions} from "./mock/sort";

const setMenuItemActive = (menuElement) => {
  const menuItems = document.querySelectorAll(`.trip-tabs__btn`);

  for (const menuItem of menuItems) {
    if (menuItem.classList.contains(`trip-tabs__btn--active`)) {
      menuItem.classList.remove(`trip-tabs__btn--active`);
      break;
    }
  }

  menuElement.classList.add(`trip-tabs__btn--active`);
};

const setSortItemChecked = (sortItem) => {
  const sortItems = document.querySelectorAll(`.trip-sort__input`);

  for (const sortItem of sortItems) {
    if (sortItem.hasAttribute(`checked`)) {
      sortItem.removeAttribute(`checked`);
      break;
    }
  }

  sortItem.setAttribute(`checked`, `checked`);
};

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const setStatsMenuActive = () => {
  const menuItems = document.querySelectorAll(`.trip-tabs__btn`);
  setMenuItemActive(menuItems[1]);
};

const setEventSortActive = () => {
  const sortItems = document.querySelectorAll(`.trip-sort__input`);
  setSortItemChecked(sortItems[0]);
};

const getTotalSum = (tripPoints) => {
  return tripPoints
    .map((tripPoint) => tripPoint.price)
    .reduce((a, b) => a + b, 0);
};

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const menuHeader = tripControls.querySelectorAll(`h2`)[0];
const filterHeader = tripControls.querySelectorAll(`h2`)[1];
const tripRoute = document.querySelector(`.trip-main__trip-info`);
const tripEvents = document.querySelector(`.trip-events`);
const totalPrice = document.querySelector(`.trip-info__cost-value`);

render(menuHeader, createMenuTemplate(menuNames), `afterend`);
setStatsMenuActive();

render(filterHeader, createFilterTemplate(filters), `afterend`);
render(tripEvents, createSortTemplate(sortOptions));
setEventSortActive();

render(tripEvents, createAddEventTemplate());
render(tripEvents, createTasksTemplate());

const eventsList = document.querySelector(`.trip-events__list`);

const cards = generateCards(TASK_COUNT).sort((a, b) => a.start > b.start);

cards.forEach((card) => {
  render(eventsList, createCardTemplate(card));
});
render(tripRoute, createRouteTemplate(cards), `afterbegin`);
totalPrice.textContent = getTotalSum(cards);

const firstEvent = eventsList.querySelector(`li`);
render(firstEvent, createEditCardTemplate(cards[0]), `beforebegin`);
