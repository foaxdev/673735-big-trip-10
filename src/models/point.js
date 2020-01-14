export default class Point {

  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.price = data[`base_price`];
    this.start = new Date(data[`date_from`]);
    this.end = new Date(data[`date_to`]);
    this.city = data[`destination`][`name`];
    this.photos = data[`destination`][`pictures`];
    this.description = data[`destination`][`description`];
    this.amenities = data[`offers`];
  }

  toRAW() {
    return {
      'id': this.id,
      'type': this.type,
      'is_favorite': this.isFavorite,
      'base_price': this.price,
      'date_from': this.start.toISOString(),
      'date_to': this.end.toISOString(),
      'destination': {"description": this.description, "name": this.city, "pictures": this.photos},
      'offers': this.amenities
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
