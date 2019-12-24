import Card from "../components/card";
import CardEdit from "../components/card-edit";
import {render, replace} from "../utils/render";
import {actionByType, Keys} from "../const";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class PointController {

  constructor(container, dataChangeHandler, viewChangeHandler) {
    this._container = container;
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
    this._editCardComponent = new CardEdit(this._pointData);
    const actionTypes = document.querySelectorAll(`.event__type-input`);

    const onActionTypeChange = (evt) => {
      this._changeEventPlaceholder(evt.target.value);
      this._changeActionTypeIcon(evt.target.value);
      this._newCurrentType = evt.target.value;
      this._editCardComponent.hideTypesList();
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === Keys.ESCAPE) {
        this._editCardComponent.reset();
        removeEventListenersFromEditCard();
        this._replaceEditToCard();
      }
    };

    const submitFormHandler = (evt) => {
      evt.preventDefault();
      removeEventListenersFromEditCard();
      this._replaceEditToCard();
      this._updatePointData();
      this._onDataChange(
        this._cardComponent,
        Object.assign(
          {},
          this._pointData,
          this._newPointData
        ),
        this._pointData
      );
      this._editCardComponent.setNewData(this._newPointData);
      this._cardComponent.setNewData(this._newPointData);
    };

    const actionTypeClickHandler = () => {
      this._editCardComponent.showTypesList();
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

    const removeEventListenersFromEditCard = () => {
      this._editCardComponent.removeSubmitHandler(submitFormHandler);
      this._editCardComponent.removeActionTypeHandler(actionTypeClickHandler);
      this._editCardComponent.removeStartDateChangeHandler(startDateChangeHandler);
      this._editCardComponent.removeEndDateChangeHandler(endDateChangeHandler);
      document.removeEventListener(`keydown`, escKeyDownHandler);
    };

    const setEventListenersToEditCard = () => {
      document.addEventListener(`keydown`, escKeyDownHandler);
      this._editCardComponent.setSubmitHandler(submitFormHandler);
      this._editCardComponent.setActionTypeHandler(actionTypeClickHandler);
      this._editCardComponent.setStartDateChangeHandler(startDateChangeHandler);
      this._editCardComponent.setEndDateChangeHandler(endDateChangeHandler);
    };

    this._cardComponent.setEditButtonClickHandler(() => {
      this._replaceCardToEdit();
      this._editCardComponent.setAddedAmenities(this._editCardComponent.getElement());
      setEventListenersToEditCard();

      actionTypes.forEach((actionType) => {
        actionType.addEventListener(`click`, onActionTypeChange);
      });

      const favButton = this._editCardComponent.getElement().querySelector(`.event__favorite-btn`);
      favButton.addEventListener(`click`, () => {
        this._onDataChange(
          this._cardComponent,
          Object.assign(
            {},
            this._pointData,
            { isFavorite: !this._pointData.isFavorite }
          ),
          this._pointData
        );
      });
    });

    render(this._container, this._cardComponent);
  }

  _updatePointData() {
    this._newPointData.type = this._newCurrentType !== null ? this._newCurrentType : this._pointData.type;
    this._newPointData.start = this._newStartDate !== null ? this._newStartDate : this._pointData.start;
    this._newPointData.end = this._newEndDate !== null ? this._newEndDate : this._pointData.end;
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

  _replaceEditToCard() {
    replace(this._cardComponent, this._editCardComponent);
    this._mode = Mode.DEFAULT;
    this._cardComponent.recoveryListeners();
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToCard();
    }
  }
}
