import moment from "moment";
import AbstractComponent from "./abstract-component";
import {createItems} from "../utils/render";

const getPointsBlockHtml = (blockData) => {
  const datetimeDate = moment(blockData.date).format(`YYYY-MM-DD`);
  const date = moment(blockData.date).format(`MMM DD`);

  return (`
    <li class="trip-days__item day">
     <div class="day__info">
        <span class="day__counter">${blockData.counter}</span>
        <time class="day__date" datetime="${datetimeDate}">${date}</time>
      </div>

      <ul class="trip-events__list"></ul>
    </li>
  `);
};

const createPointsTemplate = (blocksData) => {
  return (`
    <ul class="trip-days">
      ${createItems(blocksData, getPointsBlockHtml)}
    </ul>
  `);
};

export default class Points extends AbstractComponent {

  constructor(blocksData) {
    super();
    this._blocksData = blocksData;
  }

  getTemplate() {
    return createPointsTemplate(this._blocksData);
  }

  getContainerByDate(date) {
    const timeElements = this.getElement().querySelectorAll(`time`);

    for (let i = 0; i < timeElements.length; i++) {
      if (timeElements[i].textContent === moment(date).format(`MMM DD`)) {
        return timeElements[i].parentElement.nextElementSibling;
      }
    }

    return null;
  }

  rerender(blocksData) {
    this._blocksData = blocksData;
    this.getElement().innerHTML = ``;
    this.getElement().innerHTML = createItems(blocksData, getPointsBlockHtml);
  }

  hideDayInfos() {
    const dayElements = this.getElement().querySelectorAll(`.day__info`);
    dayElements[0].style.visibility = `hidden`;
    dayElements.forEach((day, index) => {
      if (index !== 0) {
        day.style.display = `none`;
      }
    });
  }

  showDayInfos() {
    const dayElements = this.getElement().querySelectorAll(`.day__info`);
    dayElements[0].style.visibility = `visible`;
    dayElements.forEach((day, index) => {
      if (index !== 0) {
        day.style.display = `block`;
      }
    });
  }

  updateDisplay() {
    const pointContainers = this.getElement().querySelectorAll(`.trip-events__list`);
    pointContainers.forEach((container) => {
      if (container.innerHTML === ``) {
        container.previousElementSibling.style.display = `none`;
      } else {
        container.previousElementSibling.style.display = `block`;
      }
    });
  }
}
