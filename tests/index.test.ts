import createTrend, { TrendResult } from '../src';

describe('createTrend', () => {
  describe('basic functionality', () => {
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

    test('should return a correct trend line with missing data points', () => {
      const data = [
        { y: 1, x: 1 },
        { y: 2, x: 2 },
        { y: 4, x: 4 },
        { y: 5, x: 5 },
      ];

      const trend = createTrend(data, 'x', 'y');

      expect(trend).toMatchObject({ slope: 1, yStart: 0 });
    });
  });

  describe('calcY function', () => {
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

    test('should calculate Y values correctly for multiple X inputs', () => {
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

    test('yStart === calcY(0) should always be true', () => {
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
  });

  describe('R² (coefficient of determination)', () => {
    test('should return rSquared property', () => {
      const data = [
        { y: 2, x: 1 },
        { y: 4, x: 2 },
        { y: 5, x: 3 },
        { y: 4, x: 4 },
        { y: 5, x: 5 },
      ];

      const trend = createTrend(data, 'x', 'y');

      expect(trend.rSquared).toBeDefined();
      expect(typeof trend.rSquared).toBe('number');
    });

    test('should return R² = 1 for perfect linear data', () => {
      const data = [
        { y: 1, x: 1 },
        { y: 2, x: 2 },
        { y: 3, x: 3 },
        { y: 4, x: 4 },
        { y: 5, x: 5 },
      ];

      const trend = createTrend(data, 'x', 'y');

      expect(trend.rSquared).toBe(1);
    });

    test('should return R² between 0 and 1 for typical data', () => {
      const data = [
        { y: 2, x: 1 },
        { y: 4, x: 2 },
        { y: 5, x: 3 },
        { y: 4, x: 4 },
        { y: 5, x: 5 },
      ];

      const trend = createTrend(data, 'x', 'y');

      expect(trend.rSquared).toBeGreaterThanOrEqual(0);
      expect(trend.rSquared).toBeLessThanOrEqual(1);
    });

    test('should return R² = 1 for horizontal line (all Y values identical)', () => {
      const data = [
        { y: 5, x: 1 },
        { y: 5, x: 2 },
        { y: 5, x: 3 },
      ];

      const trend = createTrend(data, 'x', 'y');

      expect(trend.slope).toBe(0);
      expect(trend.rSquared).toBe(1);
    });
  });

  describe('input validation', () => {
    test('should throw error for empty array', () => {
      expect(() => createTrend([], 'x', 'y')).toThrow(
        'Data array cannot be empty'
      );
    });

    test('should throw error for single data point', () => {
      const data = [{ x: 1, y: 2 }];

      expect(() => createTrend(data, 'x', 'y')).toThrow(
        'Data array must contain at least 2 points'
      );
    });

    test('should throw error for null/undefined data', () => {
      expect(() => createTrend(null as any, 'x', 'y')).toThrow(
        'Data must be an array'
      );
      expect(() => createTrend(undefined as any, 'x', 'y')).toThrow(
        'Data must be an array'
      );
    });

    test('should throw error for empty xKey', () => {
      const data = [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
      ];

      expect(() => createTrend(data, '', 'y')).toThrow(
        'xKey must be a non-empty string'
      );
    });

    test('should throw error for empty yKey', () => {
      const data = [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
      ];

      expect(() => createTrend(data, 'x', '')).toThrow(
        'yKey must be a non-empty string'
      );
    });

    test('should throw error for non-numeric X values', () => {
      const data = [
        { x: 'a', y: 2 },
        { x: 2, y: 3 },
      ] as any;

      expect(() => createTrend(data, 'x', 'y')).toThrow(
        'Invalid X value at index 0'
      );
    });

    test('should throw error for non-numeric Y values', () => {
      const data = [
        { x: 1, y: 2 },
        { x: 2, y: 'b' },
      ] as any;

      expect(() => createTrend(data, 'x', 'y')).toThrow(
        'Invalid Y value at index 1'
      );
    });

    test('should throw error for missing X key in data', () => {
      const data = [
        { x: 1, y: 2 },
        { y: 3 },
      ] as any;

      expect(() => createTrend(data, 'x', 'y')).toThrow(
        'Invalid X value at index 1'
      );
    });

    test('should throw error for NaN values', () => {
      const data = [
        { x: 1, y: 2 },
        { x: NaN, y: 3 },
      ];

      expect(() => createTrend(data, 'x', 'y')).toThrow(
        'Invalid X value at index 1'
      );
    });
  });

  describe('edge cases', () => {
    test('should throw error when all X values are identical', () => {
      const data = [
        { x: 5, y: 1 },
        { x: 5, y: 2 },
        { x: 5, y: 3 },
      ];

      expect(() => createTrend(data, 'x', 'y')).toThrow(
        'Cannot calculate trend: all X values are identical (vertical line)'
      );
    });

    test('should handle two data points correctly', () => {
      const data = [
        { x: 0, y: 0 },
        { x: 10, y: 10 },
      ];

      const trend = createTrend(data, 'x', 'y');

      expect(trend.slope).toBe(1);
      expect(trend.yStart).toBe(0);
      expect(trend.rSquared).toBe(1);
    });

    test('should handle negative values', () => {
      const data = [
        { x: -2, y: -4 },
        { x: -1, y: -2 },
        { x: 0, y: 0 },
        { x: 1, y: 2 },
        { x: 2, y: 4 },
      ];

      const trend = createTrend(data, 'x', 'y');

      expect(trend.slope).toBe(2);
      expect(trend.yStart).toBe(0);
      expect(trend.rSquared).toBe(1);
    });

    test('should handle large numbers', () => {
      const data = [
        { x: 1000000, y: 2000000 },
        { x: 2000000, y: 4000000 },
        { x: 3000000, y: 6000000 },
      ];

      const trend = createTrend(data, 'x', 'y');

      expect(trend.slope).toBe(2);
      expect(trend.yStart).toBe(0);
    });

    test('should handle decimal values', () => {
      const data = [
        { x: 0.1, y: 0.2 },
        { x: 0.2, y: 0.4 },
        { x: 0.3, y: 0.6 },
      ];

      const trend = createTrend(data, 'x', 'y');

      expect(trend.slope).toBeCloseTo(2, 10);
      expect(trend.yStart).toBeCloseTo(0, 10);
    });
  });

  describe('TypeScript types', () => {
    test('should export TrendResult interface', () => {
      const data = [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
      ];

      const trend: TrendResult = createTrend(data, 'x', 'y');

      expect(trend.slope).toBeDefined();
      expect(trend.yStart).toBeDefined();
      expect(trend.calcY).toBeDefined();
      expect(trend.rSquared).toBeDefined();
    });
  });
});
