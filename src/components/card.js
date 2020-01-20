import moment from "moment";
import {actionByType} from "../const";
import {createItems} from "../utils/render";
import AbstractSmartComponent from "./abstract-smart-component";
import {formatDuration} from "../utils/format";

const getOfferHtml = (offer) => {
  return (`
    <li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
     </li>
  `);
};

const createCardTemplate = (cardData) => {
  const {type, amenities, start, end, price, city} = cardData;

  const prefixForActivity = actionByType.get(type);

  const startDatetime = moment(start).format(`YYYY-MM-DDThh:mm:ss`);
  const endDatetime = moment(end).format(`YYYY-MM-DDThh:mm:ss`);

  const startTime = moment(start).format(`HH:mm`);
  const endTime = moment(end).format(`HH:mm`);

  const duration = formatDuration(end.getTime() - start.getTime());

  return (`
    <li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${prefixForActivity} ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${startDatetime}">${startTime}</time>
            &mdash;
            <time class="event__end-time" datetime="${endDatetime}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
           ${amenities.length > 0 ? createItems(amenities, getOfferHtml) : ``}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
};

export default class Card extends AbstractSmartComponent {

  constructor(cardData) {
    super();
    this._cardData = cardData;
    this._onEditButton = null;
  }

  getTemplate() {
    return createCardTemplate(this._cardData);
  }

  setNewData(newData) {
    this._cardData = newData;
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
    this._onEditButton = handler;
  }

  recoveryListeners() {
    this.setEditButtonClickHandler(this._onEditButton);
  }
}
