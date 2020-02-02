import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const labelTitleByType = [
  [`bus`, `🚌`],
  [`check-in`, `🏨`],
  [`drive`, `🚗`],
  [`flight`, `✈️`],
  [`restaurant`, `🍴`],
  [`ship`, `🛳`],
  [`sightseeing`, `🏛`],
  [`taxi`, `🚕`],
  [`train`, `🚂`],
  [`transport`, `🚊`],
  [`ride`, `🚕`]
];

const renderChart = (ctx, chartData, title, formatLabel) => {
  const filteredData = chartData.sort((a, b) => b[1] - a[1]);
  const filteredTitles = filteredData
                            .map((el) => labelTitleByType
                            .filter((it) => it[0] === el[0]))
                            .map((arr) => arr[0][1]);

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: filteredTitles,
      datasets: [{
        maxBarThickness: 40,
        barThickness: 40,
        minBarLength: 50,
        data: filteredData.map((arr) => arr[1]),
        backgroundColor: `#FFFFFF`
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: title,
        fontSize: 22,
        backgroundColor: `transparent`,
        position: `left`,
        fontColor: `#000000`
      },
      legend: {
        display: false
      },
      plugins: {
        datalabels: {
          formatter: (value, context) => {
            return filteredData.map((arr) => arr[1]).map((it) => formatLabel(it))[context.dataIndex];
          },
          font: {
            size: 16,
            weight: `bold`
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`
        }
      },
      tooltips: {
        enabled: false
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            display: false
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return (`
    <section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport" style="height:200px;">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>
  `);
};

export default class Statistics extends AbstractSmartComponent {

  constructor(points) {
    super();

    this._points = points;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  recoveryListeners() {}

  show() {
    super.show();

    this.rerender();
  }

  set pointsData(newPointsData) {
    this._points = newPointsData;
  }

  rerender() {
    super.rerender();

    this._renderCharts();
  }

  _getArrayOfPrices() {
    let busPrice = 0;
    let checkInPrice = 0;
    let drivePrice = 0;
    let flightPrice = 0;
    let restaurantPrice = 0;
    let shipPrice = 0;
    let sightseeingPrice = 0;
    let taxiPrice = 0;
    let trainPrice = 0;
    let transportPrice = 0;

    for (let i = 0; i < this._points.length; i++) {
      switch (this._points[i].type) {
        case `bus`:
          busPrice += this._points[i].price;
          break;
        case `check-in`:
          checkInPrice += this._points[i].price;
          break;
        case `drive`:
          drivePrice += this._points[i].price;
          break;
        case `flight`:
          flightPrice += this._points[i].price;
          break;
        case `restaurant`:
          restaurantPrice += this._points[i].price;
          break;
        case `ship`:
          shipPrice += this._points[i].price;
          break;
        case `sightseeing`:
          sightseeingPrice += this._points[i].price;
          break;
        case `taxi`:
          taxiPrice += this._points[i].price;
          break;
        case `train`:
          trainPrice += this._points[i].price;
          break;
        case `transport`:
          transportPrice += this._points[i].price;
          break;
      }
    }

    return [
      [`bus`, busPrice],
      [`check-in`, checkInPrice],
      [`drive`, drivePrice],
      [`flight`, flightPrice],
      [`restaurant`, restaurantPrice],
      [`ship`, shipPrice],
      [`sightseeing`, sightseeingPrice],
      [`taxi`, taxiPrice],
      [`train`, trainPrice],
      [`transport`, transportPrice]
    ].filter((price) => price[1] !== 0);
  }

  _getArrayOfTransport() {
    let driveTransport = 0; // bus, taxi, train
    let flightTransport = 0;
    let shipTransport = 0;
    let rideTransport = 0; // transport, drive

    for (let i = 0; i < this._points.length; i++) {
      switch (this._points[i].type) {
        case `bus`:
          driveTransport++;
          break;
        case `drive`:
          rideTransport++;
          break;
        case `flight`:
          flightTransport++;
          break;
        case `ship`:
          shipTransport++;
          break;
        case `taxi`:
          driveTransport++;
          break;
        case `train`:
          driveTransport++;
          break;
        case `transport`:
          rideTransport++;
          break;
      }
    }

    return [
      [`drive`, driveTransport],
      [`flight`, flightTransport],
      [`ship`, shipTransport],
      [`ride`, rideTransport]
    ].filter((transportQuantity) => transportQuantity[1] !== 0);
  }

  _getHours(index) {
    return Math.floor((this._points[index].end - this._points[index].start) / (1000 * 60 * 60));
  }

  _getArrayOfTime() {
    let busTime = 0;
    let checkInTime = 0;
    let driveTime = 0;
    let flightTime = 0;
    let restaurantTime = 0;
    let shipTime = 0;
    let sightseeingTime = 0;
    let taxiTime = 0;
    let trainTime = 0;
    let transportTime = 0;

    for (let i = 0; i < this._points.length; i++) {
      switch (this._points[i].type) {
        case `bus`:
          busTime += this._getHours(i);
          break;
        case `check-in`:
          checkInTime += this._getHours(i);
          break;
        case `drive`:
          driveTime += this._getHours(i);
          break;
        case `flight`:
          flightTime += this._getHours(i);
          break;
        case `restaurant`:
          restaurantTime += this._getHours(i);
          break;
        case `ship`:
          shipTime += this._getHours(i);
          break;
        case `sightseeing`:
          sightseeingTime += this._getHours(i);
          break;
        case `taxi`:
          taxiTime += this._getHours(i);
          break;
        case `train`:
          trainTime += this._getHours(i);
          break;
        case `transport`:
          transportTime += this._getHours(i);
          break;
      }
    }

    return [
      [`bus`, busTime],
      [`check-in`, checkInTime],
      [`drive`, driveTime],
      [`flight`, flightTime],
      [`restaurant`, restaurantTime],
      [`ship`, shipTime],
      [`sightseeing`, sightseeingTime],
      [`taxi`, taxiTime],
      [`train`, trainTime],
      [`transport`, transportTime]
    ].filter((time) => time[1] !== 0);
  }

  _renderCharts() {
    const moneyCtx = this.element.querySelector(`.statistics__chart--money`);
    const transportCtx = this.element.querySelector(`.statistics__chart--transport`);
    const timeCtx = this.element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderChart(
        moneyCtx,
        this._getArrayOfPrices(),
        `MONEY`,
        (it) => `€ ${it}`
    );
    this._transportChart = renderChart(
        transportCtx,
        this._getArrayOfTransport(),
        `TRANSPORT`,
        (it) => {
          return `${it}x`;
        }
    );
    this._timeChart = renderChart(
        timeCtx,
        this._getArrayOfTime(),
        `TIME SPENT`,
        (it) => `${it}H`
    );
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }
}
