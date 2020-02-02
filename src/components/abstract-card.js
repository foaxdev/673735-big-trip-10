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

  set onSubmit(handler) {
    this.element.addEventListener(`submit`, handler);
    this._onSubmit = handler;
  }

  set onActionTypeClick(handler) {
    this._actionTypeButton.addEventListener(`click`, handler);
    this._onActionTypeClick = handler;
  }

  set onActionTypeChange(handler) {
    this._actionTypeInputs.forEach((actionTypeInput) => {
      actionTypeInput.addEventListener(`click`, handler);
    });
    this._onActionTypeChange = handler;
  }

  set onCityChange(handler) {
    this._citySelect.addEventListener(`change`, handler);
    this._onCityChange = handler;
  }

  set onStartDateChange(handler) {
    this._startDate.addEventListener(`change`, handler);
    this._onStartDateChange = handler;
  }

  set onEndDateChange(handler) {
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
    return new FormData(this.element);
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
    const inputs = this.element.querySelectorAll(`input`);
    const buttons = this.element.querySelectorAll(`button`);
    const selectElement = this.element.querySelector(`select`);

    inputs.forEach((inputElement) => {
      inputElement.setAttribute(`disabled`, `disabled`);
    });

    buttons.forEach((buttonElement) => {
      buttonElement.setAttribute(`disabled`, `disabled`);
    });

    selectElement.setAttribute(`disabled`, `disabled`);
  }

  unblockForm() {
    const inputs = this.element.querySelectorAll(`input`);
    const buttons = this.element.querySelectorAll(`button`);
    const selectElement = this.element.querySelector(`select`);

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

  set onAmenityClickHandler(handler) {
    this.element.querySelectorAll(`.event__offer-checkbox`).forEach((amenity) => {
      amenity.addEventListener(`change`, handler);
    });
    this._onAmenityClickHandler = handler;
  }

  reset() {
    this.element.reset();
    this._applyFlatpickr();
  }

  removeHandlers() {
    this.element.removeEventListener(`submit`, this._onSubmit);
    this._actionTypeButton.removeEventListener(`click`, this._onActionTypeClick);
    this._startDate.removeEventListener(`change`, this._onStartDateChange);
    this._endDate.removeEventListener(`change`, this._onEndDateChange);
    this._citySelect.removeEventListener(`change`, this._onCityChange);
    this._actionTypeInputs.forEach((actionTypeInput) => {
      actionTypeInput.removeEventListener(`click`, this._onActionTypeChange);
    });
    this.element.querySelectorAll(`.event__offer-checkbox`).forEach((amenityLabel) => {
      amenityLabel.removeEventListener(`change`, this._onAmenityClickHandler);
    });
  }

  recoveryListeners() {
    this.onSubmit = this._onSubmit;
    this.onActionTypeClick = this._onActionTypeClick;
    this.onActionTypeChange = this._onActionTypeChange;
    this.onStartDateChange = this._onStartDateChange;
    this.onEndDateChange = this._onEndDateChange;
    this.onCityChange = this._onCityChange;
    this.onAmenityClickHandler = this._onAmenityClickHandler;
  }

  _getCurrentCityValue() {
    return this._citySelect.value;
  }
}
