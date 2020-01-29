import {getPointsByFilter} from "../utils/filter";
import {FilterType} from "../const";

export default class Points {

  constructor() {
    this._points = [];
    this._activeFilterType = FilterType.EVERYTHING;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getPoints() {
    return getPointsByFilter(this._points, this._activeFilterType);
  }

  getNewId() {
    const ids = [];

    for (let i = 0, point = this._points[0]; i < this._points.length; i++, point = this._points[i]) {
      ids.push(point.id);
    }

    ids.sort((a, b) => b - a);

    return parseInt(ids[0], 10) + 1;
  }

  setPoints(points) {
    this._points = points;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  addPoint(point) {
    this._points = [].concat(point, this._points);
    this._callHandlers(this._dataChangeHandlers);
  }

  removePoint(id) {
    return this._remove(this._getIndex(id), null);
  }

  updatePoint(id, point) {
    return this._remove(this._getIndex(id), point);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _remove(index, point) {
    if (index === -1) {
      return false;
    }

    if (point) {
      this._points = [].concat(this._points.slice(0, index), point, this._points.slice(index + 1));
    } else {
      this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));
    }
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  _getIndex(id) {
    return this._points.findIndex((pointItem) => pointItem.id === id);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
