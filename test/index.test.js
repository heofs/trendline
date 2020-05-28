const createTrend = require('../index');

test('should return a correct trend line', () => {
  const data = [
    { y: 2, x: 1 },
    { y: 4, x: 2 },
    { y: 5, x: 3 },
    { y: 4, x: 4 },
    { y: 5, x: 5 },
  ];

  const trend = createTrend(data, 'x', 'y');

  expect(trend).toMatchObject({ slope: 0.6, yStart: 2.2 });
});

test('should return a correct trend line when data is out of order', () => {
  const data = [
    { y: 5, x: 3 },
    { y: 5, x: 5 },
    { y: 2, x: 1 },
    { y: 4, x: 4 },
    { y: 4, x: 2 },
  ];

  const trend = createTrend(data, 'x', 'y');

  expect(trend).toMatchObject({ slope: 0.6, yStart: 2.2 });
});

test('should return a function to calculate Y value based on X', () => {
  const data = [
    { y: 2, x: 1 },
    { y: 4, x: 2 },
    { y: 5, x: 3 },
    { y: 4, x: 4 },
    { y: 5, x: 5 },
  ];

  const trend = createTrend(data, 'x', 'y');

  expect(trend.calcY(0)).toBe(2.2);
});

test('should return a correct trend line downwards', () => {
  const data = [
    { y: 8, x: 1 },
    { y: 7, x: 2 },
    { y: 6, x: 3 },
    { y: 3, x: 4 },
    { y: 1, x: 5 },
  ];

  const trend = createTrend(data, 'x', 'y');

  expect(trend).toMatchObject({ slope: -1.8, yStart: 10.4 });
});

test('should return a correct trend line with missing data', () => {
  const data = [
    { y: 1, x: 1 },
    { y: 2, x: 2 },
    { y: 4, x: 4 },
    { y: 5, x: 5 },
  ];

  const trend = createTrend(data, 'x', 'y');

  expect(trend).toMatchObject({ slope: 1, yStart: 0 });
});

test('should return a function for calculating Y value based on X', () => {
  const data = [
    { y: 2, x: 1 },
    { y: 4, x: 2 },
    { y: 5, x: 3 },
    { y: 4, x: 4 },
    { y: 5, x: 5 },
  ];

  const trend = createTrend(data, 'x', 'y');
  expect(trend.calcY(0)).toBe(2.2);
  expect(trend.calcY(5)).toBe(5.2);
});

test('yStart === calcY(0) shoould awlays be Truthy', () => {
  let data = [
    { y: 2, x: 1 },
    { y: 4, x: 2 },
    { y: 5, x: 3 },
    { y: 4, x: 4 },
    { y: 5, x: 5 },
  ];

  let trend = createTrend(data, 'x', 'y');
  expect(trend.calcY(0) === trend.yStart).toBeTruthy();

  data = [
    { y: 5, x: 3 },
    { y: 4, x: 4 },
    { y: 5, x: 5 },
  ];

  trend = createTrend(data, 'x', 'y');
  expect(trend.calcY(0) === trend.yStart).toBeTruthy();
});
