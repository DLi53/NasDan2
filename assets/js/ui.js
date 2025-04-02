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

      // Set the default period to "1W" if no other period is selected
      const defaultPeriod = "1W";
      updateChart(symbol, defaultPeriod); // Default chart load on page load

      // Add event listeners to period buttons
      periodButtons.forEach(button => {
        button.addEventListener('click', () => {
          const period = button.id; // Get the period from the button's ID
          updateChart(symbol, period); // Update the chart with the selected period
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
});
