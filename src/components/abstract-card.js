import AbstractSmartComponent from "./abstract-smart-component";
import {actionByType, HIDDEN_CLASS} from "../const";
import {createItems} from "../utils/render";

export const getImageHtml = (imageData) => {
  return (`
    <img class="event__photo" src="${imageData[`src`]}" alt="${imageData[`description`]}">
  `);
};

export const getAmenityHtml = (offer) => {
  return (`
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}" type="checkbox" name="event-offer">
      <label class="event__offer-label" for="event-offer-${offer.title}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>
  `);
};

export default class AbstractCard extends AbstractSmartComponent {

  constructor(destinationsModel, offersModel) {
    super();

    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;

    this._flatpickrStartDate = null;
    this._flatpickrEndDate = null;

    this._onSubmit = null;
    this._onActionTypeClick = null;
    this._onActionTypeChange = null;
    this._onCityChange = null;
    this._onStartDateChange = null;
    this._onEndDateChange = null;
    this._onAmenityClickHandler = null;
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

  setActionTypeClickHandler(handler) {
    this._actionTypeButton.addEventListener(`click`, handler);
    this._onActionTypeClick = handler;
  }

  setActionInputsClickHandler(handler) {
    this._actionTypeInputs.forEach((actionTypeInput) => {
      actionTypeInput.addEventListener(`click`, handler);
    });
    this._onActionTypeChange = handler;
  }

  setCitySelectChangeHandler(handler) {
    this._citySelect.addEventListener(`change`, handler);
    this._onCityChange = handler;
  }

  setStartDateChangeHandler(handler) {
    this._startDate.addEventListener(`change`, handler);
    this._onStartDateChange = handler;
  }

  setEndDateChangeHandler(handler) {
    this._endDate.addEventListener(`change`, handler);
    this._onEndDateChange = handler;
  }

  changeActionTypeIcon(type) {
    this._eventIcon.src = `img/icons/${type}.png`;
  }

  changeEventPlaceholder(type) {
    this._eventLabel.textContent = actionByType.get(type);
  }

  showTypesList() {
    this._actionTypesList.style.display = `block`;
  }

  hideTypesList() {
    this._actionTypesList.style.display = `none`;
  }

  getDataFromForm() {
    return new FormData(this.getElement());
  }

  changeSelectedActionType(type) {
    this._actionTypeInputs.forEach((actionType) => {
      if (actionType.hasAttribute(`checked`)) {
        actionType.removeAttribute(`checked`);
      }
      if (actionType.getAttribute(`value`) === type) {
        actionType.setAttribute(`checked`, `checked`);
      }
    });
  }

  blockForm() {
    const inputs = this.getElement().querySelectorAll(`input`);
    const buttons = this.getElement().querySelectorAll(`button`);
    const selectElement = this.getElement().querySelector(`select`);

    inputs.forEach((inputElement) => {
      inputElement.setAttribute(`disabled`, `disabled`);
    });

    buttons.forEach((buttonElement) => {
      buttonElement.setAttribute(`disabled`, `disabled`);
    });

    selectElement.setAttribute(`disabled`, `disabled`);
  }

  unblockForm() {
    const inputs = this.getElement().querySelectorAll(`input`);
    const buttons = this.getElement().querySelectorAll(`button`);
    const selectElement = this.getElement().querySelector(`select`);

    inputs.forEach((inputElement) => {
      inputElement.removeAttribute(`disabled`);
    });

    buttons.forEach((buttonElement) => {
      buttonElement.removeAttribute(`disabled`);
    });

    selectElement.removeAttribute(`disabled`);
  }

  rerender() {
    super.rerender();

    this._applyFlatpickr();
  }

  hideOffersSection() {
    this._offersSection.classList.add(HIDDEN_CLASS);
  }

  showOffersSection() {
    this._offersSection.classList.remove(HIDDEN_CLASS);
  }

  changeAmenities(type) {
    if (this._offersModel.getOffersByType(type).length <= 0) {
      this.hideOffersSection();
    } else {
      this.showOffersSection();
      this._offersBlock.innerHTML = createItems(this._offersModel.getOffersByType(type), getAmenityHtml);
    }
  }

  changeDescription() {
    this._eventDetailsBlock.querySelector(`.event__destination-description`).textContent = this._destinationsModel.getDescriptionByCity(this._getCurrentCityValue());
  }

  changePictures() {
    this._eventDetailsBlock.querySelector(`.event__photos-tape`).innerHTML = createItems(this._destinationsModel.getPicturesByCity(this._getCurrentCityValue()), getImageHtml);
  }

  changeSaveButtonTitle(buttonText) {
    this._saveButton.textContent = buttonText;
  }

  setAmenitiesChangeHandler(handler) {
    this.getElement().querySelectorAll(`.event__offer-checkbox`).forEach((amenity) => {
      amenity.addEventListener(`change`, handler);
    });
    this._onAmenityClickHandler = handler;
  }

  reset() {
    this.getElement().reset();
    this._applyFlatpickr();
  }

  removeHandlers() {
    this.getElement().removeEventListener(`submit`, this._onSubmit);
    this._actionTypeButton.removeEventListener(`click`, this._onActionTypeClick);
    this._startDate.removeEventListener(`change`, this._onStartDateChange);
    this._endDate.removeEventListener(`change`, this._onEndDateChange);
    this._citySelect.removeEventListener(`change`, this._onCityChange);
    this._actionTypeInputs.forEach((actionTypeInput) => {
      actionTypeInput.removeEventListener(`click`, this._onActionTypeChange);
    });
    this.getElement().querySelectorAll(`.event__offer-checkbox`).forEach((amenityLabel) => {
      amenityLabel.removeEventListener(`change`, this._onAmenityClickHandler);
    });
  }

  recoveryListeners() {
    this.setSubmitHandler(this._onSubmit);
    this.setActionTypeClickHandler(this._onActionTypeClick);
    this.setActionInputsClickHandler(this._onActionTypeChange);
    this.setStartDateChangeHandler(this._onStartDateChange);
    this.setEndDateChangeHandler(this._onEndDateChange);
    this.setCitySelectChangeHandler(this._onCityChange);
    this.setAmenitiesChangeHandler(this._onAmenityClickHandler);
  }

  _getCurrentCityValue() {
    return this._citySelect.value;
  }
}
