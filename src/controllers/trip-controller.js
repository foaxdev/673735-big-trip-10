import {remove, render, RenderPosition, shake} from "../utils/render";
import Sort, {SortType} from "../components/sort";
import CardAdd from "../components/card-add";
import Points from "../components/points";
import Route from "../components/route";
import PointController, {Mode} from "./point-controller";
import Tip from "../components/tip";
import {HIDDEN_CLASS, TIP_MESSAGE} from "../const";
import Point from "../models/point";

const SORT_OPTIONS = [`event`, `time`, `price`];

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
    this._loadingText = this._container.querySelector(`.trip-events__msg`);
    this._pointsModel = pointModel;
    this._statisticsComponent = statisticsComponent;
    this._route = null;
    this._sortComponent = new Sort(SORT_OPTIONS);
    this._currentSortType = SortType.DEFAULT;
    this._pointsComponent = null;
    this._cards = [];
    this._newPointData = this._setDefaultNewPointData();
    this._pointControllers = [];
    this._addNewCard = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const cardsData = this._pointsModel.getPoints();

    this._loadingText.classList.add(HIDDEN_CLASS);
    this.enableAddButton();

    if (cardsData.length > 0) {
      this._cards = this._getSortedCards(null, cardsData);

      render(this._container, this._sortComponent);
      this._sortComponent.setEventSortActive();

      this._pointsComponent = new Points(this._getBlocksData(cardsData));
      render(this._container, this._pointsComponent);

      this._pointControllers = this._renderPointControllers();
      this._route = new Route(this._cards);
      render(this._tripRoute, this._route, RenderPosition.AFTERBEGIN);

      this._totalPrice.textContent = this._getTotalSum(this._cards);

      this._sortComponent.setSortTypeChangeHandler((sortType) => {
        this._pointsComponent.clearPointContainers();
        sortType !== SortType.DEFAULT ? this._pointsComponent.hideDayInfos() : this._pointsComponent.showDayInfos();
        this._currentSortType = sortType;
        this._renderPointControllers();
        this._pointsComponent.updateDisplay();
      });
    } else {
      this._addMessageToEmptyRoute();
    }

    this._addEventListenerToAddButton();
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

  _getBlocksData(points) {
    const pointDates = new Set(points.map((point) => point.start.setHours(0,0,0,0)));
    const blocksData = [];
    let datesCounter = 1;

    pointDates.forEach((date) => {
      blocksData.push({
        counter: datesCounter++,
        date: date,
        pointsQuantity: this._cards.map((point) => point.start.setHours(0,0,0,0) === date).length
      });
    });

    return blocksData;
  }

  disableAddButton() {
    this._addButton.setAttribute(`disabled`, `disabled`);
  }

  enableAddButton() {
    this._addButton.removeAttribute(`disabled`);
  }

  _addEventListenerToAddButton() {
    const onActionTypeChange = (evt) => {
      this._newPointData.type = evt.target.value;
      this._addNewCard.changeEventPlaceholder(evt.target.value);
      this._addNewCard.changeActionTypeIcon(evt.target.value);
      this._addNewCard.hideTypesList();
      this._addNewCard.changeAmenities(evt.target.value);
      this._addNewCard.setAmenitiesChangeHandler(amenitiesChangeHandler);
    };

    const actionTypeClickHandler = () => {
      this._addNewCard.showTypesList();
      this._addNewCard.setActionInputsClickHandler(onActionTypeChange);
    };

    const startDateChangeHandler = (evt) => {
      this._newPointData.start = new Date(evt.target.value);
    };

    const endDateChangeHandler = (evt) => {
      this._newPointData.end = new Date(evt.target.value);
    };

    const cancelButtonClickHandler = () => {
      this._addNewCard.hideEventDetailsBlock();
      this._addNewCard.showOrHideCard(false);
      this.enableAddButton();
    };

    const cityChangeHandler = () => {
      this._addNewCard.showEventDetailsBlock();
      this._addNewCard.changeAmenities(this._newPointData.type);
      this._addNewCard.setAmenitiesChangeHandler(amenitiesChangeHandler);
      this._addNewCard.changeDescription();
      this._addNewCard.changePictures();
    };

    const amenitiesChangeHandler = (evt) => {
      evt.preventDefault();
      const amenityTitle = evt.target.nextElementSibling.querySelector(`.event__offer-title`).textContent;
      const amenityPrice = parseInt(evt.target.nextElementSibling.querySelector(`.event__offer-price`).textContent, 10);

      if (evt.target.checked) {
        this._newPointData.amenities.push({
          title: amenityTitle,
          price: amenityPrice
        });
      } else {
        this._newPointData.amenities = this._newPointData.amenities.filter((amenity) => amenity.title !== amenityTitle);
      }
    };

    const submitFormHandler = (evt) => {
      evt.preventDefault();
      const formData = this._addNewCard.getData();
      this._addNewCard.setSaveButtonText(`Saving...`);
      this._addNewCard.blockForm();

      this._onDataChange(
          null,
          this._parseFormData(formData),
          null
      );
    };

    this._addButton.addEventListener(`click`, () => {
      if (!this._addNewCard) {
        this._addNewCard = new CardAdd(this._destinationsModel, this._offersModel);
        render(this._sortComponent.getElement(), this._addNewCard, RenderPosition.AFTEREND);
        this._addNewCard.setActionTypeClickHandler(actionTypeClickHandler);
        this._addNewCard.setStartDateChangeHandler(startDateChangeHandler);
        this._addNewCard.setEndDateChangeHandler(endDateChangeHandler);
        this._addNewCard.setCancelButtonClickHandler(cancelButtonClickHandler);
        this._addNewCard.setSubmitHandler(submitFormHandler);
        this._addNewCard.setCitySelectChangeHandler(cityChangeHandler);
      } else {
        this._addNewCard.showOrHideCard(true);
      }
      this.disableAddButton();
      this._closeEditCards();
    });
  }

  _closeEditCards() {
    for (let i = 0; i < this._pointControllers.length; i++) {
      if (this._pointControllers[i].getMode() === Mode.EDIT) {
        this._pointControllers[i].replaceEditToCard();
      }
    }
  }

  _parseFormData(formData) {
    return new Point({
      'id': this._pointsModel.getNewId().toString(),
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
      'offers': this._newPointData.amenities
    });
  }

  _addMessageToEmptyRoute() {
    render(this._container, new Tip(TIP_MESSAGE).getElement());
  }

  _getSortedCards(sortType, cards) {
    let sortedTasks;

    switch (sortType) {
      case SortType.TIME:
        sortedTasks = cards.slice().sort((a, b) => (b.end - b.start) - (a.end - a.start));
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
    let price = tripPoints
      .map((tripPoint) => tripPoint.price)
      .reduce((a, b) => a + b);

    const amenities = tripPoints.map((tripPoint) => tripPoint.amenities);
    amenities.forEach((amenity) => {
      amenity.forEach((it) => {
        price += it.price;
      });
    });
    return price;
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

  _onDataChange(pointController, newPointData, oldPointData) {
    if (newPointData === null) {
      this._api.deletePoint(oldPointData.id)
        .then(() => {
          this._pointsModel.removePoint(oldPointData.id);
          this._updatePoints();
          this._updateHeaderInfo(this._pointsModel.getPoints());
          this._statisticsComponent.setNewData(this._pointsModel.getPoints());
        })
        .catch(() => {
          shake(pointController, true);
        });
    } else if (oldPointData === null) {
      this._api.addPoint(newPointData)
        .then(() => {
          this._pointsModel.addPoint(newPointData);
          this._updatePoints();
          this._updateHeaderInfo(this._pointsModel.getPoints());
          this._statisticsComponent.setNewData(this._pointsModel.getPoints());
          this._addNewCard.setSaveButtonText(`Save`);
          this._addNewCard.unblockForm();
          this._addNewCard.hideEventDetailsBlock();
          this._addNewCard.showOrHideCard(false);
          this.enableAddButton();
        })
        .catch(() => {
          shake(this._addNewCard, false);
        });
    } else {
      this._api.updatePoint(oldPointData.id, newPointData)
        .then(() => {
          const isSuccess = this._pointsModel.updatePoint(oldPointData.id, newPointData);

          if (isSuccess) {
            this._updatePoints();
            this._updateHeaderInfo(this._pointsModel.getPoints());
            this._statisticsComponent.setNewData(this._pointsModel.getPoints());
          }
        })
        .catch(() => {
          shake(pointController, true);
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
    if (this._addNewCard) {
      this._addNewCard.showOrHideCard(false);
    }
  }

  _removePoints() {
    this._pointControllers.forEach((pointController) => pointController.destroy());
    this._pointControllers = [];
    this._pointsComponent.clearPointContainers();
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
    const generalContainer = this._container.querySelector(`.trip-events__list`);
    this._getSortedCards(this._currentSortType, this._pointsModel.getPoints()).forEach((card) => {
      const pointController = new PointController(
          this._pointsComponent.getContainerByDate(card.start),
          generalContainer,
          this._destinationsModel,
          this._offersModel,
          this._onDataChange,
          this._onViewChange
      );
      pointController.render(card, this._currentSortType === SortType.DEFAULT);
      pointControllers.push(pointController);
    });
    this._pointsComponent.updateDisplay();

    return pointControllers;
  }
}
