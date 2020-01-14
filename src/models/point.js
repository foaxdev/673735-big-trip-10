export default class Point {

  constructor(data) {
    this.id = data[`id`];
  }

  toRAW() {
    return {
      'id': this.id
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
