import Card from "../components/card";
import CardEdit from "../components/card-edit";
import {remove, render, replace} from "../utils/render";
import {actionByType, Keys} from "../const";
import Point from "../models/point";

export const SHAKE_ANIMATION_TIMEOUT = 600;

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class PointController {

  constructor(container, destinationsModel, offersModel, dataChangeHandler, viewChangeHandler) {
    this._container = container;
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

  render(pointData) {
    this._pointData = pointData;
    this._newPointData = this._pointData;
    this._cardComponent = new Card(this._pointData);
    this._editCardComponent = new CardEdit(this._pointData, this._destinationsModel, this._offersModel);
    const actionTypes = document.querySelectorAll(`.event__type-input`);

    const actionTypeChangeHandler = (evt) => {
      this._newCurrentType = evt.target.value;
      this._changeEventPlaceholder(this._newCurrentType);
      this._changeActionTypeIcon(this._newCurrentType);
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
      this._editCardComponent.setButtonSaveText(`Saving...`);
      this._editCardComponent.blockForm();
      removeEventListenersFromEditCard();
      this._updatePointData();
      const formData = this._editCardComponent.getData();
      const data = this._parseFormData(formData);

      this._onDataChange(
          this,
          data,
          this._pointData
      );
      this._editCardComponent.setNewData(data);
    };

    const actionTypeClickHandler = () => {
      this._editCardComponent.showTypesList();
      this._editCardComponent.setActionInputsHandler(actionTypeChangeHandler);
      this._editCardComponent.setSelectedActionType(this._editCardComponent.getElement());
    };

    const startDateChangeHandler = (evt) => {
      this._newStartDate = evt.target.value;
      this._editCardComponent.changeMinEndDate(this._newStartDate);
    };

    const endDateChangeHandler = (evt) => {
      this._newEndDate = evt.target.value;
      this._editCardComponent.changeMaxStartDate(this._newEndDate);
    };

    const cityChangeHandler = (evt) => {
      this._editCardComponent.changeDescription(evt.target.value);
      this._editCardComponent.changePictures(evt.target.value);
    };

    const deleteCardHandler = () => {
      this._editCardComponent.setButtonDeleteText(`Deleting...`);
      this._editCardComponent.blockForm();

      this._onDataChange(
          this,
          null,
          this._pointData
      );
    };

    const favButtonClickHandler = () => {
      const newPoint = Point.clone(this._pointData);
      newPoint.isFavorite = !this._pointData.isFavorite;
      this._onDataChange(
        this,
        newPoint,
        this._pointData
      );
    };

    const removeEventListenersFromEditCard = () => {
      this._editCardComponent.removeHandlers();
      document.removeEventListener(`keydown`, escKeyDownHandler);
    };

    const amenitiesClickHandler = (evt) => {
      let wrapElement = null;
      evt.preventDefault();
      if (!evt.target.previousElementSibling) {
        evt.target.parentElement.previousElementSibling.toggleAttribute(`checked`);
        wrapElement = evt.target.parentElement.parentElement;
      } else {
        evt.target.previousElementSibling.toggleAttribute(`checked`);
        wrapElement = evt.target.parentElement;
      }

      const amenityTitle = wrapElement.querySelector(`.event__offer-title`).textContent;
      const amenityPrice = parseInt(wrapElement.querySelector(`.event__offer-price`).textContent, 10);

      if (wrapElement.querySelector(`input`).hasAttribute(`checked`)) {
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
      this._editCardComponent.setSubmitHandler(submitFormHandler);
      this._editCardComponent.setActionTypeHandler(actionTypeClickHandler);
      this._editCardComponent.setStartDateChangeHandler(startDateChangeHandler);
      this._editCardComponent.setEndDateChangeHandler(endDateChangeHandler);
      this._editCardComponent.setAmenitiesClickHandler(amenitiesClickHandler);
    };

    this._cardComponent.setEditButtonClickHandler(() => {
      this._replaceCardToEdit();
      this._editCardComponent.setAddedAmenities(this._editCardComponent.getElement());
      setEventListenersToEditCard();

      actionTypes.forEach((actionType) => {
        actionType.addEventListener(`click`, actionTypeChangeHandler);
      });

      this._editCardComponent.setCityInputHandler(cityChangeHandler);
      this._editCardComponent.setDeleteButtonClickHandler(deleteCardHandler);
      this._editCardComponent.setFavButtonHandler(favButtonClickHandler);
    });

    render(this._container, this._cardComponent);
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

  _changeEventPlaceholder(type) {
    const eventLabel = this._editCardComponent.getElement().querySelector(`.event__label`);
    eventLabel.textContent = actionByType.get(type);
  }

  _changeActionTypeIcon(type) {
    const eventIcon = this._editCardComponent.getElement().querySelector(`.event__type-icon`);
    eventIcon.src = `img/icons/${type}.png`;
  }

  _replaceCardToEdit() {
    this._onViewChange();
    replace(this._editCardComponent, this._cardComponent);
    this._mode = Mode.EDIT;
    this._editCardComponent.recoveryListeners();
  }

  replaceEditToCard() {
    replace(this._cardComponent, this._editCardComponent);
    this._mode = Mode.DEFAULT;
    this._cardComponent.recoveryListeners();
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this.replaceEditToCard();
    }
  }

  destroy() {
    remove(this._editCardComponent);
    remove(this._cardComponent);
  }

  getMode() {
    return this._mode;
  }

  shake() {
    this._editCardComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._editCardComponent.getElement().style.animation = ``;

      this._editCardComponent.setButtonSaveText(`Save`);
      this._editCardComponent.setButtonDeleteText(`Delete`);
      this._editCardComponent.unblockForm();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
