import Menu from "./components/menu";
import {menuNames} from "./mock/menu";
import {render, RenderPosition} from "./utils/render";
import TripController from "./controllers/trip-controller";
import {data} from "./mock/card";
import Points from "./models/points";
import FilterController from "./controllers/filter-controller";

const tripControl = document.querySelector(`.trip-main`);
const tripView = document.querySelector(`.trip-main__trip-controls`);
const menuHeader = tripView.querySelectorAll(`h2`)[0];
const filterHeader = tripView.querySelectorAll(`h2`)[1];
const tripEvents = document.querySelector(`.trip-events`);

render(menuHeader, new Menu(menuNames), RenderPosition.AFTEREND);

const pointModel = new Points();
pointModel.setPoints(data);

const tripController = new TripController(tripEvents, tripControl, pointModel);
tripController.render();

const filterController = new FilterController(filterHeader, pointModel);
filterController.render();
