import Point from "../models/point";

const getSyncedPoints =
  (items) => items.filter(({success}) => success).map(({payload}) => payload.point);

export default class Provider {

  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  getPoints() {
    if (this._isOnLine()) {
      return this._api.getPoints().then(
          (points) => {
            points.forEach((point) => this._store.setItem(point.id, point.toRAW()));
            return points;
          }
      );
    }

    const storePoints = Object.values(this._store.getAll());

    this._isSynchronized = false;

    return Promise.resolve(Point.parsePoints(storePoints));
  }

  getDestinations() {
    if (this._isOnLine()) {
      return this._api.getDestinations().then(
          (destinations) => {
            window.localStorage.setItem(`destinations`, JSON.stringify(destinations));
            return destinations;
          }
      );
    }
    return Promise.resolve(JSON.parse(window.localStorage.getItem(`destinations`)));
  }

  getOffers() {
    if (this._isOnLine()) {
      return this._api.getOffers().then(
          (offers) => {
            window.localStorage.setItem(`offers`, JSON.stringify(offers));
            return offers;
          }
      );
    }
    return Promise.resolve(JSON.parse(window.localStorage.getItem(`offers`)));
  }

  addPoint(point) {
    if (this._isOnLine()) {
      return this._api.addPoint(point).then(
          (newPoint) => {
            this._store.setItem(newPoint.id, newPoint.toRAW());
            return newPoint;
          }
      );
    }

    const fakeNewPoint = Point.parsePoint(Object.assign({}, point.toRAW()));

    this._isSynchronized = false;
    this._store.setItem(fakeNewPoint.id, Object.assign({}, fakeNewPoint.toRAW(), {offline: true}));

    return Promise.resolve(fakeNewPoint);
  }

  updatePoint(id, point) {
    if (this._isOnLine()) {
      return this._api.updatePoint(id, point).then(
          (newPoint) => {
            this._store.setItem(newPoint.id, newPoint.toRAW());
            return newPoint;
          }
      );
    }

    const fakeUpdatedPoint = Point.parsePoint(Object.assign({}, point.toRAW(), {id}));

    this._isSynchronized = false;
    this._store.setItem(id, Object.assign({}, fakeUpdatedPoint.toRAW(), {offline: true}));

    return Promise.resolve(fakeUpdatedPoint);
  }

  deletePoint(id) {
    if (this._isOnLine()) {
      return this._api.deletePoint(id).then(
          () => {
            this._store.removeItem(id);
          }
      );
    }

    this._isSynchronized = false;
    this._store.removeItem(id);

    return Promise.resolve();
  }

  sync() {
    if (this._isOnLine()) {
      const storePoints = Object.values(this._store.getAll());

      return this._api.sync(storePoints)
        .then((response) => {
          storePoints.filter((point) => point.offline).forEach((point) => {
            this._store.removeItem(point.id);
          });

          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          [...createdPoints, ...updatedPoints].forEach((point) => {
            this._store.setItem(point.id, point);
          });

          this._isSynchronized = true;

          return Promise.resolve();
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
