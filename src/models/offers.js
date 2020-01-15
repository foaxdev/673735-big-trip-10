export default class Offers {

  constructor() {
    this._offers = [];
  }

  getOffersByType(type) {
    for (let i = 0; i < this._offers.length; i++) {
      if (this._offers[i].type === type) {
        return this._offers[i].offers;
      }
    }
    return [];
  }

  setOffers(offers) {
    this._offers = offers;
  }
}
