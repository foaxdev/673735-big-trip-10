import Card from "../components/card";
import CardEdit from "../components/card-edit";
import {render, replace} from "../utils/render";
import {Keys} from "../const";

export default class PointController {

  constructor(container, dataChangeHandler) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
  }

  render(pointData) {
    const cardComponent = new Card(pointData);
    const editButton = cardComponent.getElement().querySelector(`.event__rollup-btn`);
    const editCardComponent = new CardEdit(pointData);
    const favButton = editCardComponent.getElement().querySelector(`.event__favorite-btn`);

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

    const onEditButtonClick = () => {
      replaceCardToEdit(cardComponent, editCardComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
      editCardComponent.setSubmitHandler(onSubmitForm);
    };

    editButton.addEventListener(`click`, onEditButtonClick);
    favButton.addEventListener(`click`, () => {
      this._dataChangeHandler(this, pointData, Object.assign({}, pointData, {
        isFavorite: !pointData.isFavorite
      }));
    });

    render(this._container, cardComponent);
  }
}
