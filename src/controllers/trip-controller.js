import {remove, render, RenderPosition} from "../utils/render";
import Sort, {SortType} from "../components/sort";
import {sortOptions} from "../mock/sort";
import CardAdd from "../components/card-add";
import Task from "../components/task";
import Route from "../components/route";
import PointController from "./point-controller";
import Tip from "../components/tip";
import {actionByType, HIDDEN_CLASS, TIP_MESSAGE} from "../const";
import Point from "../models/point";

export default class TripController {

  constructor(container, header, pointModel, statisticsComponent, destinationsModel, offersModel, api) {
    this._container = container;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._api = api;
    this._header = header;
    this._tripRoute = this._header.querySelector(`.trip-main__trip-info`);
    this._totalPrice = this._header.querySelector(`.trip-info__cost-value`);
    this._addButton = this._header.querySelector(`.trip-main__event-add-btn`);
    this._eventsList = null;
    this._pointsModel = pointModel;
    this._statisticsComponent = statisticsComponent;
    this._route = null;
    this._sortComponent = new Sort(sortOptions);
    this._cards = [];
    this._newPointData = this._setDefaultNewPointData();
    this._pointControllers = [];
    this._addNewCard = null;
    this._isAddNewFormOpened = false;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const cardsData = this._pointsModel.getPoints();

    if (cardsData.length > 0) {
      this._cards = this._getSortedCards(null, cardsData);

      render(this._container, this._sortComponent);
      this._sortComponent.setEventSortActive();

      render(this._container, new Task());

      this._eventsList = this._container.querySelector(`.trip-events__list`);
      this._pointController = new PointController(this._eventsList, this._destinationsModel, this._offersModel, this._onDataChange, this._onViewChange);
      this._pointControllers = this._renderPointControllers();
      this._route = new Route(this._cards);
      render(this._tripRoute, this._route, RenderPosition.AFTERBEGIN);

      this._totalPrice.textContent = this._getTotalSum(this._cards);

      this._sortComponent.setSortTypeChangeHandler((sortType) => {
        this._eventsList.innerHTML = ``;
        this._currentSortType = sortType;
        this._getSortedCards(this._currentSortType, this._cards).forEach((card) => {
          this._pointController.render(card);
        });
      });
    } else {
      this._addMessageToEmptyRoute();
    }

    this._addEventListenerToAddButton(this._isAddNewFormOpened);
  }

  hide() {
    if (this._container) {
      this._container.classList.add(HIDDEN_CLASS);
    }
  }

  show() {
    if (this._container) {
      this._container.classList.remove(HIDDEN_CLASS);
    }
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
      this._onDataChange(
          null,
          this._parseFormData(formData),
          null
      );
      this._addNewCard.cancelAddingCard();
      isFormOpened = !isFormOpened;
    };

    this._addButton.addEventListener(`click`, () => {
      if (!isFormOpened) {
        this._addNewCard = new CardAdd(this._destinationsModel);
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

  _parseFormData(formData) {
    return new Point({
      'type': this._newPointData.type,
      'is_favourite': false,
      'base_price': parseInt(formData.get(`event-price`), 10),
      'date_from': this._newPointData.start,
      'date_to': this._newPointData.end,
      'destination': {
        'name': formData.get(`event-destination`),
        'description': this._destinationsModel.getDescriptionByCity(formData.get(`event-destination`)),
        'pictures': this._destinationsModel.getPicturesByCity(formData.get(`event-destination`))
      },
      'offers': []
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

  _onDataChange(cardComponent, newPointData, oldPointData) {
    if (newPointData === null) {
      this._api.deletePoint(oldPointData.id)
        .then(() => {
          this._pointsModel.removePoint(oldPointData.id);
          this._updatePoints();
          this._updateHeaderInfo(this._pointsModel.getPoints());
          this._statisticsComponent.setNewData(this._pointsModel.getPoints());
        })
        .catch(() => {
          // TODO: no success behaviour
        });
    } else if (oldPointData === null) {
      this._api.addPoint(newPointData)
        .then(() => {
          this._pointsModel.addPoint(newPointData);
          this._updatePoints();
          this._updateHeaderInfo(this._pointsModel.getPoints());
          this._statisticsComponent.setNewData(this._pointsModel.getPoints());
        })
        .catch(() => {
          // TODO: no success behaviour
        });
    } else {
      this._api.updatePoint(oldPointData.id, newPointData)
        .then(() => {
          const isSuccess = this._pointsModel.updatePoint(oldPointData.id, newPointData);

          if (isSuccess) {
            cardComponent.setNewData(newPointData);
            this._updateHeaderInfo(this._pointsModel.getPoints());
            this._statisticsComponent.setNewData(this._pointsModel.getPoints());
          }
        })
        .catch(() => {
          // TODO: no success behaviour
        });
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

  _renderPoints() {
    const newPoints = this._renderPointControllers();
    this._pointControllers = this._pointControllers.concat(newPoints);
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints();
  }

  _onFilterChange() {
    this._updatePoints();
  }

  _renderPointControllers() {
    let pointControllers = [];
    this._pointsModel.getPoints().forEach((card) => {
      const pointController = new PointController(this._container.querySelector(`.trip-events__list`), this._destinationsModel, this._offersModel, this._onDataChange, this._onViewChange);
      pointController.render(card);

      pointControllers.push(pointController);
    });

    return pointControllers;
  }
}
