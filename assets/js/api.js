const FinancialModelingPropKey = "mFn2xUReKNNNbYd2fjw78C551ZjJkHG4";
const BASE_URL = "https://financialmodelingprep.com/api/v3/historical-price-full";
let fullStockData = {}; // Cache for storing full historical data

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

  // Create a copy of today's date to prevent mutation
  const compareDate = new Date(today);

  return fullStockData[symbol].filter((entry) => {
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
}


// Update chart by fetching and filtering data
async function updateChart(symbol, period = "1W") {
  await fetchStockData(symbol); // Fetch data if not already cached
  const filteredData = filterStockData(symbol, period);
  
  console.log("Filtered data:", filteredData, period);
  createStockChart(filteredData, period); // Update chart with filtered data
}

