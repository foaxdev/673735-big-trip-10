import AbstractComponent from "./abstract-component";
import flatpickr from "flatpickr";
import {createItems} from "../utils/render";

const getDestinationHtml = (destination) => {
  return (`
    <option value="${destination.city}"></option>
  `);
};

const createAddEventTemplate = (destinations) => {
  return (`
    <form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header visually-hidden">
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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="" list="destination-list-1" required>
          <datalist id="destination-list-1">
            ${createItems(destinations, getDestinationHtml)}
          </datalist>
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
    </form>
  `);
};

export default class CardAdd extends AbstractComponent {

  constructor(destinationsModel) {
    super();

    this._destinationsModel = destinationsModel;

    this._onActionTypeClick = null;
    this._onActionTypeChange = null;
    this._onStartDateChange = null;
    this._onEndDateChange = null;
    this._onCancelButtonClick = null;
    this._onSubmit = null;

    this._flatpickrStartDate = null;
    this._flatpickrEndDate = null;

    this._actionTypesList = this.getElement().querySelector(`.event__type-list`);
    this._actionTypeButton = this.getElement().querySelector(`.event__type`);
    this._actionTypeInputs = this.getElement().querySelectorAll(`.event__type-input`);
    this._startDate = this.getElement().querySelector(`#event-start-time-1`);
    this._endDate = this.getElement().querySelector(`#event-end-time-1`);
    this._cancelButton = this.getElement().querySelector(`.event__reset-btn`);

    this._applyFlatpickr();
  }

  getTemplate() {
    return createAddEventTemplate(this._destinationsModel.getDestinations());
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

  setActionActionInputsHandler(handler) {
    this._actionTypeInputs.forEach((actionTypeInput) => {
      actionTypeInput.addEventListener(`click`, handler);
    });
    this._onActionTypeChange = handler;
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
  }

  reset() {
    this.getElement().reset();
    this._applyFlatpickr();
  }

  cancelAddingCard() {
    this.removeHandlers();
    this.reset();
    this.removeElement();
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

    this.showOrHideCard();

    super.removeElement();
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

  getData() {
    return new FormData(this.getElement());
  }

  showTypesList() {
    this._actionTypesList.style.display = `block`;
  }

  hideTypesList() {
    this._actionTypesList.style.display = `none`;
  }

  showOrHideCard() {
    this.getElement().querySelector(`.event__header`).classList.toggle(`visually-hidden`);
  }

  changeMaxStartDate(newDate) {
    this._flatpickrStartDate.set(`maxDate`, newDate);
  }

  changeMinEndDate(newDate) {
    this._flatpickrEndDate.set(`minDate`, newDate);
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
      allowInput: true,
      defaultDate: now,
      format: `d/m/Y H:i`,
      altFormat: `d/m/Y H:i`,
      maxDate: now,
      minDate: now,
      enableTime: true
    });
    this._flatpickrEndDate = flatpickr(this._endDate, {
      altInput: true,
      allowInput: true,
      defaultDate: now,
      format: `d/m/Y H:i`,
      altFormat: `d/m/Y H:i`,
      minDate: now,
      enableTime: true
    });
  }
}
