export default class Destination {

  constructor(data) {
    this.description = data[`description`];
    this.city = data[`name`];
    this.photos = data[`pictures`];
  }

  toRAW() {
    return {
      'description': this.description,
      'name': this.city,
      'pictures': this.photos
    };
  }

  static parseDestination(data) {
    return new Destination(data);
  }

  static parseDestinations(data) {
    return data.map(Destination.parseDestination);
  }
}
