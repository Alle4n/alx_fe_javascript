let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivational" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "Friendship" }
  ];
  
  let serverQuotes = []; // Simulated server quotes (initially empty)
  const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API for demonstration
  
  // Utility function to save quotes to local storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Fetch quotes from the server (simulated using async/await)
  async function fetchQuotesFromServer() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      serverQuotes = data.map(post => ({
        text: post.title, // Using 'title' as quote text
        category: 'General' // Static category for simplicity
      }));
      syncQuotes();
    } catch (error) {
      console.error("Error fetching quotes from server:", error);
    }
  }
  
  // Sync local data with server data
  function syncQuotes() {
    const changesMade = quotes.length !== serverQuotes.length || quotes.some((quote, index) => {
      return quote.text !== serverQuotes[index]?.text || quote.category !== serverQuotes[index]?.category;
    });
  
    if (changesMade) {
      showConflictResolutionNotification();
    }
  }
  
  // Periodically check for updates from the server
  setInterval(() => {
    fetchQuotesFromServer(); // Call the async function to fetch data from server
  }, 5000); // Every 5 seconds, check for updates
  
  // Show notification about conflict resolution
  function showConflictResolutionNotification() {
    const notification = document.getElementById('notification');
    notification.innerHTML = 'Data conflict detected. Server data takes precedence.';
    notification.style.display = 'block';
  
    setTimeout(() => {
      resolveConflict();
      notification.style.display = 'none';
    }, 3000); // Resolve conflict after 3 seconds
  }
  
  // Resolve the conflict (server data takes precedence)
  function resolveConflict() {
    quotes = [...serverQuotes]; // Sync local data with server data
    saveQuotes();
    filterQuotes();
  }
  
  // Populate categories dynamically
  function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = new Set(quotes.map(quote => quote.category)); // Extract unique categories
    
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  }
  
  // Show random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><em>- ${quote.category}</em></p>`;
  }
  
  // Filter quotes based on selected category
  function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' 
      ? quotes 
      : quotes.filter(quote => quote.category === selectedCategory);
  
    displayQuotes(filteredQuotes);
  }
  
  // Display quotes on the screen
  function displayQuotes(filteredQuotes) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = ''; // Clear existing quotes
    filteredQuotes.forEach(quote => {
      const quoteElement = document.createElement('div');
      quoteElement.innerHTML = `<p>"${quote.text}"</p><p><em>- ${quote.category}</em></p>`;
      quoteDisplay.appendChild(quoteElement);
    });
  }
  
  // Add new quote
  async function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    if (newQuoteText && newQuoteCategory) {
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
      quotes.push(newQuote);
      saveQuotes();
      filterQuotes();  // Refresh the quotes after adding a new one
  
      // Send the new quote to the server using POST
      await postQuoteToServer(newQuote); // Post the new quote to the server
    } else {
      alert('Please enter both quote and category!');
    }
  }
  
  // Function to send new quote to server using POST
  async function postQuoteToServer(quote) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indicate JSON data
        },
        body: JSON.stringify({
          title: quote.text, // Using 'title' as the text field for the API
          body: quote.category, // Use category as 'body' for simplicity
        })
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('New quote posted to server:', data);
      } else {
        console.error('Failed to post new quote to server');
      }
    } catch (error) {
      console.error("Error posting quote to server:", error);
    }
  }
  
  // Export quotes to JSON file
  function exportToJson() {
    const jsonData = JSON.stringify(quotes);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'quotes.json';
    link.click();
  }
  
  // Import quotes from JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
      filterQuotes();
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Initialize app
  populateCategories();
  showRandomQuote();
  fetchQuotesFromServer();  // Fetch server data initially
  