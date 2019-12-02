const getRouteHtml = (routeInfo) => {
  if (routeInfo.length <= 3) {
    return `${routeInfo[0].city} &mdash; ${routeInfo[1].city} &mdash; ${routeInfo[2].city}`;
  }

  return `${routeInfo[0].city} &mdash; ... &mdash; ${routeInfo[routeInfo.length - 1].city}`;
};

export const createRouteTemplate = (routeInfo) => {
  return (`
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getRouteHtml(routeInfo)}</h1>

      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;21</p>
    </div>
  `);
};
