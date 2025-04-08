const FinancialModelingPropKey = "mFn2xUReKNNNbYd2fjw78C551ZjJkHG4";
const BASE_URL = "https://financialmodelingprep.com/api/v3/historical-price-full";
let fullStockData = {}; // Cache for storing full historical data
let stockInfoCache = {}; // Cache for storing stock info
let smaDataCache = {};
// https://financialmodelingprep.com/api/v3/historical-price-full/AAPL?timeseries=5000&apikey=mFn2xUReKNNNbYd2fjw78C551ZjJkHG4

// Fetch stock data from the API or return cached data if already fetched
async function fetchStockData(symbol) {
  if (fullStockData[symbol]) {
    console.log("Using cached data for:", symbol);
    return fullStockData[symbol]; // Return cached data if already fetched
  }

  let url = `${BASE_URL}/${symbol}?timeseries=5000&apikey=${FinancialModelingPropKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data || !data.historical) {
      throw new Error("Invalid stock symbol or no data available.");
    }

    fullStockData[symbol] = data.historical; // Store full historical data in memory
    console.log("Fetched new data for:", symbol);

    // Calculate SMA for the full data and store it in cache
    smaDataCache[symbol] = calculateSMA(fullStockData[symbol], 5); // Store SMA for all points
    console.log("SMA data cached for:", symbol);

    return fullStockData[symbol];
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
}

// Filter stock data based on period
function filterStockData(symbol, period) {
  if (!fullStockData[symbol]) return [];

  const today = new Date();
  const compareDate = new Date(today);

  // Filter the stock data based on the selected period
  let filteredData = fullStockData[symbol].filter((entry) => {
    const entryDate = new Date(entry.date);

    switch (period) {
      case "1D":
        compareDate.setDate(today.getDate() - 1); // 1 day ago
        return entryDate >= compareDate;
      case "1W":
        compareDate.setDate(today.getDate() - 7); // 1 week ago
        return entryDate >= compareDate;
      case "1M":
        compareDate.setMonth(today.getMonth() - 1); // 1 month ago
        return entryDate >= compareDate;
      case "1Y":
        compareDate.setFullYear(today.getFullYear() - 1); // 1 year ago
        return entryDate >= compareDate;
      case "5Y":
        compareDate.setFullYear(today.getFullYear() - 5); // 5 years ago
        return entryDate >= compareDate;
      case "ALL":
        return true; // Use all available data
      default:
        return [];
    }
  });

  return filteredData;
}



// Update chart by fetching and filtering data
async function updateChart(symbol, period) {
  await fetchStockData(symbol); // Ensure data is fetched and SMA is cached

  // Get the filtered stock data based on the selected period
  const filteredData = filterStockData(symbol, period);

  // Get the corresponding SMA data for the filtered period
  const filteredSMAData = smaDataCache[symbol].filter(smaPoint => 
    filteredData.some(stockPoint => stockPoint.date === smaPoint.date)
  );

  console.log("Filtered data:", filteredData, period);
  console.log("Filtered SMA data:", filteredSMAData);

  createStockChart(filteredData, period, filteredSMAData); // Update chart with both stock and SMA data
}



// Fetch stock info and cache it
async function fetchStockInfo(symbol) {
  console.log('instockinfofetching')
  // Check if data is already in the cache
  if (stockInfoCache[symbol]) {
    console.log("Using cached stock info for:", symbol);
    return stockInfoCache[symbol]; // Return cached stock info if available
  }

  const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FinancialModelingPropKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data[0]) {
      stockInfoCache[symbol] = data[0]; // Cache the stock info for future use
      console.log("Fetched new stock info for:", symbol);
      return data[0]; // Return the stock info
    } else {
      throw new Error("Stock info not found.");
    }
  } catch (error) {
    console.error("Error fetching stock info:", error);
    return null;
  }
}


function calculateEMA(data, period) {
  const k = 2 / (period + 1);
  let emaArray = [data[0].close]; // Start with the first close price

  for (let i = 1; i < data.length; i++) {
    const close = data[i].close;
    const emaPrev = emaArray[i - 1];
    const emaCurrent = close * k + emaPrev * (1 - k);
    emaArray.push(emaCurrent);
  }

  return emaArray;
}

function calculateMACD(data, shortPeriod, longPeriod, signalPeriod) {
  const shortEMA = calculateEMA(data, shortPeriod);
  const longEMA = calculateEMA(data, longPeriod);
  const macdLine = shortEMA.map((val, i) => val - longEMA[i]);

  const signalLine = calculateEMA(macdLine.map(val => ({ close: val })), signalPeriod);

  return data.map((entry, i) => ({
    date: entry.date,
    macd: macdLine[i],
    signal: signalLine[i],
    histogram: macdLine[i] - signalLine[i],
  }));
}


function calculateSMA(data, period = 50) {
  const smaData = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      // Not enough data before this point, skip
      smaData.push({ date: data[i].date, sma: null });
      continue;
    }

    const slice = data.slice(i - period + 1, i + 1);
    const sum = slice.reduce((acc, val) => acc + val.close, 0);
    const avg = sum / period;

    smaData.push({ date: data[i].date, sma: avg });
  }

  return smaData;
}
