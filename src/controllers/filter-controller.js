import Filter from "../components/filter";
import {render, RenderPosition, replace} from "../utils/render";
import {FilterType} from "../const";

const FILTERS = [
  `everything`,
  `future`,
  `past`
];

export default class FilterController {

  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.addDataChangeHandler(this._onDataChange);
  }

  render() {
    const oldComponent = this._filterComponent;
    this._filterComponent = new Filter(FILTERS);
    this._filterComponent.setupFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(this._container, this._filterComponent, RenderPosition.AFTEREND);
    }

    this._disableFilters();
  }

  _onFilterChange(filterType) {
    this._pointsModel.activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
    this._disableFilters();
  }

  _disableFilters() {
    this._filterComponent.unableAllFilters();

    if (this._pointsModel.getPointsQuantityByFilterType(FilterType.FUTURE) === 0) {
      this._filterComponent.makeFilterUnable(FilterType.FUTURE);
    }

    if (this._pointsModel.getPointsQuantityByFilterType(FilterType.PAST) === 0) {
      this._filterComponent.makeFilterUnable(FilterType.PAST);
    }
  }
}
