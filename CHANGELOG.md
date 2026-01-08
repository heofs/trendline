# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-01-05

### Added

- **R² (coefficient of determination)**: The returned object now includes an `rSquared` property indicating how well the trend line fits your data (0-1 scale)
- **TypeScript interface export**: `TrendResult` interface is now exported for better type safety
- **Input validation**: Comprehensive error messages for invalid inputs
  - Empty data arrays
  - Single data point (requires at least 2)
  - Non-numeric values
  - Missing keys
  - NaN values
- **Edge case handling**: Proper error when all X values are identical (vertical line)
- **JSDoc documentation**: Full API documentation with examples
- **Package.json enhancements**:
  - `exports` field for modern bundlers
  - `homepage` and `bugs` URLs
  - `engines` field specifying Node.js >=12
  - Additional keywords for better discoverability
- **GitHub Actions CI**: Automated testing on Node 16, 18, and 20
- **Chart.js example**: Added example usage with Chart.js
- **Comprehensive test suite**: 26 tests covering all functionality

### Changed

- Improved code organization with clearer comments
- Better variable naming for readability
- Updated README with badges, API reference tables, and TypeScript examples

## [1.0.0] - 2023-10-01

### Changed

- Migrated from JavaScript to TypeScript
- Modern build system with tsup (outputs both CommonJS and ESM)
- Full type definitions included

## [0.3.1] - Previous

### Added

- Initial stable release
- Linear regression calculation
- `slope`, `yStart`, and `calcY` properties
- Support for custom x/y key names
- Recharts example in documentation
