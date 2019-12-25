import {FilterType} from "../const";

export const getPastPoints = (points, nowDate) => {
  return points.filter((point) => point.start < nowDate);
};

export const getFuturePoints = (points, nowDate) => {
  return points.filter((point) => point.start >= nowDate);
};

export const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.PAST:
      return getPastPoints(points, nowDate);
    case FilterType.FUTURE:
      return getFuturePoints(points, nowDate);
    default:
      return points;
  }
};
