const ALPHA_API_KEYD = 'demo';  // your first API key
const ALPHA_API_KEY1 = 'GJUQ4UJFZ15E0MOY';  // your first API key
const ALPHA_API_KEY2 = 'Z0TA7QAJWJ12SKAP';  // your second API key
const ALPHA_API_KEY3 = '7OCAKZM05S4C0SHK';  // your third API key
const BASE_URL = 'https://www.alphavantage.co/query';
// const period = 'DAILY';

// FinancialModelingPropKey = mFn2xUReKNNNbYd2fjw78C551ZjJkHG4

const API_KEYS = [ALPHA_API_KEYD, ALPHA_API_KEY1, ALPHA_API_KEY2, ALPHA_API_KEY3]; // Store the keys in an array

async function fetchStockData(symbol, period) {
//   for (const apiKey of API_KEYS) {
  for (const apiKey of API_KEYS) {  
    let url = `${BASE_URL}?function=TIME_SERIES_${period}&symbol=${symbol}&apikey=${apiKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data); // Log the data to check if the API is returning the expected result
      console.log(apiKey)
    
      // Make sure the API response is valid
      if (data['Error Message']) {
        throw new Error('Invalid stock symbol');
      }

      return data; // Return the data if the API is successful
    } catch (error) {
      console.error(`Error fetching stock data with API key ${apiKey}:`, error);
      // If this key fails, it will try the next key in the array
    }
  }

  // If all API keys fail, throw an error
  throw new Error('All API keys failed');
}  

// https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=GJUQ4UJFZ15E0MOY

// ER1LASFYHOXZ7MP3
// https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo

// https://financialmodelingprep.com/api/v3/historical-price-full/AAPL?timeseries=365&apikey=mFn2xUReKNNNbYd2fjw78C551ZjJkHG4
