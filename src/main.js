import {createMenuTemplate, setMenuItemActive} from "./components/menu";
import {createFilterTemplate} from "./components/filter";
import {createRouteTemplate} from "./components/route";
import {createSortTemplate, setSortItemChecked} from "./components/sort";
import {createEditCardTemplate, createCardTemplate} from "./components/card";
import {createAddEventTemplate} from "./components/event";
import {createTasksTemplate, TASK_COUNT} from "./components/task";
import {generateCards} from "./mock/card";
import {menuNames} from "./mock/menu";
import {filters} from "./mock/filter";
import {sortOptions} from "./mock/sort";

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

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const menuHeader = tripControls.querySelectorAll(`h2`)[0];
const filterHeader = tripControls.querySelectorAll(`h2`)[1];
const tripRoute = document.querySelector(`.trip-main__trip-info`);
const tripEvents = document.querySelector(`.trip-events`);

render(menuHeader, createMenuTemplate(menuNames), `afterend`);
setStatsMenuActive();

render(filterHeader, createFilterTemplate(filters), `afterend`);
render(tripRoute, createRouteTemplate(), `afterbegin`);
render(tripEvents, createSortTemplate(sortOptions));
setEventSortActive();

render(tripEvents, createAddEventTemplate());
render(tripEvents, createTasksTemplate());

const eventsList = document.querySelector(`.trip-events__list`);

const cards = generateCards(TASK_COUNT);

cards.forEach((card) => {
  render(eventsList, createCardTemplate(card));
});

const firstEvent = eventsList.querySelector(`li`);
render(firstEvent, createEditCardTemplate(cards[0]), `beforebegin`);
