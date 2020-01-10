import {remove, render, RenderPosition} from "../utils/render";
import Sort, {SortType} from "../components/sort";
import {sortOptions} from "../mock/sort";
import CardAdd from "../components/card-add";
import Task from "../components/task";
import Route from "../components/route";
import PointController from "./point-controller";
import Tip from "../components/tip";
import {actionByType, TIP_MESSAGE} from "../const";

const parseFormData = (formData, point) => {
  point.price = parseInt(formData.get(`event-price`));
  point.city = formData.get(`event-destination`);
};

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
    this._addButton = this._header.querySelector(`.trip-main__event-add-btn`);
    this._eventsList = null;
    this._pointModel = pointModel;
    this._route = null;
    this._sortComponent = new Sort(sortOptions);
    this._cards = [];
    this._currentSortType = SortType.DEFAULT;
    this._newPointData = this._setDefaultNewPointData();
    this._pointControllers = [];
    this._addNewCard = null;
    this._isAddNewFormOpened = false;

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

      render(this._container, new Task());

      this._eventsList = this._container.querySelector(`.trip-events__list`);
      this._pointController = new PointController(this._eventsList, this._onDataChange, this._onViewChange);
      this._pointControllers = renderPointControllers(this._eventsList, cardsData, this._onDataChange, this._onViewChange);
      this._route = new Route(this._cards);
      render(this._tripRoute, this._route, RenderPosition.AFTERBEGIN);

      this._totalPrice.textContent = this._getTotalSum(this._cards);

      this._sortComponent.setSortTypeChangeHandler((sortType) => {
        this._eventsList.innerHTML = ``;
        this._currentSortType = sortType;
        this._getSortedCards(sortType, this._cards).forEach((card) => {
          this._pointController.render(card);
        });
      });
    } else {
      this._addMessageToEmptyRoute();
    }

    this._addEventListenerToAddButton(this._isAddNewFormOpened);
  }

  _changeEventPlaceholder(type) {
    const eventLabel = this._addNewCard.getElement().querySelector(`.event__label`);
    eventLabel.textContent = actionByType.get(type);
  }

  _changeActionTypeIcon(type) {
    const eventIcon = this._addNewCard.getElement().querySelector(`.event__type-icon`);
    eventIcon.src = `img/icons/${type}.png`;
  }

  _addEventListenerToAddButton(isFormOpened) {
    const onActionTypeChange = (evt) => {
      this._newPointData.type = evt.target.value;
      this._changeEventPlaceholder(evt.target.value);
      this._changeActionTypeIcon(evt.target.value);
      this._addNewCard.hideTypesList();
    };

    const actionTypeClickHandler = () => {
      this._addNewCard.showTypesList();
      this._addNewCard.setActionActionInputsHandler(onActionTypeChange);
    };

    const startDateChangeHandler = (evt) => {
      this._newPointData.start = new Date(evt.target.value);
      this._addNewCard.changeMinEndDate(evt.target.value);
    };

    const endDateChangeHandler = (evt) => {
      this._newPointData.end = new Date(evt.target.value);
      this._addNewCard.changeMaxStartDate(evt.target.value);
    };

    const cancelButtonClickHandler = () => {
      this._addNewCard.cancelAddingCard();
      isFormOpened = !isFormOpened;
    };

    const submitFormHandler = (evt) => {
      evt.preventDefault();
      const formData = this._addNewCard.getData();
      parseFormData(formData, this._newPointData);
      this._onDataChange(
        null,
        this._newPointData,
        null
      );
      this._addNewCard.cancelAddingCard();
      isFormOpened = !isFormOpened;
    };

    this._addButton.addEventListener(`click`, () => {
      if (!isFormOpened) {
        this._addNewCard = new CardAdd();
        render(this._sortComponent.getElement(), this._addNewCard, RenderPosition.AFTEREND);
        this._addNewCard.showOrHideCard();
        this._addNewCard.setActionTypeHandler(actionTypeClickHandler);
        this._addNewCard.setStartDateChangeHandler(startDateChangeHandler);
        this._addNewCard.setEndDateChangeHandler(endDateChangeHandler);
        this._addNewCard.setCancelButtonClickHandler(cancelButtonClickHandler);
        this._addNewCard.setSubmitHandler(submitFormHandler);
        isFormOpened = !isFormOpened;
      }
    });
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

  _setDefaultNewPointData() {
    return {
      type: `flight`,
      start: new Date(),
      end: new Date(),
      price: 0,
      city: ``,
      photos: [],
      description: ``,
      amenities: [],
      isFavorite: false
    };
  }

  _onDataChange(cardComponent, newCardData, oldCardData) {
    if (newCardData === null) {
      this._pointModel.removePoint(oldCardData.id);
      this._updatePoints();
      this._updateHeaderInfo(this._pointModel.getPoints());
    } else if (oldCardData === null) {
      this._pointModel.addPoint(newCardData);
      this._cards = this._pointModel.getPoints();
      this._updatePoints();
      this._updateHeaderInfo(this._pointModel.getPoints());
      this._newPointData = this._setDefaultNewPointData();
    } else {
      const isSuccess = this._pointModel.updatePoint(oldCardData.id, newCardData);

      if (isSuccess) {
        cardComponent.render(newCardData);
      }
    }
  }

  _updateHeaderInfo(pointsData) {
    remove(this._route);
    this._route = new Route(pointsData);
    render(this._tripRoute, this._route, RenderPosition.AFTERBEGIN);
    this._totalPrice.textContent = this._getTotalSum(pointsData);
  }

  _onViewChange() {
    this._pointControllers.forEach((pointController) => {
      pointController.setDefaultView();
    });
  }

  _removePoints() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
    this._container.querySelector(`.trip-events__list`).innerHTML = ``;
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
