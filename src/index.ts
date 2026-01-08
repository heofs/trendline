/**
 * Result object returned by createTrend
 */
export interface TrendResult {
  /** The slope of the trend line (m in y = mx + b) */
  slope: number;
  /** The y-intercept, where the trend line crosses the Y axis (b in y = mx + b) */
  yStart: number;
  /** Function to calculate the Y value for any given X value */
  calcY: (x: number) => number;
  /** Coefficient of determination (R²), indicates how well the line fits the data (0-1) */
  rSquared: number;
}

/**
 * Calculates the average of an array of numbers
 */
function getAverage(arr: number[]): number {
  const total = arr.reduce((acc, c) => acc + c, 0);
  return total / arr.length;
}

/**
 * Calculates the sum of an array of numbers
 */
function getSum(arr: number[]): number {
  return arr.reduce((acc, c) => acc + c, 0);
}

/**
 * Creates a trend line using linear regression (Ordinary Least Squares)
 *
 * @param data - Array of objects containing numeric x and y values
 * @param xKey - The property name for X values
 * @param yKey - The property name for Y values
 * @returns Object containing slope, yStart, calcY function, and rSquared
 * @throws Error if data is empty or contains less than 2 points
 * @throws Error if all X values are identical (vertical line)
 *
 * @example
 * ```ts
 * const data = [
 *   { x: 1, y: 2 },
 *   { x: 2, y: 4 },
 *   { x: 3, y: 5 },
 * ];
 * const trend = createTrend(data, 'x', 'y');
 * console.log(trend.slope);    // 1.5
 * console.log(trend.yStart);   // 0.667
 * console.log(trend.rSquared); // 0.964
 * console.log(trend.calcY(4)); // 6.667
 * ```
 */
export function createTrend(
  data: Array<{ [key: string]: number }>,
  xKey: string,
  yKey: string
): TrendResult {
  // Input validation
  if (!data || !Array.isArray(data)) {
    throw new Error('Data must be an array');
  }

  if (data.length === 0) {
    throw new Error('Data array cannot be empty');
  }

  if (data.length === 1) {
    throw new Error('Data array must contain at least 2 points');
  }

  if (!xKey || typeof xKey !== 'string') {
    throw new Error('xKey must be a non-empty string');
  }

  if (!yKey || typeof yKey !== 'string') {
    throw new Error('yKey must be a non-empty string');
  }

  // Extract and validate numeric data
  const xData: number[] = [];
  const yData: number[] = [];

  for (let i = 0; i < data.length; i++) {
    const xVal = data[i][xKey];
    const yVal = data[i][yKey];

    if (typeof xVal !== 'number' || isNaN(xVal)) {
      throw new Error(
        `Invalid X value at index ${i}: expected number, got ${typeof xVal}`
      );
    }
    if (typeof yVal !== 'number' || isNaN(yVal)) {
      throw new Error(
        `Invalid Y value at index ${i}: expected number, got ${typeof yVal}`
      );
    }

    xData.push(xVal);
    yData.push(yVal);
  }

  // Calculate means
  const xMean = getAverage(xData);
  const yMean = getAverage(yData);

  // Calculate deviations from mean
  const xMinusxMean = xData.map((val) => val - xMean);
  const yMinusyMean = yData.map((val) => val - yMean);

  // Sum of squared X deviations
  const xMinusxMeanSq = xMinusxMean.map((val) => val * val);
  const ssX = getSum(xMinusxMeanSq);

  // Check for vertical line (all X values identical)
  if (ssX === 0) {
    throw new Error(
      'Cannot calculate trend: all X values are identical (vertical line)'
    );
  }

  // Sum of X*Y deviations
  const xy = xMinusxMean.map((val, index) => val * yMinusyMean[index]);
  const xySum = getSum(xy);

  // Calculate slope (b1) and intercept (b0)
  const b1 = xySum / ssX;
  const b0 = yMean - b1 * xMean;

  // Calculate R² (coefficient of determination)
  const yMinusyMeanSq = yMinusyMean.map((val) => val * val);
  const ssTotal = getSum(yMinusyMeanSq);

  let rSquared: number;
  if (ssTotal === 0) {
    // All Y values are identical - perfect horizontal fit if slope is 0
    rSquared = b1 === 0 ? 1 : 0;
  } else {
    // Calculate residuals and R²
    const predictedY = xData.map((x) => b0 + b1 * x);
    const residuals = yData.map((y, i) => y - predictedY[i]);
    const ssResidual = getSum(residuals.map((r) => r * r));
    rSquared = 1 - ssResidual / ssTotal;
  }

  return {
    slope: b1,
    yStart: b0,
    calcY: (x: number) => b0 + b1 * x,
    rSquared,
  };
}

export default createTrend;
