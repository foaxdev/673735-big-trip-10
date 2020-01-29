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

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(points);
  })
  .then(() => {
    api.getDestinations()
      .then((destinations) => {
        destinationsModel.setDestinations(destinations);
      })
      .then(() => {
        api.getOffers()
          .then((offers) => {
            offersModel.setOffers(offers);

            const statisticsComponent = new Statistics(pointsModel.getPoints());
            render(pageBodyContainer, statisticsComponent);
            statisticsComponent.hide();

            const tripController = new TripController(tripEvents, tripControl, pointsModel, statisticsComponent, destinationsModel, offersModel, api);
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

            const filterController = new FilterController(filterHeader, pointsModel);
            filterController.render();
          })
      })
  });
