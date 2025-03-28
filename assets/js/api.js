// assets/js/api.js

const ALPHA_API_KEY = 'YOUR_ALPHA_VANTAGE_KEY';
const BASE_URL = 'https://www.alphavantage.co/query';

async function fetchStockData(symbol, period) {
  let url = `${BASE_URL}?function=`;

  if (period === "1-week") {
    url += `TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${ALPHA_API_KEY}`;
  } else if (period === "5-years") {
    url += `TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_API_KEY}`;
  } else {
    throw new Error("Invalid period selected.");
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
}
