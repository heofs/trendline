# Trendline.js

A lightweight JavaScript library to generate a trend line using linear regression. Display the trendline using something like D3.js.

## Example

```js
const createTrend = require('./index');

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

## Contributing

I appreciate anyone who wants to contribute to the project.
If you find any improvements to be made to the library, feel free to raise a PR for it on GitHub.
