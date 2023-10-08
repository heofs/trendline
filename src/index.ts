function getAverage(arr: Array<number>) {
  const total = arr.reduce((acc, c) => acc + c, 0);
  return total / arr.length;
}

function getSum(arr: Array<number>) {
  return arr.reduce((acc, c) => acc + c, 0);
}

export function createTrend(
  data: Array<{ [key: string]: number }>,
  xKey: string,
  yKey: string
): {
  slope: number;
  yStart: number;
  calcY: (x: number) => number;
} {
  const xData = data.map((value) => value[xKey]);
  const yData = data.map((value) => value[yKey]);

  // average of X values and Y values
  const xMean = getAverage(xData);
  const yMean = getAverage(yData);

  // Subtract X or Y mean from corresponding axis value
  const xMinusxMean = xData.map((val) => val - xMean);
  const yMinusyMean = yData.map((val) => val - yMean);

  const xMinusxMeanSq = xMinusxMean.map((val) => Math.pow(val, 2));

  const xy: Array<number> = [];
  for (let x = 0; x < data.length; x++) {
    xy.push(xMinusxMean[x] * yMinusyMean[x]);
  }

  // const xy = xMinusxMean.map((val, index) => val * yMinusyMean[index]);

  const xySum = getSum(xy);

  // b1 is the slope
  const b1 = xySum / getSum(xMinusxMeanSq);
  // b0 is the start of the slope on the Y axis
  const b0 = yMean - b1 * xMean;

  return {
    slope: b1,
    yStart: b0,
    calcY: (x: number) => b0 + b1 * x,
  };
}

export default createTrend;
