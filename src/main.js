import Menu from "./components/menu";
import {menuNames} from "./mock/menu";
import {render, RenderPosition} from "./utils/render";
import TripController from "./controllers/trip-controller";
import {data} from "./mock/card";
import Points from "./models/points";
import FilterController from "./controllers/filter-controller";
import Statistics from "./components/statistics";

const tripControl = document.querySelector(`.trip-main`);
const tripView = document.querySelector(`.trip-main__trip-controls`);
const menuHeader = tripView.querySelectorAll(`h2`)[0];
const filterHeader = tripView.querySelectorAll(`h2`)[1];
const tripEvents = document.querySelector(`.trip-events`);
const pageBodyContainer = document.querySelector(`.page-main .page-body__container`);

const menuComponent = new Menu(menuNames);
render(menuHeader, menuComponent, RenderPosition.AFTEREND);

const pointModel = new Points();
pointModel.setPoints(data);

const statisticsComponent = new Statistics(pointModel.getPoints());
render(pageBodyContainer, statisticsComponent);
statisticsComponent.hide();

const tripController = new TripController(tripEvents, tripControl, pointModel, statisticsComponent);
tripController.render();

menuComponent.setClickListenersToMenuTableItem(() => {
  statisticsComponent.hide();
  tripController.show();
  menuComponent.setMenuItemActive(menuComponent.getElement().querySelector(`[data-name="Table"]`));
});

menuComponent.setClickListenersToMenuStatsItem(() => {
  statisticsComponent.show();
  tripController.hide();
  menuComponent.setMenuItemActive(menuComponent.getElement().querySelector(`[data-name="Stats"]`));
});

const filterController = new FilterController(filterHeader, pointModel);
filterController.render();
