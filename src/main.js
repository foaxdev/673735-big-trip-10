import Menu from "./components/menu";
import {menuNames} from "./mock/menu";
import {filters} from "./mock/filter";
import Filter from "./components/filter";
import {render, RenderPosition} from "./utils/render";
import TripController from "./controllers/trip-controller";
import {data} from "./mock/card";

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

const tripControl = document.querySelector(`.trip-main`);
const tripView = document.querySelector(`.trip-main__trip-controls`);
const menuHeader = tripView.querySelectorAll(`h2`)[0];
const filterHeader = tripView.querySelectorAll(`h2`)[1];
const tripEvents = document.querySelector(`.trip-events`);

render(menuHeader, new Menu(menuNames), RenderPosition.AFTEREND);
setStatsMenuActive();

render(filterHeader, new Filter(filters), RenderPosition.AFTEREND);

const tripController = new TripController(tripEvents, tripControl, data);
tripController.render(data);
