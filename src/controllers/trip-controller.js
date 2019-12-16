import {render, RenderPosition} from "../utils/render";
import Sort, {SortType} from "../components/sort";
import {sortOptions} from "../mock/sort";
import Event from "../components/event";
import Task from "../components/task";
import Route from "../components/route";
import PointController from "./point-controller";

export default class TripController {

  constructor(container, header) {
    this._container = container;
    this._header = header;
    this._sortComponent = new Sort(sortOptions);
    this._cards = [];
  }

  render(cards) {
    this._cards = cards;
    const tripRoute = this._header.querySelector(`.trip-main__trip-info`);
    const totalPrice = this._header.querySelector(`.trip-info__cost-value`);

    render(this._container, this._sortComponent);
    this._sortComponent.setEventSortActive();

    render(this._container, new Event());
    render(this._container, new Task());

    const eventsList = this._container.querySelector(`.trip-events__list`);
    this._pointController = new PointController(eventsList, this._dataChangeHandler.bind(this));
    this._cards.forEach((card) => {
      this._pointController.render(card);
    });
    render(tripRoute, new Route(this._cards), RenderPosition.AFTERBEGIN);
    totalPrice.textContent = this._getTotalSum(this._cards);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      eventsList.innerHTML = ``;
      this._getSortedCards(sortType, this._cards).forEach((card) => {
        this._pointController.render(card);
      });
    });
  }

  _getSortedCards(sortType, cards) {
      let sortedTasks = [];

      switch (sortType) {
        case SortType.TIME:
          sortedTasks = cards.slice().sort((a, b) => b.start - a.start);
          break;
        case SortType.PRICE:
          sortedTasks = cards.slice().sort((a, b) => b.price - a.price);
          break;
        default:
          sortedTasks = cards.slice(0);
          break;
      }

      return sortedTasks;
  }

  _getTotalSum(tripPoints) {
    return tripPoints
      .map((tripPoint) => tripPoint.price)
      .reduce((a, b) => a + b, 0);
  }

  _dataChangeHandler(cardComponent, newCardData, oldCardData) {
    const index = this._cards.findIndex((it) => it === oldCardData);

    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newCardData, this._cards.slice(index + 1));

    cardComponent.render(this._cards[index]);
  }
}
