import AbstractComponent from "./abstract-component";

const createTipTemplate = (message) => {
  return (`
    <p class="trip-events__msg">${message}</p>
  `);
};

export default class Tip extends AbstractComponent {

  constructor(message) {
    super();
    this._message = message;
  }

  getTemplate() {
    return createTipTemplate(this._message);
  }
}
