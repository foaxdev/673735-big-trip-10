export const createRouteTemplate = (routeInfo) => {
  const startCity = routeInfo[0].city;
  const endCity = routeInfo[routeInfo.length - 1].city;

  return (`
    <div class="trip-info__main">
      <h1 class="trip-info__title">${startCity} &mdash; ... &mdash; ${endCity}</h1>

      <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;21</p>
    </div>
  `);
};
