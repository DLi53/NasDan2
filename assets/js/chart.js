function createStockChart(stockData =[], period = "1W") {
  // Check if stockData is valid and contains the necessary data
  if (!stockData || stockData.length === 0) {
    console.error("No valid stock data available.");
    return;
  }

  // Destroy the previous chart if it exists
  if (window.chartInstance) {
    window.chartInstance.destroy();
  }

  let labels = [];
  let prices = [];

  let periodString= String(period);
  console.log('periodString:', periodString); // Log the period to see its value


  // Determine how many data points to use
  let timeFrame = {
    "1D": 1,
    "1W": 7,
    "1M": 30,
    "6M": 183,
    "1Y": 365,
    "5Y": 1825,
    "Max": 5000
  };
  
  console.log('period:',periodString, typeof period, typeof periodString, periodString, periodString.toUpperCase == "1M");
  console.log(timeFrame[periodString])
  let limit = timeFrame[periodString.trim] || 7;  // Default to 1 week
  console.log('period:',periodString,'limit:',limit)
  let slicedData = stockData.slice(0, limit);

  labels = slicedData.map(entry => entry.date).reverse();
  prices = slicedData.map(entry => entry.close).reverse();

  const ctx = document.getElementById("stock-chart").getContext("2d");

  // Create a new chart and store it in window.chartInstance
  window.chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Stock Price",
        data: prices,
        borderColor: "blue",
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: "category"
        }
      }
    }
  });
}
