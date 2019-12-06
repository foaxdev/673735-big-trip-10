import Menu from "./components/menu";
import {TASK_COUNT} from "./components/task";
import {menuNames} from "./mock/menu";
import {filters} from "./mock/filter";
import Filter from "./components/filter";
import {TIP_MESSAGE} from "./const";
import Tip from "./components/tip";
import {render, RenderPosition} from "./utils/render";
import TripController from "./controllers/trip-controller";
import {generateCards} from "./mock/card";

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

const setStatsMenuActive = () => {
  const menuItems = document.querySelectorAll(`.trip-tabs__btn`);
  setMenuItemActive(menuItems[1]);
};

const addMessageToEmptyRoute = () => {
  render(tripEvents, new Tip(TIP_MESSAGE).getElement(), RenderPosition.BEFOREEND);
};

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const menuHeader = tripControls.querySelectorAll(`h2`)[0];
const filterHeader = tripControls.querySelectorAll(`h2`)[1];
const tripEvents = document.querySelector(`.trip-events`);

render(menuHeader, new Menu(menuNames), RenderPosition.AFTEREND);
setStatsMenuActive();

render(filterHeader, new Filter(filters), RenderPosition.AFTEREND);

if (TASK_COUNT > 0) {
  const tripController = new TripController(tripEvents);
  const cards = generateCards(TASK_COUNT).sort((a, b) => a.start > b.start);
  tripController.render(cards);
} else {
  addMessageToEmptyRoute();
}
