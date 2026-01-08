# Trendline

[![npm version](https://img.shields.io/npm/v/trendline.svg)](https://www.npmjs.com/package/trendline)
[![npm downloads](https://img.shields.io/npm/dm/trendline.svg)](https://www.npmjs.com/package/trendline)
[![bundle size](https://img.shields.io/bundlephobia/minzip/trendline)](https://bundlephobia.com/package/trendline)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Add trend lines to any chart. ~1KB gzipped, zero dependencies, works with your data format.

```
    │
  8 │          ●    .---●
    │        ●  .--'
  4 │       .-●'
    │    ●-'
  0 └───────────────────
    0    1    2    3    4

    ●  actual data
    -  trend line (calculated)
```

**[Try it on StackBlitz](https://stackblitz.com/edit/trendline-demo)** · [npm](https://www.npmjs.com/package/trendline) · [GitHub](https://github.com/heofs/trendline)

## Why Trendline?

- **~1KB minified + gzipped** — smaller than most icons
- **Zero dependencies** — nothing to audit, no supply chain risk
- **Works with your data** — pass your objects directly, no array conversion
- **TypeScript native** — full type safety built-in, no `@types` needed
- **Universal** — ESM, CommonJS, browser, Node.js all supported
- **R² included** — know how well your trend line fits the data

## Install

```bash
npm install trendline
```

## Quick Start

```js
import { createTrend } from 'trendline';

const data = [
  { month: 1, revenue: 120 },
  { month: 2, revenue: 150 },
  { month: 3, revenue: 170 },
  { month: 4, revenue: 200 },
];

// Pass your data with the key names you're already using
const trend = createTrend(data, 'month', 'revenue');

console.log(trend.slope);     // 26.5 (revenue increases ~26.5 per month)
console.log(trend.yStart);    // 96.5 (projected revenue at month 0)
console.log(trend.rSquared);  // 0.99 (excellent fit!)
console.log(trend.calcY(12)); // 414.5 (predicted revenue at month 12)
```

## Use Cases

- **Sales forecasting** — project future revenue from historical data
- **Stock/crypto trends** — visualize price direction
- **Fitness tracking** — show weight loss/gain trends over time
- **Performance metrics** — CPU usage, response times, error rates
- **Sensor data** — temperature, humidity, pressure trends
- **Any time-series data** — if you can plot it, you can trend it

## Works With

[D3.js](https://d3js.org/) · [Recharts](https://recharts.org/) · [Chart.js](https://www.chartjs.org/) · [Victory](https://formidable.com/open-source/victory/) · [Nivo](https://nivo.rocks/) · [ECharts](https://echarts.apache.org/) · [Plotly](https://plotly.com/javascript/) · [Highcharts](https://www.highcharts.com/) · Canvas · SVG · or any visualization library

---

## Examples

### Recharts (React)

```jsx
import { createTrend } from 'trendline';
import { LineChart, Line, XAxis, YAxis } from 'recharts';

function SalesChart({ data }) {
  const trend = createTrend(data, 'day', 'sales');

  // Only need two points to draw a straight line
  const trendLine = [
    { day: data[0].day, sales: trend.calcY(data[0].day) },
    { day: data.at(-1).day, sales: trend.calcY(data.at(-1).day) },
  ];

  return (
    <LineChart width={600} height={300} data={data}>
      <XAxis dataKey="day" />
      <YAxis />
      <Line dataKey="sales" stroke="#8884d8" />
      <Line
        data={trendLine}
        dataKey="sales"
        stroke="#ff7300"
        strokeDasharray="5 5"
        dot={false}
      />
    </LineChart>
  );
}
```

### D3.js

```js
import { createTrend } from 'trendline';
import * as d3 from 'd3';

const data = [
  { date: 1, price: 100 },
  { date: 2, price: 120 },
  { date: 3, price: 115 },
  { date: 4, price: 140 },
  { date: 5, price: 150 },
];

const trend = createTrend(data, 'date', 'price');

// Your existing scales
const x = d3.scaleLinear().domain([1, 5]).range([0, width]);
const y = d3.scaleLinear().domain([80, 160]).range([height, 0]);

// Add trend line
svg.append('line')
  .attr('x1', x(1))
  .attr('y1', y(trend.calcY(1)))
  .attr('x2', x(5))
  .attr('y2', y(trend.calcY(5)))
  .attr('stroke', '#ff7300')
  .attr('stroke-dasharray', '5,5');
```

### Chart.js

```js
import { createTrend } from 'trendline';
import Chart from 'chart.js/auto';

const data = [
  { x: 1, y: 10 },
  { x: 2, y: 15 },
  { x: 3, y: 13 },
  { x: 4, y: 17 },
];

const trend = createTrend(data, 'x', 'y');

new Chart(ctx, {
  type: 'scatter',
  data: {
    datasets: [
      { label: 'Data', data },
      {
        label: `Trend (R²=${trend.rSquared.toFixed(2)})`,
        data: [
          { x: 1, y: trend.calcY(1) },
          { x: 4, y: trend.calcY(4) },
        ],
        type: 'line',
        borderDash: [5, 5],
      },
    ],
  },
});
```

### Vanilla JavaScript (Canvas)

```js
import { createTrend } from 'trendline';

const data = [
  { x: 0, y: 20 },
  { x: 50, y: 45 },
  { x: 100, y: 40 },
  { x: 150, y: 70 },
  { x: 200, y: 65 },
];

const trend = createTrend(data, 'x', 'y');
const ctx = canvas.getContext('2d');

// Draw data points
data.forEach(({ x, y }) => {
  ctx.beginPath();
  ctx.arc(x, 100 - y, 4, 0, Math.PI * 2);
  ctx.fill();
});

// Draw trend line
ctx.beginPath();
ctx.setLineDash([5, 5]);
ctx.moveTo(0, 100 - trend.calcY(0));
ctx.lineTo(200, 100 - trend.calcY(200));
ctx.stroke();
```

---

## API

### `createTrend(data, xKey, yKey)`

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | `Array<{ [key]: number }>` | Your data array |
| `xKey` | `string` | Property name for X values |
| `yKey` | `string` | Property name for Y values |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `slope` | `number` | Rate of change (rise over run) |
| `yStart` | `number` | Y-intercept (value when x = 0) |
| `calcY(x)` | `function` | Get Y value for any X |
| `rSquared` | `number` | Fit quality: 0 = poor, 1 = perfect |

### TypeScript

```typescript
import { createTrend, TrendResult } from 'trendline';

const trend: TrendResult = createTrend(data, 'time', 'value');
```

---

## Understanding R²

The `rSquared` value tells you how well the trend line fits your data:

| R² | Fit Quality |
|----|-------------|
| 0.9 - 1.0 | Excellent — data follows a clear linear pattern |
| 0.7 - 0.9 | Good — trend line is meaningful |
| 0.4 - 0.7 | Moderate — some correlation |
| 0.0 - 0.4 | Weak — data may not be linear |

---

## Contributing

Found a bug or have a feature request? [Open an issue](https://github.com/heofs/trendline/issues) or submit a PR.

## License

MIT
