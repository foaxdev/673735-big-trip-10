import AbstractSmartComponent from "./abstract-smart-component";
import {createItems} from "../utils/render";
import {actionByType} from "../const";
import flatpickr from "flatpickr";

import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';


const getImageHtml = (imageData) => {
  return (`
    <img class="event__photo" src="${imageData[`src`]}" alt="${imageData[`description`]}">
  `);
};

const getAmenityHtml = (offer) => {
  return (`
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer}" type="checkbox" name="event-offer-${offer}">
      <label class="event__offer-label" for="event-offer-${offer}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `);
};

const getDestinationHtml = (destination) => {
  return (`
    <option value="${destination.city}"></option>
  `);
};


const createEditCardTemplate = (cardData, destinations, offersModel) => {
  const {type, city, photos, description, price} = cardData;

  const isFavourite = cardData.isFavorite ? `checked` : ``;
  const prefixForActivity = actionByType.get(type);

  return (`
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>

              <div class="event__type-item">
                <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight">
                <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
              </div>
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>

              <div class="event__type-item">
                <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
              </div>

              <div class="event__type-item">
                <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
              </div>
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${prefixForActivity}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1" required>
          <datalist id="destination-list-1">
            ${createItems(destinations, getDestinationHtml)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="" required>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="" required>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavourite}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${createItems(offersModel.getOffersByType(type), getAmenityHtml)}
          </div>
        </section>
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${createItems(photos, getImageHtml)}
            </div>
          </div>
        </section>
      </section>
    </form>
  `);
};

export default class CardEdit extends AbstractSmartComponent {

  constructor(cardData, destinationsModel, offersModel) {
    super();
    this._cardData = cardData;
    this._destinationsModel = destinationsModel;
    this._destinations = destinationsModel.getDestinations();
    this._offersModel = offersModel;

    this._onSubmit = null;
    this._onDeleteButtonClick = null;
    this._onActionTypeClick = null;
    this._onStartDateChange = null;
    this._onEndDateChange = null;
    this._onCityChange = null;
    this._onActionTypeChange = null;
    this._onFavButtonClick = null;

    this._flatpickrStartDate = null;
    this._flatpickrEndDate = null;

    this._cityInput = this.getElement().querySelector(`.event__input--destination`);
    this._actionTypesList = this.getElement().querySelector(`.event__type-list`);
    this._actionTypeButton = this.getElement().querySelector(`.event__type`);
    this._startDate = this.getElement().querySelector(`#event-start-time-1`);
    this._endDate = this.getElement().querySelector(`#event-end-time-1`);
    this._saveButton = this.getElement().querySelector(`.event__save-btn`);
    this._deleteButton = this.getElement().querySelector(`.event__reset-btn`);
    this._actionTypeInputs = this.getElement().querySelectorAll(`.event__type-input`);
    this._favButton = this.getElement().querySelector(`.event__favorite-btn`);

    this._applyFlatpickr();
  }

  getTemplate() {
    return createEditCardTemplate(this._cardData, this._destinations, this._offersModel);
  }

  removeElement() {
    if (this._flatpickrStartDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrStartDate = null;
    }

    if (this._flatpickrEndDate) {
      this._flatpickrEndDate.destroy();
      this._flatpickrEndDate = null;
    }

    super.removeElement();
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._onSubmit = handler;
  }

  setActionTypeHandler(handler) {
    this._actionTypeButton.addEventListener(`click`, handler);
    this._onActionTypeClick = handler;
  }

  setStartDateChangeHandler(handler) {
    this._startDate.addEventListener(`change`, handler);
    this._onStartDateChange = handler;
  }

