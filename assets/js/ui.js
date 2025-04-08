let currentSymbol = null;
let currentPeriod = "1W";


function showError(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

function clearError() {
  document.getElementById("error-message").style.display = "none";
}
// Load an empty chart when the page first loads
// createStockChart(); 

// Add event listener to search button
document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  const periodButtons = document.querySelectorAll('.time-changes button'); // Select all period buttons

  // Event listener for the search button click
  searchButton.addEventListener('click', async function () {
    const symbol = searchInput.value.trim().toUpperCase(); // Convert input to uppercase
    console.log('Stock symbol:', symbol); // Debugging

    if (!symbol) {
      showErrorMessage('Please enter a stock symbol');
      triggerShakeEffect();
      return;
    }

    try {
      hideErrorMessage(); // Hide previous errors

      // Fetch stock data (it caches automatically)
      await fetchStockData(symbol);

      const stockInfo = await fetchStockInfo(symbol);  
      updateStockInfo(stockInfo, period="1W");


      const defaultPeriod = "1W";
      updateChart(symbol, defaultPeriod); // Default chart load on page load
      // updateStockInfoP(defaultPeriod)
      currentSymbol = symbol;
      currentPeriod = defaultPeriod;


      // Add event listeners to period buttons
      periodButtons.forEach(button => {
        button.addEventListener('click', () => {
          const period = button.id; // Get the period from the button's ID
          updateChart(symbol, period);// Update the chart with the selected period
          updateStockInfo(stockInfo, period)
          currentPeriod=period;
        });
      });

    } catch (error) {
      console.error('Error:', error);
      showErrorMessage('Invalid or unavailable stock symbol');
      triggerShakeEffect();
    }
  });

  // Event listener for Enter key in the input field
  searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      searchButton.click(); // Simulate button click
    }
  });

  // Function to show error message
  function showErrorMessage(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }

  // Function to hide error message
  function hideErrorMessage() {
    document.getElementById('error-message').style.display = 'none';
  }


  function triggerShakeEffect() {
    const searchInput = document.getElementById('search-input');
    
    // Change the ID to 'shake' and set the placeholder
    searchInput.id = 'shake';
    searchInput.placeholder = 'Invalid Ticker';

    // Optionally trigger a shake animation (if you want it)
    setTimeout(() => {
      searchInput.id = 'search-input'; // Reset the ID after the shake
      searchInput.placeholder = 'Search Stock Ticker...'; // Reset the placeholder text
    }, 3000); // Duration of shake effect (adjust if needed)
  }


  function updateStockInfo(data,period) {
    const detailsContainer = document.getElementById('stock-details');
    console.log(data)

    if (!data) {
      detailsContainer.innerHTML = "<p>No data available.</p>";
      return;
    }

    const {
      name,
      price,
      pe,
      volume,
      eps,
      yearHigh,
      yearLow,
      symbol
    } = data;

    detailsContainer.innerHTML = `
      <p><strong>Period:</strong> ${period}</p>
      <p><strong>Symbol:</strong> ${symbol}</p>
      <p><strong>Company:</strong> ${name}</p>
      <p><strong>Current Price:</strong> $${price}</p>
      <p><strong>52-Week High:</strong> $${yearHigh}</p>
      <p><strong>52-Week Low:</strong> $${yearLow}</p>
      <p><strong>P/E Ratio:</strong> ${pe}</p>
      <p><strong>Volume:</strong> ${volume.toLocaleString()}</p>
      <p><strong>EPS:</strong> ${eps}</p>
    `;
  }

  const macdSettingsByPeriod = {
  "1D":    { short: 5, long: 12, signal: 9 },
  "1W":    { short: 10, long: 26, signal: 9 },
  "1M":    { short: 12, long: 26, signal: 9 },
  "1Y":    { short: 19, long: 39, signal: 9 },
  "5Y":    { short: 26, long: 52, signal: 9 },
  "ALL":   { short: 26, long: 52, signal: 9 }
  };

let smaVisible = false;


document.getElementById("SMA").addEventListener("click", async function (e) {
  e.preventDefault();

  if (!currentSymbol || !currentPeriod) {
    showErrorMessage("Search for a stock first.");
    return;
  }

  smaVisible = !smaVisible;

  const existingSMAIndex = window.chartInstance.data.datasets.findIndex(ds => ds.label === "SMA 5");

  if (smaVisible) {
    if (existingSMAIndex === -1) {
      // Get stock data in correct time order
      let filteredData = filterStockData(currentSymbol, currentPeriod);

      // Ensure chronological order for correct SMA calc
      filteredData = [...filteredData].reverse(); // ⬅️ Reverse if your data is newest-to-oldest

      const smaData = calculateSMA(filteredData, 5);

      // You can reverse it again for chart display if needed
      addSMALine(smaData.reverse(), 5); // ⬅️ Only reverse if your chart expects latest-to-earliest
    }
  } else {
    // Remove SMA line
    if (existingSMAIndex !== -1) {
      window.chartInstance.data.datasets.splice(existingSMAIndex, 1);
      window.chartInstance.update();
    }
  }
});







});
