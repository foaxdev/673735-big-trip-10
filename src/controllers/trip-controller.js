import {render, RenderPosition, replace} from "../utils/render";
import Sort from "../components/sort";
import {sortOptions} from "../mock/sort";
import Event from "../components/event";
import Task from "../components/task";
import Card from "../components/card";
import CardEdit from "../components/card-edit";
import {Keys} from "../const";
import Route from "../components/route";

export default class TripController {
  constructor(container, header) {
    this._container = container;
    this._header = header;
  }

  render(cards) {
    const tripRoute = this._header.querySelector(`.trip-main__trip-info`);
    const totalPrice = this._header.querySelector(`.trip-info__cost-value`);

    render(this._container, new Sort(sortOptions));
    this.setEventSortActive();

    render(this._container, new Event());
    render(this._container, new Task());

    const eventsList = this._container.querySelector(`.trip-events__list`);

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

      render(eventsList, cardComponent);
    });
    render(tripRoute, new Route(cards), RenderPosition.AFTERBEGIN);
    totalPrice.textContent = this.getTotalSum(cards);
  }

  setSortItemChecked(sortItem) {
    const sortItems = this._container.querySelectorAll(`.trip-sort__input`);

    for (const sortItem of sortItems) {
      if (sortItem.hasAttribute(`checked`)) {
        sortItem.removeAttribute(`checked`);
        break;
      }
    }

    sortItem.setAttribute(`checked`, `checked`);
  }

  setEventSortActive() {
    const sortItems = this._container.querySelectorAll(`.trip-sort__input`);
    this.setSortItemChecked(sortItems[0]);
  }

  getTotalSum(tripPoints) {
    return tripPoints
      .map((tripPoint) => tripPoint.price)
      .reduce((a, b) => a + b, 0);
  }
}
