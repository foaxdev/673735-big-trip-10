import Filter from "../components/filter";
import {render, RenderPosition, replace} from "../utils/render";

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

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const oldComponent = this._filterComponent;
    this._filterComponent = new Filter(FILTERS);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(this._container, this._filterComponent, RenderPosition.AFTEREND);
    }
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
  }

  _onDataChange() {
    this.render();
  }
}
