import {MONTHS} from "../const";
import AbstractComponent from "./abstract-component";

const ROUTE_POINTS_MAX_QUANTITY = 3;

const getRouteHtml = (routeInfo) => {
  if (routeInfo.length <= ROUTE_POINTS_MAX_QUANTITY) {
    let resultRoute = typeof routeInfo[0].city !== `undefined` || routeInfo[0].city ? routeInfo[0].city : ``;
    for (let i = 0; i < routeInfo.length; i++) {
      if (i === 0) {
        continue;
      }
      resultRoute += ` &mdash; ${routeInfo[i].city}`;
    }
    return resultRoute;
  }

  return `${routeInfo[0].city} &mdash; ... &mdash; ${routeInfo[routeInfo.length - 1].city}`;
};

const getDatesHtml = (routeInfo) => {
  const startYear = routeInfo[0].start.getFullYear();
  const startMonth = routeInfo[0].start.getMonth();
  const startDay = routeInfo[0].start.getDate();

  const endYear = routeInfo[routeInfo.length - 1].end.getFullYear();
  const endMonth = routeInfo[routeInfo.length - 1].end.getMonth();
  const endDay = routeInfo[routeInfo.length - 1].end.getDate();

  if (startMonth === endMonth) {
    return (startYear === endYear) ? `${startYear} ${MONTHS[startMonth]} ${startDay}&nbsp;&mdash;&nbsp;${endDay}` : `${startYear} ${MONTHS[startMonth]} ${startDay}&nbsp;&mdash;&nbsp;${startYear} ${endDay}`;
  }

  return (startYear === endYear) ? `${startYear} ${MONTHS[startMonth]} ${startDay}&nbsp;&mdash;&nbsp;${MONTHS[endMonth]} ${endDay}` : `${startYear} ${MONTHS[startMonth]} ${startDay}&nbsp;&mdash;&nbsp;${startYear} ${MONTHS[endMonth]} ${endDay}`;
};

const createRouteTemplate = (routeInfo) => {
  return (`
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getRouteHtml(routeInfo)}</h1>

      <p class="trip-info__dates">${getDatesHtml(routeInfo)}</p>
    </div>
  `);
};

export default class Route extends AbstractComponent {

  constructor(routeInfo) {
    super();
    this._routeInfo = routeInfo;
  }

  getTemplate() {
    return createRouteTemplate(this._routeInfo);
  }
}
