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
  }

  render(pointData) {
    this._cardComponent = new Card(pointData);
    this._editCardComponent = new CardEdit(pointData);
    const actionTypes = document.querySelectorAll(`.event__type-input`);
    let currentType = null;

    const onEscKeyDown = (evt) => {
      if (evt.key === Keys.ESCAPE) {
        this._replaceEditToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const onSubmitForm = (evt) => {
      evt.preventDefault();
      this._editCardComponent.removeSubmitHandler(onSubmitForm);
      this._replaceEditToCard();
      this._onDataChange(
        this._cardComponent,
        Object.assign(
          {},
          pointData,
          { type: `${currentType !== null ? currentType : pointData.type}` }
        ),
        pointData
      );
    };

    const changeEventPlaceholder = (type) => {
      const eventLabel = this._editCardComponent.getElement().querySelector(`.event__label`);
      eventLabel.textContent = actionByType.get(type);
    };

    const closeActionTypesList = () => {
      const actionTypesToggle = document.querySelector(`.event__type-toggle`);
      actionTypesToggle.checked = false;
    };

    const changeActionTypeIcon = (type) => {
      const eventIcon = this._editCardComponent.getElement().querySelector(`.event__type-icon`);
      eventIcon.src = `img/icons/${type}.png`;
    };

    const onActionTypeChange = (evt) => {
      changeEventPlaceholder(evt.target.value);
      changeActionTypeIcon(evt.target.value);
      currentType = evt.target.value;
      closeActionTypesList();
    };

    this._cardComponent.setEditButtonClickHandler(() => {
      this._replaceCardToEdit();
      this._editCardComponent.setAddedAmenities(this._editCardComponent.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
      this._editCardComponent.setSubmitHandler(onSubmitForm);

      const eventTypeButton = this._editCardComponent.getElement().querySelector(`.event__type`);
      eventTypeButton.addEventListener(`click`, () => {
        this._editCardComponent.setSelectedActionType(this._editCardComponent.getElement());
      });

      actionTypes.forEach((actionType) => {
        actionType.addEventListener(`click`, onActionTypeChange);
      });

      const favButton = this._editCardComponent.getElement().querySelector(`.event__favorite-btn`);
      favButton.addEventListener(`click`, () => {
        this._onDataChange(
          this,
          pointData,
          Object.assign(
            {},
            pointData,
            { isFavorite: !pointData.isFavorite }
          )
        );
      });
    });

    render(this._container, this._cardComponent);
  }

  _replaceCardToEdit() {
    this._onViewChange();
    replace(this._editCardComponent, this._cardComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToCard() {
    this._editCardComponent.getElement().reset();
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