  setEndDateChangeHandler(handler) {
    this._endDate.addEventListener(`change`, handler);
    this._onEndDateChange = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);
    this._onDeleteButtonClick = handler;
  }

  setCityInputHandler(handler) {
    this._cityInput.addEventListener(`change`, handler);
    this._onCityChange = handler;
  }

  setActionInputsHandler(handler) {
    this._actionTypeInputs.forEach((actionTypeInput) => {
      actionTypeInput.addEventListener(`click`, handler);
    });
    this._onActionTypeChange = handler;
  }

  setFavButtonHandler(handler) {
    this._favButton.addEventListener(`click`, handler);
    this._onFavButtonClick = handler;
  }

  removeHandlers() {
    this.getElement().removeEventListener(`submit`, this._onSubmit);
    this._actionTypeButton.removeEventListener(`click`, this._onActionTypeClick);
    this._startDate.removeEventListener(`change`, this._onStartDateChange);
    this._endDate.removeEventListener(`change`, this._onEndDateChange);
    this.getElement().querySelector(`.event__reset-btn`).removeEventListener(`click`, this._onDeleteButtonClick);
    this._cityInput.removeEventListener(`change`, this._onCityChange);
    this._actionTypeInputs.forEach((actionTypeInput) => {
      actionTypeInput.removeEventListener(`click`, this._onActionTypeChange);
    });
    this._favButton.removeEventListener(`click`, this._onFavButtonClick);
  }

  setSelectedActionType(editContainer) {
    const actionTypes = editContainer.querySelectorAll(`.event__type-input`);
    actionTypes.forEach((actionType) => {
      if (actionType.hasAttribute(`checked`)) {
        actionType.removeAttribute(`checked`);
      }
      if (actionType.getAttribute(`value`) === this._cardData.type) {
        actionType.setAttribute(`checked`, `checked`);
      }
    });
  }

  setAddedAmenities(editContainer) {
    const amenitiesCheckboxes = editContainer.querySelectorAll(`.event__offer-checkbox`);
    amenitiesCheckboxes.forEach((amenityCheckbox) => {
      for (let i = 0; i < this._cardData.amenities.length; i++) {
        if (amenityCheckbox.nextElementSibling.querySelector(`.event__offer-title`).textContent === this._cardData.amenities[i].title) {
          amenityCheckbox.setAttribute(`checked`, `checked`);
          break;
        }
      }
    });
  }

  reset() {
    this.getElement().reset();
    this._applyFlatpickr();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._onSubmit);
    this.setActionTypeHandler(this._onActionTypeClick);
    this.setStartDateChangeHandler(this._onStartDateChange);
    this.setEndDateChangeHandler(this._onEndDateChange);
    this.setDeleteButtonClickHandler(this._onDeleteButtonClick);
    this.setCityInputHandler(this._onCityChange);
    this.setActionInputsHandler(this._onActionTypeChange);
    this.setFavButtonHandler(this._onFavButtonClick);
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  showTypesList() {
    this._actionTypesList.style.display = `block`;
  }

  hideTypesList() {
    this._actionTypesList.style.display = `none`;
  }

  setNewData(newData) {
    this._cardData = newData;
  }

  changeMaxStartDate(newDate) {
    this._flatpickrStartDate.set(`maxDate`, newDate);
  }

  changeMinEndDate(newDate) {
    this._flatpickrEndDate.set(`minDate`, newDate);
  }

  changeAmenities(type) {
    this.getElement().querySelector(`.event__available-offers`).innerHTML = createItems(this._offersModel.getOffersByType(type), getAmenityHtml);
  }

  changeDescription(city) {
    this.getElement().querySelector(`.event__destination-description`).innerHTML = this._destinationsModel.getDescriptionByCity(city);
  }

  changePictures(city) {
    this.getElement().querySelector(`.event__photos-tape`).innerHTML = createItems(this._destinationsModel.getPicturesByCity(city), getImageHtml);
  }

  getData() {
    return new FormData(this.getElement());
  }

  setButtonSaveText(saveButtonText) {
    this._saveButton.textContent = saveButtonText;
  }

  setButtonDeleteText(deleteButtonText) {
    this._deleteButton.textContent = deleteButtonText;
  }

  blockForm() {
    this.getElement().setAttribute(`disabled`, `disabled`);
  }

  unblockForm() {
    this.getElement().removeAttribute(`disabled`);
  }

  _applyFlatpickr() {
    if (this._flatpickrStartDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrStartDate = null;
    }

    if (this._flatpickrEndDate) {
      this._flatpickrEndDate.destroy();
      this._flatpickrEndDate = null;
    }

    this._flatpickrStartDate = flatpickr(this._startDate, {
      altInput: true,
      allowInput: true,
      defaultDate: this._cardData.start,
      format: `d/m/Y H:i`,
      altFormat: `d/m/Y H:i`,
      maxDate: this._cardData.end,
      minDate: Date.now(),
      enableTime: true
    });

    this._flatpickrEndDate = flatpickr(this._endDate, {
      altInput: true,
      allowInput: true,
      defaultDate: this._cardData.end,
      format: `d/m/Y H:i`,
      altFormat: `d/m/Y H:i`,
      minDate: new Date(this._cardData.start).setDate(this._cardData.start.getDate() + 1),
      enableTime: true
    });
  }
}
