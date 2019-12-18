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
    const editButton = this._cardComponent.getElement().querySelector(`.event__rollup-btn`);
    this._editCardComponent = new CardEdit(pointData);
    const actionTypes = document.querySelectorAll(`.event__type-input`);

    const onEscKeyDown = (evt) => {
      if (evt.key === Keys.ESCAPE) {
        this._replaceEditToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const onSubmitForm = (evt) => {
      evt.preventDefault();
      this._replaceEditToCard();
      this._editCardComponent.removeSubmitHandler(onSubmitForm);
      // TODO: send form
    };

    const changeEventPlaceholder = (type) => {
      const eventLabel = this._editCardComponent.getElement().querySelector(`.event__label`);
      eventLabel.textContent = actionByType.get(type);
    };

    const onActionTypeChange = (evt) => {
      changeEventPlaceholder(evt.target.value);
      actionTypes.forEach((actionType) => {
        actionType.removeEventListener(`click`, onActionTypeChange);
      });
    };

    const onEditButtonClick = () => {
      this._replaceCardToEdit();
      this._editCardComponent.setAddedAmenities(this._editCardComponent.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
      this._editCardComponent.setSubmitHandler(onSubmitForm);

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
    };

    editButton.addEventListener(`click`, onEditButtonClick);

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
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToCard();
    }
  }
}
