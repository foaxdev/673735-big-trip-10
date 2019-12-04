import Menu from "./components/menu";
import Route from "./components/route";
import Sort from "./components/sort";
import Card from "./components/card";
import {createAddEventTemplate} from "./components/event";
import Task, {TASK_COUNT} from "./components/task";
import {generateCards} from "./mock/card";
import {menuNames} from "./mock/menu";
import {filters} from "./mock/filter";
import {sortOptions} from "./mock/sort";
import Filter from "./components/filter";
import {render, RenderPosition} from "./utils";
import CardEdit from "./components/card-edit";

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

const renderOld = (container, template, place = `beforeend`) => {
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

render(menuHeader, new Menu(menuNames).getElement(), RenderPosition.AFTEREND);
setStatsMenuActive();

render(filterHeader, new Filter(filters).getElement(), RenderPosition.AFTEREND);
render(tripEvents, new Sort(sortOptions).getElement(), RenderPosition.BEFOREEND);
setEventSortActive();

renderOld(tripEvents, createAddEventTemplate());
render(tripEvents, new Task().getElement(), RenderPosition.BEFOREEND);

const eventsList = document.querySelector(`.trip-events__list`);

const cards = generateCards(TASK_COUNT).sort((a, b) => a.start > b.start);

cards.forEach((card) => {
  render(eventsList, new Card(card).getElement(), RenderPosition.BEFOREEND);
  const editCard = new CardEdit(card);
});
render(tripRoute, new Route(cards).getElement(), RenderPosition.AFTERBEGIN);
totalPrice.textContent = getTotalSum(cards);
