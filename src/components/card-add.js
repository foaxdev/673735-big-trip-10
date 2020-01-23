import flatpickr from "flatpickr";
import {createItems} from "../utils/render";
import {HIDDEN_CLASS} from "../const";
import AbstractCard from "./abstract-card";

const getDestinationHtml = (destination) => {
  return (`
    <option value="${destination.city}">${destination.city}</option>
  `);
};

const createAddEventTemplate = (destinations) => {
  return (`
    <form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
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
                <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
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
            Flight to
          </label>
          <select class="event__input event__input--destination" id="destination-list-1" name="event-destination" required>
            <option disabled selected> -- select a city -- </option>
            ${createItems(destinations, getDestinationHtml)}
          </select>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 00:00" required>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 00:00" required>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="" required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>

      <section class="event__details visually-hidden">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers"></div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description"></p>

          <div class="event__photos-container">
            <div class="event__photos-tape"></div>
          </div>
        </section>
      </section>
    </form>
  `);
};

export default class CardAdd extends AbstractCard {

  constructor(destinationsModel, offersModel) {
    super(destinationsModel, offersModel);
    this._isOpened = false;

    this._onCancelButtonClick = null;

    this._actionTypesList = this.getElement().querySelector(`.event__type-list`);
    this._actionTypeButton = this.getElement().querySelector(`.event__type`);
    this._actionTypeInputs = this.getElement().querySelectorAll(`.event__type-input`);
    this._citySelect = this.getElement().querySelector(`.event__input--destination`);
    this._startDate = this.getElement().querySelector(`#event-start-time-1`);
    this._endDate = this.getElement().querySelector(`#event-end-time-1`);
    this._saveButton = this.getElement().querySelector(`.event__save-btn`);
    this._cancelButton = this.getElement().querySelector(`.event__reset-btn`);
    this._eventDetailsBlock = this.getElement().querySelector(`.event__details`);
    this._offersBlock = this.getElement().querySelector(`.event__available-offers`);
    this._offersSection = this.getElement().querySelector(`.event__section--offers`);
    this._eventIcon = this.getElement().querySelector(`.event__type-icon`);
    this._eventLabel = this.getElement().querySelector(`.event__label`);

    this._applyFlatpickr();
  }

  getTemplate() {
    return createAddEventTemplate(this._destinationsModel.getDestinations());
  }

  showEventDetailsBlock() {
    this._eventDetailsBlock.classList.remove(HIDDEN_CLASS);
  }

  hideEventDetailsBlock() {
    this._eventDetailsBlock.classList.add(HIDDEN_CLASS);
  }

  setCancelButtonClickHandler(handler) {
    this._cancelButton.addEventListener(`click`, handler);
    this._onCancelButtonClick = handler;
  }

  removeHandlers() {
    this.getElement().removeEventListener(`submit`, this._onSubmit);
    this._actionTypeButton.removeEventListener(`click`, this._onActionTypeClick);
    this._startDate.removeEventListener(`change`, this._onStartDateChange);
    this._endDate.removeEventListener(`change`, this._onEndDateChange);
    this._actionTypeInputs.forEach((actionTypeInput) => {
      actionTypeInput.removeEventListener(`click`, this._onActionTypeChange);
    });
    this._cancelButton.removeEventListener(`click`, this._onCancelButtonClick);
    this._citySelect.removeEventListener(`change`, this._onCityChange);
  }

  recoveryListeners() {
    this.setSubmitHandler(this._onSubmit);
    this.setActionTypeClickHandler(this._onActionTypeClick);
    this.setActionInputsClickHandler(this._onActionTypeChange);
    this.setStartDateChangeHandler(this._onStartDateChange);
    this.setEndDateChangeHandler(this._onEndDateChange);
    this.setCancelButtonClickHandler(this._onCancelButtonClick);
    this.setCitySelectChangeHandler(this._onCityChange);
    this.setAmenitiesChangeHandler(this._onAmenityClickHandler);
  }

  reset() {
    super.reset();
    this.changeActionTypeIcon(`flight`);
    this.changeEventPlaceholder(`flight`);
  }

  showOrHideCard(toShow) {
    if (toShow) {
      if (!this._isOpened) {
        this.recoveryListeners();
        this.getElement().querySelector(`.event__header`).classList.remove(`visually-hidden`);
        this._isOpened = true;
      }
    } else {
      this.removeHandlers();
      this.reset();
      this.getElement().querySelector(`.event__header`).classList.add(`visually-hidden`);
      this._isOpened = false;
    }
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
    const now = Date.now();

    this._flatpickrStartDate = flatpickr(this._startDate, {
      altInput: true,
      defaultDate: now,
      format: `d/m/Y H:i`,
      altFormat: `d/m/Y H:i`,
      enableTime: true
    });
    this._flatpickrEndDate = flatpickr(this._endDate, {
      altInput: true,
      defaultDate: now,
      format: `d/m/Y H:i`,
      altFormat: `d/m/Y H:i`,
      enableTime: true
    });
  }
}
