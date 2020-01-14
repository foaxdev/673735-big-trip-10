export const Keys = {
  ESCAPE: `Escape`
};

export const MONTHS = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`];
export const TIP_MESSAGE = `Click New Event to create your first point`;

export const actionByType = new Map([
    [`taxi`, `Taxi to`],
    [`bus`, `Bus to`],
    [`train`, `Train to`],
    [`ship`, `Ship to`],
    [`transport`, `Transport to`],
    [`drive`, `Drive to`],
    [`flight`, `Flight to`],
    [`check-in`, `Check-in in`],
    [`sightseeing`, `Sightseeing in`],
    [`restaurant`, `Restaurant in`]
]);

export const amenities = [
  {
    type: `luggage`,
    title: `Add luggage`,
    price: 10
  },
  {
    type: `comfort`,
    title: `Switch to comfort class`,
    price: 150
  },
  {
    type: `meal`,
    title: `Add meal`,
    price: 2
  },
  {
    type: `seats`,
    title: `Choose seats`,
    price: 9
  },
  {
    type: `train`,
    title: `Travel by train`,
    price: 40
  }
];

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const HIDDEN_CLASS = `visually-hidden`;
export const AUTHORIZATION = `Basic eo0w560ik56889a`;
