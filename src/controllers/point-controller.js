import Card from "../components/card";
import CardEdit from "../components/card-edit";
import {remove, render, replace} from "../utils/render";
import {Keys} from "../const";
import Point from "../models/point";
import debounce from 'lodash/debounce';

const DEBOUNCE_TIMEOUT = 1000;
export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class PointController {

  constructor(container, generalContainer, destinationsModel, offersModel, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._generalContainer = generalContainer;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._onDataChange = dataChangeHandler;
    this._onViewChange = viewChangeHandler;
    this._mode = Mode.DEFAULT;
    this._editCardComponent = null;
    this._pointData = {};
    this._newPointData = {};
    this._newCurrentType = null;
    this._newStartDate = null;
    this._newEndDate = null;
  }

  render(pointData, isDefaultSorting) {
    this._pointData = pointData;
    this._newPointData = this._pointData;
    this._cardComponent = new Card(this._pointData);
    this._newCurrentType = pointData.type;
    this._editCardComponent = new CardEdit(this._pointData, this._destinationsModel, this._offersModel);
    const actionTypes = document.querySelectorAll(`.event__type-input`);

    const actionTypeChangeHandler = (evt) => {
      this._newCurrentType = evt.target.value;
      this._editCardComponent.changeEventPlaceholder(this._newCurrentType);
      this._editCardComponent.changeActionTypeIcon(this._newCurrentType);
      this._editCardComponent.hideTypesList();
      this._editCardComponent.changeAmenities(this._newCurrentType);
      this._pointData.amenities = [];
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === Keys.ESCAPE) {
        this._editCardComponent.reset();
        removeEventListenersFromEditCard();
        this.replaceEditToCard();
      }
    };

    const submitFormHandler = (evt) => {
      evt.preventDefault();
      this._editCardComponent.changeSaveButtonTitle(`Saving...`);
      removeEventListenersFromEditCard();
      this._updatePointData();
      const formData = this._editCardComponent.getDataFromForm();
      const data = this._parseFormData(formData);
      this._editCardComponent.blockForm();

      this._onDataChange(
          this._editCardComponent,
          data,
          this._pointData
      );
      this._editCardComponent.data = data;
    };

    const actionTypeClickHandler = () => {
      this._editCardComponent.showTypesList();
      this._editCardComponent.onActionTypeChange = actionTypeChangeHandler;
      this._editCardComponent.changeSelectedActionType(this._newCurrentType);
    };

    const startDateChangeHandler = (evt) => {
      this._newStartDate = evt.target.value;
    };

    const endDateChangeHandler = (evt) => {
      this._newEndDate = evt.target.value;
    };

    const cityChangeHandler = (evt) => {
      this._editCardComponent.changeDescription(evt.target.value);
      this._editCardComponent.changePictures(evt.target.value);
    };

    const deleteCardHandler = () => {
      this._editCardComponent.changeButtonDeleteTitle(`Deleting...`);
      this._editCardComponent.blockForm();

      this._onDataChange(
          this._editCardComponent,
          null,
          this._pointData
      );
    };

    const favButtonClickHandler = debounce(() => {
      const newPoint = Point.clone(this._pointData);
      newPoint.isFavorite = !this._pointData.isFavorite;
      this._onDataChange(
          this._editCardComponent,
          newPoint,
          this._pointData
      );
    }, DEBOUNCE_TIMEOUT);

    const removeEventListenersFromEditCard = () => {
      this._editCardComponent.removeHandlers();
      document.removeEventListener(`keydown`, escKeyDownHandler);
    };

    const amenitiesChangeHandler = (evt) => {
      evt.preventDefault();
      const amenityTitle = evt.target.nextElementSibling.querySelector(`.event__offer-title`).textContent;
      const amenityPrice = parseInt(evt.target.nextElementSibling.querySelector(`.event__offer-price`).textContent, 10);

      if (evt.target.checked) {
        this._pointData.amenities.push({
          title: amenityTitle,
          price: amenityPrice
        });
      } else {
        this._pointData.amenities = this._pointData.amenities.filter((amenity) => amenity.title !== amenityTitle);
      }
    };

    const setEventListenersToEditCard = () => {
      document.addEventListener(`keydown`, escKeyDownHandler);
      this._editCardComponent.onSubmit = submitFormHandler;
      this._editCardComponent.onActionTypeClick = actionTypeClickHandler;
      this._editCardComponent.onStartDateChange = startDateChangeHandler;
      this._editCardComponent.onEndDateChange = endDateChangeHandler;
      this._editCardComponent.onAmenityClickHandler = amenitiesChangeHandler;
    };

    this._cardComponent.onEditButton = () => {
      this._replaceCardToEdit();
      this._editCardComponent.highlightAddedAmenities(this._editCardComponent.element);
      setEventListenersToEditCard();

      actionTypes.forEach((actionType) => {
        actionType.addEventListener(`click`, actionTypeChangeHandler);
      });

      this._editCardComponent.onCityChange = cityChangeHandler;
      this._editCardComponent.onDeleteButtonClick = deleteCardHandler;
      this._editCardComponent.onFavButtonClick = favButtonClickHandler;
    };

    if (isDefaultSorting) {
      render(this._container, this._cardComponent);
    } else {
      render(this._generalContainer, this._cardComponent);
    }
  }

  replaceEditToCard() {
    replace(this._cardComponent, this._editCardComponent);
    this._mode = Mode.DEFAULT;
    this._cardComponent.recoveryListeners();
  }

  setupDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this.replaceEditToCard();
    }
  }

  destroy() {
    remove(this._editCardComponent);
    remove(this._cardComponent);
  }

  get mode() {
    return this._mode;
  }

  _parseFormData(formData) {
    return new Point({
      'id': this._pointData.id,
      'type': this._newPointData.type,
      'is_favourite': this._pointData.isFavorite,
      'base_price': parseInt(formData.get(`event-price`), 10),
      'date_from': this._newPointData.start,
      'date_to': this._newPointData.end,
      'destination': {
        'name': formData.get(`event-destination`),
        'description': this._pointData.description,
        'pictures': this._pointData.photos},
      'offers': this._pointData.amenities
    });
  }

  _updatePointData() {
    this._newPointData.type = this._newCurrentType !== null ? this._newCurrentType : this._pointData.type;
    this._newPointData.start = this._newStartDate !== null ? new Date(this._newStartDate) : this._pointData.start;
    this._newPointData.end = this._newEndDate !== null ? new Date(this._newEndDate) : this._pointData.end;
  }

  _replaceCardToEdit() {
    this._onViewChange();
    replace(this._editCardComponent, this._cardComponent);
    this._mode = Mode.EDIT;
    this._editCardComponent.recoveryListeners();
  }
}
