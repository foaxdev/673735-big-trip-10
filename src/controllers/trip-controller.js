import {render, RenderPosition, replace} from "../utils/render";
import Sort, {SortType} from "../components/sort";
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
    this._sortComponent = new Sort(sortOptions);
  }

  render(cards) {
    const tripRoute = this._header.querySelector(`.trip-main__trip-info`);
    const totalPrice = this._header.querySelector(`.trip-info__cost-value`);

    render(this._container, this._sortComponent);
    this._sortComponent.setEventSortActive();

    render(this._container, new Event());
    render(this._container, new Task());

    const eventsList = this._container.querySelector(`.trip-events__list`);

    this.renderCards(eventsList, cards);

    render(tripRoute, new Route(cards), RenderPosition.AFTERBEGIN);
    totalPrice.textContent = this.getTotalSum(cards);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedTasks = [];

      switch (sortType) {
        case SortType.TIME:
          sortedTasks = cards.slice().sort((a, b) => b.start - a.start);
          break;
        case SortType.PRICE:
          sortedTasks = cards.slice().sort((a, b) => b.price - a.price);
          break;
        default:
          sortedTasks = cards.slice(0);
          break;
      }

      eventsList.innerHTML = ``;

      this.renderCards(eventsList, sortedTasks);
    });
  }

  renderCards(container, cards) {
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

      render(container, cardComponent);
    });
  }

  getTotalSum(tripPoints) {
    return tripPoints
      .map((tripPoint) => tripPoint.price)
      .reduce((a, b) => a + b, 0);
  }
}
