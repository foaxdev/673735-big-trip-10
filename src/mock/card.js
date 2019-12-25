import {amenities} from "../const";

let dateDifference = 1;

const Types = [
  `bus`,
  `check-in`,
  `drive`,
  `flight`,
  `restaurant`,
  `ship`,
  `sightseeing`,
  `taxi`,
  `train`,
  `transport`
];

const Cities = [
  `Tokyo`,
  `Osaka`,
  `Sapporo`,
  `Nara`,
  `Fukuoka`,
  `Kyoto`,
  `Kobe`,
  `Kagoshima`,
  `Hiroshima`,
  `Nagoya`,
  `Nisshin`
];

const Descriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

const getRandomType = () => {
  return getRandomArrayItem(Types);
};

const getRandomCity = () => {
  return getRandomArrayItem(Cities);
};

const getRandomPhotos = () => {
  const photos = [];

  for (let i = 0; i < getRandomIntegerNumber(1, 5); i++) {
    photos.push(`http://picsum.photos/300/150?r=${Math.random()}`);
  }

  return photos;
};

const generateRandomDescription = () => {
  return Descriptions
    .filter(() => Math.random() > 0.5)
    .slice(0, getRandomIntegerNumber(1, 3))
    .join(` `)
    .trim();
};

const getRandomAmenities = () => {
  const availableAmenities = [];

  for (let i = 0; i < getRandomIntegerNumber(0, 4); i++) {
    availableAmenities.push(amenities[i]);
  }

  return availableAmenities;
};

const getRandomDate = () => {
  const targetDate = new Date();
  dateDifference *= 1.5;
  targetDate.setDate(targetDate.getDate() + dateDifference);

  return targetDate;
};

let idNumber = 10;

const getId = () => {
  return idNumber--;
};

const generateCard = () => {
  return {
    id: getId(),
    type: getRandomType(),
    city: getRandomCity(),
    photos: getRandomPhotos(),
    description: generateRandomDescription(),
    amenities: getRandomAmenities(),
    start: getRandomDate(),
    end: getRandomDate(),
    price: getRandomIntegerNumber(10, 1000),
    isFavorite: false
  };
};

const generateCards = () => {
  return new Array(10)
    .fill(``)
    .map(generateCard);
};

export const data = generateCards();
