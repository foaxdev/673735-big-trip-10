import Menu from "./components/menu";
import {render, RenderPosition} from "./utils/render";
import TripController from "./controllers/trip-controller";
import Points from "./models/points";
import FilterController from "./controllers/filter-controller";
import Statistics from "./components/statistics";
import Api from "./api";
import {AUTHORIZATION} from "./const";
import Destinations from "./models/destinations";
import Offers from "./models/offers";

const END_POINT = `https://htmlacademy-es-10.appspot.com/big-trip`;

const tripControl = document.querySelector(`.trip-main`);
const tripView = document.querySelector(`.trip-main__trip-controls`);
const menuHeader = tripView.querySelectorAll(`h2`)[0];
const filterHeader = tripView.querySelectorAll(`h2`)[1];
const tripEvents = document.querySelector(`.trip-events`);
const pageBodyContainer = document.querySelector(`.page-main .page-body__container`);

const api = new Api(END_POINT, AUTHORIZATION);
const menuComponent = new Menu();
render(menuHeader, menuComponent, RenderPosition.AFTEREND);

const pointsModel = new Points();
const destinationsModel = new Destinations();
const offersModel = new Offers();

const renderBase = () => {
  const statisticsComponent = new Statistics(pointsModel.points);
  render(pageBodyContainer, statisticsComponent);
  statisticsComponent.hide();

  const tripController = new TripController(tripEvents, tripControl, pointsModel, statisticsComponent, destinationsModel, offersModel, api);
  tripController.render();

  menuComponent.setupClickListenersToMenuTableItem(() => {
    statisticsComponent.hide();
    tripController.show();
    menuComponent.highlightActiveMenuItem(menuComponent.element.querySelector(`[data-name="Table"]`));
  });

  menuComponent.setupClickListenersToMenuStatsItem(() => {
    statisticsComponent.show();
    tripController.hide();
    menuComponent.highlightActiveMenuItem(menuComponent.element.querySelector(`[data-name="Stats"]`));
  });

  const filterController = new FilterController(filterHeader, pointsModel);
  filterController.render();
};

api.getPoints()
  .then((points) => {
    pointsModel.points = points;
    api.getDestinations()
      .then((destinations) => {
        destinationsModel.destinations = destinations;
        api.getOffers()
          .then((offers) => {
            offersModel.offers = offers;
            renderBase();
          });
      });
  });
