export default class Destinations {

  constructor() {
    this._destinations = [];
  }

  getDestinations() {
    return this._destinations;
  }

  getDescriptionByCity(city) {
    for (let i = 0; i < this._destinations.length; i++) {
      if (this._destinations[i].city === city) {
        return this._destinations[i].description;
      }
    }

    return ` `;
  }

  getPicturesByCity(city) {
    for (let i = 0; i < this._destinations.length; i++) {
      if (this._destinations[i].city === city) {
        return this._destinations[i].photos;
      }
    }

    return [];
  }

  setDestinations(destination) {
    this._destinations = destination;
  }
}
