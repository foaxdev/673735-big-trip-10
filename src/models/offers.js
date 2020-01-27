export default class Offers {

  constructor() {
    this._offers = [];
  }

  getOffersByType(type) {
    for (let i = 0, offer = this._offers[i]; i < this._offers.length; i++) {
      if (offer.type === type) {
        return offer.offers;
      }
    }
    return [];
  }

  setOffers(offers) {
    this._offers = offers;
  }
}
