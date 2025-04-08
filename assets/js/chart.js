// Function to create the stock chart

window.isSMAVisible = false;
const smaVisibility = {
  5: false,
  10: false,
  20: false,
};


function createStockChart(stockData = [], period) {
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

  let periodString = String(period);

  // Determine how many data points to use based on the period
  let timeFrame = {
    "1D": 1,
    "1W": 7,
    "1M": 30,
    "6M": 183,
    "1Y": 365,
    "5Y": 1825,
    "Max": 5000
  };

  let limit = timeFrame[periodString] || 7;  // Default to 1 week if period is invalid
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

// Function to add SMA line to the chart
function addSMALine(smaData, period) {
  if (!window.chartInstance) {
    console.error("Chart hasn't been initialized.");
    return;
  }

  const chart = window.chartInstance;
  const label = `SMA (${period}-day)`;

  if (smaVisibility[period]) {
    // Remove SMA line if it's already shown
    chart.data.datasets = chart.data.datasets.filter(ds => ds.label !== label);
    smaVisibility[period] = false;
  } else {
    const smaLine = smaData.map(entry => entry.sma).reverse();

    chart.data.datasets.push({
      label,
      data: smaLine,
      borderColor: getSMAColor(period),
      fill: false,
      tension: 0.3,
    });

    smaVisibility[period] = true;
  }

  chart.update();
}

function getSMAColor(period) {
  const colors = {
    5: 'orange',
    10: 'green',
    20: 'purple'
  };
  return colors[period] || 'gray';
}
