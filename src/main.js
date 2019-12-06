import Menu from "./components/menu";
import Route from "./components/route";
import Sort from "./components/sort";
import Card from "./components/card";
import Event from "./components/event";
import Task, {TASK_COUNT} from "./components/task";
import {generateCards} from "./mock/card";
import {menuNames} from "./mock/menu";
import {filters} from "./mock/filter";
import {sortOptions} from "./mock/sort";
import Filter from "./components/filter";
import {render} from "./utils";
import CardEdit from "./components/card-edit";
import {Keys, RenderPosition, TIP_MESSAGE} from "./const";
import Tip from "./components/tip";

const setMenuItemActive = (menuElement) => {
  const menuItems = document.querySelectorAll(`.trip-tabs__btn`);

  for (const menuItem of menuItems) {
    if (menuItem.classList.contains(`trip-tabs__btn--active`)) {
      menuItem.classList.remove(`trip-tabs__btn--active`);
      break;
    }
  }

  menuElement.classList.add(`trip-tabs__btn--active`);
};

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

const setStatsMenuActive = () => {
  const menuItems = document.querySelectorAll(`.trip-tabs__btn`);
  setMenuItemActive(menuItems[1]);
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

const addCards = () => {
  render(tripEvents, new Sort(sortOptions).getElement(), RenderPosition.BEFOREEND);
  setEventSortActive();

  render(tripEvents, new Event().getElement(), RenderPosition.BEFOREEND);
  render(tripEvents, new Task().getElement(), RenderPosition.BEFOREEND);

  const eventsList = document.querySelector(`.trip-events__list`);

  const cards = generateCards(TASK_COUNT).sort((a, b) => a.start > b.start);

  cards.forEach((card) => {
    const cardElement = new Card(card).getElement();
    const editButton = cardElement.querySelector(`.event__rollup-btn`);
    const editCard = new CardEdit(card).getElement();

    const replaceCardToEdit = (card, editCard) => {
      eventsList.replaceChild(editCard, card);
    };

    const replaceEditToCard = (card, editCard) => {
      eventsList.replaceChild(card, editCard);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === Keys.ESCAPE) {
        replaceEditToCard(cardElement, editCard);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const onSubmitForm = (evt) => {
      evt.preventDefault();
      replaceEditToCard(cardElement, editCard);
      editCard.removeEventListener(`submit`, onSubmitForm);
      // TODO: send form
    };

    editButton.addEventListener(`click`, () => {
      replaceCardToEdit(cardElement, editCard);
      document.addEventListener(`keydown`, onEscKeyDown);
      editCard.addEventListener(`submit`, onSubmitForm);
    });

    render(eventsList, cardElement, RenderPosition.BEFOREEND);
  });
  render(tripRoute, new Route(cards).getElement(), RenderPosition.AFTERBEGIN);
  totalPrice.textContent = getTotalSum(cards);
};

const addMessageToEmptyRoute = () => {
  render(tripEvents, new Tip(TIP_MESSAGE).getElement(), RenderPosition.BEFOREEND);
};

const tripControls = document.querySelector(`.trip-main__trip-controls`);
const menuHeader = tripControls.querySelectorAll(`h2`)[0];
const filterHeader = tripControls.querySelectorAll(`h2`)[1];
const tripRoute = document.querySelector(`.trip-main__trip-info`);
const tripEvents = document.querySelector(`.trip-events`);
const totalPrice = document.querySelector(`.trip-info__cost-value`);

render(menuHeader, new Menu(menuNames).getElement(), RenderPosition.AFTEREND);
setStatsMenuActive();

render(filterHeader, new Filter(filters).getElement(), RenderPosition.AFTEREND);

if (TASK_COUNT > 0) {
  addCards();
} else {
  addMessageToEmptyRoute();
}
