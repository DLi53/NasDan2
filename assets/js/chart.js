function createStockChart(stockData, period) {
  let labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
  let prices = [12, 19, 3, 5, 2, 3];

  const timeSeries = stockData["Time Series (Daily)"];
  
  // Extract the last 100 days or 5 years (depending on the period)
  const dataKeys = Object.keys(timeSeries).slice(0, period === "full" ? 2000 : 100);  // 100 days or 5 years worth of data
  labels = dataKeys.reverse();
  prices = dataKeys.map(date => parseFloat(timeSeries[date]["4. close"])).reverse();

  const ctx = document.getElementById("stock-chart").getContext("2d");
  
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: 'Stock Price',
        data: prices,
        borderColor: 'blue',
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
