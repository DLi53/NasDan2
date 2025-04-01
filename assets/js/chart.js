function createStockChart(stockData, period = "1W") {
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

  // Determine how many data points to use
  let timeFrame = {
    "1D": 1,
    "1W": 7,
    "1M": 30,
    "1Y": 365,
    "5Y": 1825,
    "All": 5000
  };

  let limit = timeFrame[period] || 7;  // Default to 1 week
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
