import Menu from "./components/menu";
import {menuNames} from "./mock/menu";
import {filters} from "./mock/filter";
import Filter from "./components/filter";
import {render, RenderPosition} from "./utils/render";
import TripController from "./controllers/trip-controller";
import {data} from "./mock/card";
import Points from "./models/points";
import FilterController from "./controllers/filter-controller";

const tripControl = document.querySelector(`.trip-main`);
const tripView = document.querySelector(`.trip-main__trip-controls`);
const menuHeader = tripView.querySelectorAll(`h2`)[0];
const tripEvents = document.querySelector(`.trip-events`);

render(menuHeader, new Menu(menuNames), RenderPosition.AFTEREND);
render(tripView, new Filter(filters));

const pointModel = new Points();
pointModel.setPoints(data);

const tripController = new TripController(tripEvents, tripControl, pointModel);
tripController.render();

const filterController = new FilterController(tripEvents, pointModel);
filterController.render();
