# Trendline.js

A lightweight JavaScript library to generate a trend line using linear regression. Display the trendline using something like [D3.js](https://d3js.org/) or [Recharts](https://recharts.org/).

## Example

```js
const createTrend = require('trendline');

const data = [
  { y: 2, x: 1 },
  { y: 4, x: 2 },
  { y: 5, x: 3 },
  { y: 4, x: 4 },
  { y: 5, x: 5 },
];

// Takes the following arguments (dataset, xKey, yKey)
const trend = createTrend(data, 'x', 'y');

console.log(trend);
// { slope: 0.6, yStart: 2.2, calcY: [Function: calcY] }
```

## The object returned from `createTrend`

The object has the following 3 properties.

`slope`, a number representing how sharply the trend increases.

`yStart`, a number showing where the trend line starts on the Y axis.

`calcY`, a function to calculate what the Y value is based on the X value.

### Illustrating `calcY`

```js
const data = [
  { y: 2, x: 1 },
  { y: 4, x: 2 },
  { y: 5, x: 3 },
  { y: 4, x: 4 },
  { y: 5, x: 5 },
];

const trend = createTrend(data, 'x', 'y');

console.log(trend.yStart); // 2.2

// yStart is representing the Y value when X is 0
// This will always returns true.
console.log(trend.calcY(0) === trend.yStart); // True
```

## Example use with Recharts

```jsx
import React from 'react';
import createTrend from 'trendline';

import { LineChart, Line, XAxis, YAxis } from 'recharts';

const Graph = () => {
  const { weightData } = useAPI();

  const weights = weightData.map((data) => data.weight);
  const yMax = Math.max(...weights);
  const yMin = Math.min(...weights);
  const timestamps = weightData.map((data) => data.dateTime);
  const xMax = Math.max(...timestamps);
  const xMin = Math.min(...timestamps);

  const trendData = () => {
    const trend = createTrend(weightData, 'dateTime', 'weight');

    return [
      { weight: trend.calcY(xMin), dateTime: xMin },
      { weight: trend.calcY(xMax), dateTime: xMax },
    ];
  };

  return (
    <LineChart
      data={weightData}
      margin={{ top: 5, right: 30, bottom: 5, left: -20 }}
      onMouseLeave={() => setMessage('')}
    >
      <XAxis
        name="Time"
        type="number"
        dataKey="dateTime"
        domain={['dataMin', 'dataMax']}
      />
      <YAxis
        name="Weight"
        type="number"
        dataKey="weight"
        domain={[yMin, yMax]}
      />
      <Line type="monotoneX" dataKey="weight" />

      <Line
        data={trendData()}
        dataKey="weight"
        stroke="red"
        strokeDasharray="3 3"
      />
    </LineChart>
  );
};
```

## Contributing

I appreciate anyone who wants to contribute to the project.
If you find any improvements to be made to the library, feel free to raise a PR for it on GitHub.
