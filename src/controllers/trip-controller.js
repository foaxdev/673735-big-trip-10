import {remove, render, RenderPosition} from "../utils/render";
import Sort, {SortType} from "../components/sort";
import {sortOptions} from "../mock/sort";
import Event from "../components/event";
import Task from "../components/task";
import Route from "../components/route";
import PointController from "./point-controller";
import Tip from "../components/tip";
import {TIP_MESSAGE} from "../const";

const renderPointControllers = (cardsContainer, cards, dataChangeHandler, viewChangeHandler) => {
  let pointControllers = [];
  cards.forEach((card) => {
    const pointController = new PointController(cardsContainer, dataChangeHandler, viewChangeHandler);
    pointController.render(card);

    pointControllers.push(pointController);
  });

  return pointControllers;
};

export default class TripController {

  constructor(container, header, pointModel) {
    this._container = container;
    this._header = header;
    this._tripRoute = this._header.querySelector(`.trip-main__trip-info`);
    this._totalPrice = this._header.querySelector(`.trip-info__cost-value`);
    this._pointModel = pointModel;
    this._route = null;
    this._sortComponent = new Sort(sortOptions);
    this._cards = [];
    this._pointControllers = [];

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const cardsData = this._pointModel.getPoints();

    if (cardsData.length > 0) {
      this._cards = this._getSortedCards(null, cardsData);

      render(this._container, this._sortComponent);
      this._sortComponent.setEventSortActive();

      render(this._container, new Event());
      render(this._container, new Task());

      const eventsList = this._container.querySelector(`.trip-events__list`);
      this._pointController = new PointController(eventsList, this._onDataChange.bind(this), this._onViewChange);
      this._pointControllers = renderPointControllers(eventsList, cardsData, this._onDataChange.bind(this), this._onViewChange.bind(this));
      this._route = new Route(this._cards);
      render(this._tripRoute, this._route, RenderPosition.AFTERBEGIN);
      this._totalPrice.textContent = this._getTotalSum(this._cards);

      this._sortComponent.setSortTypeChangeHandler((sortType) => {
        eventsList.innerHTML = ``;
        this._getSortedCards(sortType, this._cards).forEach((card) => {
          this._pointController.render(card);
        });
      });
    } else {
      this._addMessageToEmptyRoute();
    }
  }

  _addMessageToEmptyRoute() {
    render(this._container, new Tip(TIP_MESSAGE).getElement());
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

  _onDataChange(cardComponent, newCardData, oldCardData) {
    if (newCardData === null) {
      this._pointModel.removePoint(oldCardData.id);
      this._updatePoints();
      this._updateHeaderInfo(this._pointModel.getPoints());
    } else {
      const isSuccess = this._pointModel.updatePoint(oldCardData.id, newCardData);

      if (isSuccess) {
        cardComponent.render(newCardData);
      }
    }
  }

  _updateHeaderInfo(pointsData) {
    remove(this._route);
    render(this._tripRoute, new Route(pointsData), RenderPosition.AFTERBEGIN);
    this._totalPrice.textContent = this._getTotalSum(pointsData);
  }

  _onViewChange() {
    this._pointControllers.forEach((pointController) => {
      pointController.setDefaultView();
    });
  }

  /*createPoint() {
    if (this._creatingTask) {
      return;
    }

    const taskListElement = this._cardComponent.getElement();
    this._creatingTask = new TaskController(taskListElement, this._onDataChange, this._onViewChange);
    this._creatingTask.render(EmptyTask, TaskControllerMode.ADDING);
  }*/

  _removePoints() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
  }

  _renderPoints(points) {
    const newPoints = renderPointControllers(this._container.querySelector(`.trip-events__list`), points, this._onDataChange, this._onViewChange);
    this._pointControllers = this._pointControllers.concat(newPoints);
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._pointModel.getPoints().slice(0));
  }

  _onFilterChange() {
    this._updatePoints();
  }
}
