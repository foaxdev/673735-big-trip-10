import AbstractSmartComponent from "./abstract-smart-component";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const labelTitleByType = new Map([
  [`bus`, `🚌`],
  [`check-in`, `🏨`],
  [`drive`, `🚗`],
  [`flight`, `✈️`],
  [`restaurant`, `🍴`],
  [`ship`, `🛳`],
  [`sightseeing`, `🏛`],
  [`taxi`, `🚕`],
  [`train`, `🚂`],
  [`transport`, `🚊`]
]);

const renderMoneyChart = (moneyCtx, prices) => {
  let filteredPrices = Array.from(prices).filter(price => price[1] !== 0);
  filteredPrices.sort((a, b) => b[1] - a[1]);

  let filteredTitles = filteredPrices.map(el => Array.from(labelTitleByType).filter(it => it[0] === el[0])).map(arr => arr[0][1]);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: filteredTitles,
      datasets: [{
        data: filteredPrices.map(arr => arr[1]),
        backgroundColor: `#FFFFFF`
      }]
    },
    options: {
      title: {
        display: true,
        text: `MONEY`,
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
          formatter: function(value, context) {
            return filteredPrices.map(arr => arr[1]).map(price => `€ ${price}`)[context.dataIndex];
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

      <div class="statistics__item statistics__item--transport">
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

  rerender() {
    super.rerender();

    this._renderCharts();
  }

  _getMapOfPrices() {
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

    return new Map([
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
    ]);
  }

  _renderCharts() {
    const moneyCtx = this.getElement().querySelector(`.statistics__chart--money`);
    const transportCtx = this.getElement().querySelector(`.statistics__chart--transport`);
    const timeCtx = this.getElement().querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, this._getMapOfPrices());
    //this._transportChart = renderTagsChart(transportCtx, this._points);
    //this._timeChart = renderColorsChart(timeCtx, this._points);
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
