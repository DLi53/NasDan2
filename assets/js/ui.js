function showError(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

function clearError() {
  const errorMessage = document.getElementById("error-message");
  errorMessage.style.display = "none";
}

// Add event listener to search button
document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');

  // Event listener for the search button click
  searchButton.addEventListener('click', async function () {
    const symbol = searchInput.value.trim(); // Get the stock symbol from input
    console.log('Stock symbol:', symbol); // Debugging: see what input is being taken
    // console.log(apiKey)

    if (!symbol) {
      showErrorMessage('Please enter a stock symbol');
      triggerShakeEffect();  // Call the shake effect function when there's an error
      return;
    }

    try {
      // Hide error message (if any)
      hideErrorMessage();

      // Call the API with the symbol
      const stockData = await fetchStockData(symbol, 'DAILY'); // Adjust the period as needed

      // Check if the stock data is valid (error handling for invalid symbol)
      if (!stockData || stockData['Error Message']) {
        // showErrorMessage('Invalid stock symbol');
        triggerShakeEffect();  // Trigger shake effect on error
        return;
      }

      // If no error, create the chart
      createStockChart(stockData);  // Create the chart
    } catch (error) {
      console.error('Error:', error);
    //   alert('Error fetching stock data');
    //   showErrorMessage('Something went wrong!');
      triggerShakeEffect();  // Trigger shake effect on general error
    }
  });

  // Event listener for the Enter key press in the input field
  searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission if Enter is pressed
      searchButton.click(); // Simulate a click on the search button
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

  // Function to trigger shake effect
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

