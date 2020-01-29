export default class Destinations {

  constructor() {
    this._destinations = [];
  }

  getDestinations() {
    return this._destinations;
  }

  getDescriptionByCity(city) {
    for (let i = 0, destination = this._destinations[0]; i < this._destinations.length; i++, destination = this._destinations[i]) {
      if (destination.city === city) {
        return destination.description;
      }
    }

    return ` `;
  }

  getPicturesByCity(city) {
    for (let i = 0, destination = this._destinations[0]; i < this._destinations.length; i++, destination = this._destinations[i]) {
      if (destination.city === city) {
        return destination.photos;
      }
    }

    return [];
  }

  setDestinations(destination) {
    this._destinations = destination;
  }
}
