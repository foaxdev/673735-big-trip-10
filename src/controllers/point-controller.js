import Card from "../components/card";
import CardEdit from "../components/card-edit";
import {render, replace} from "../utils/render";
import {actionByType, Keys} from "../const";

export default class PointController {

  constructor(container, dataChangeHandler) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
  }

  render(pointData) {
    const cardComponent = new Card(pointData);
    const editButton = cardComponent.getElement().querySelector(`.event__rollup-btn`);
    const editCardComponent = new CardEdit(pointData);
    const actionTypes = document.querySelectorAll(`.event__type-input`);

    const replaceCardToEdit = (cardComponent, editCardComponent) => {
      replace(editCardComponent, cardComponent);
    };

    const replaceEditToCard = (cardComponent, editCardComponent) => {
      replace(cardComponent, editCardComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === Keys.ESCAPE) {
        replaceEditToCard(cardComponent, editCardComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const onSubmitForm = (evt) => {
      evt.preventDefault();
      replaceEditToCard(cardComponent, editCardComponent);
      editCardComponent.removeSubmitHandler(onSubmitForm);
      // TODO: send form
    };

    const changeEventPlaceholder = (type) => {
      const eventLabel = editCardComponent.getElement().querySelector(`.event__label`);
      eventLabel.textContent = actionByType.get(type);
    };

    const onActionTypeChange = (evt) => {
      changeEventPlaceholder(evt.target.value);
      actionTypes.forEach((actionType) => {
        actionType.removeEventListener(`click`, onActionTypeChange);
      });
    };

    const onEditButtonClick = () => {
      replaceCardToEdit(cardComponent, editCardComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
      editCardComponent.setSubmitHandler(onSubmitForm);

      actionTypes.forEach((actionType) => {
        actionType.addEventListener(`click`, onActionTypeChange);
      });

      const favButton = editCardComponent.getElement().querySelector(`.event__favorite-btn`);
      favButton.addEventListener(`click`, () => {
        this._dataChangeHandler(
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

    render(this._container, cardComponent);
  }
}
