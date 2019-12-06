import {render, RenderPosition, replace} from "../utils/render";
import Sort from "../components/sort";
import {sortOptions} from "../mock/sort";
import Event from "../components/event";
import Task from "../components/task";
import Card from "../components/card";
import CardEdit from "../components/card-edit";
import {Keys} from "../const";
import Route from "../components/route";

const setSortItemChecked = (sortItem) => {
  const sortItems = document.querySelectorAll(`.trip-sort__input`);

  for (const sortItem of sortItems) {
    if (sortItem.hasAttribute(`checked`)) {
      sortItem.removeAttribute(`checked`);
      break;
    }
  }

  sortItem.setAttribute(`checked`, `checked`);
};

const setEventSortActive = () => {
  const sortItems = document.querySelectorAll(`.trip-sort__input`);
  setSortItemChecked(sortItems[0]);
};

const getTotalSum = (tripPoints) => {
  return tripPoints
    .map((tripPoint) => tripPoint.price)
    .reduce((a, b) => a + b, 0);
};

export default class TripController {
  constructor(container) {
    this._container = container;
  }

  render(cards) {
    const tripRoute = document.querySelector(`.trip-main__trip-info`);
    const totalPrice = document.querySelector(`.trip-info__cost-value`);

    render(this._container, new Sort(sortOptions), RenderPosition.BEFOREEND);
    setEventSortActive();

    render(this._container, new Event(), RenderPosition.BEFOREEND);
    render(this._container, new Task(), RenderPosition.BEFOREEND);

    const eventsList = document.querySelector(`.trip-events__list`);

    cards.forEach((card) => {
      const cardComponent = new Card(card);
      const editButton = cardComponent.getElement().querySelector(`.event__rollup-btn`);
      const editCardComponent = new CardEdit(card);

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

      render(eventsList, cardComponent, RenderPosition.BEFOREEND);
    });
    render(tripRoute, new Route(cards), RenderPosition.AFTERBEGIN);
    totalPrice.textContent = getTotalSum(cards);
  }
}
