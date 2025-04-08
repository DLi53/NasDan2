// const macdSettingsByPeriod = {
//   "1D": { short: 6, long: 13, signal: 4 },
//   "1W": { short: 12, long: 26, signal: 9 },
//   "1M": { short: 19, long: 39, signal: 13 },
//   "1Y": { short: 26, long: 52, signal: 18 },
//   "5Y": { short: 30, long: 60, signal: 20 },
//   "ALL": { short: 40, long: 80, signal: 26 },
// };


// function calculateEMA(data, period) {
//   const k = 2 / (period + 1);
//   let emaArray = [data[0].close]; // Start with the first close price

//   for (let i = 1; i < data.length; i++) {
//     const close = data[i].close;
//     const emaPrev = emaArray[i - 1];
//     const emaCurrent = close * k + emaPrev * (1 - k);
//     emaArray.push(emaCurrent);
//   }

//   return emaArray;
// }

// function calculateMACD(data, shortPeriod, longPeriod, signalPeriod) {
//   const shortEMA = calculateEMA(data, shortPeriod);
//   const longEMA = calculateEMA(data, longPeriod);
//   const macdLine = shortEMA.map((val, i) => val - longEMA[i]);

//   const signalLine = calculateEMA(macdLine.map(val => ({ close: val })), signalPeriod);

//   return data.map((entry, i) => ({
//     date: entry.date,
//     macd: macdLine[i],
//     signal: signalLine[i],
//     histogram: macdLine[i] - signalLine[i],
//   }));
// }


