let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivational" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "Friendship" }
  ];
  
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
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
  
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><em>- ${quote.category}</em></p>`;
  }
  
  function filterQuotes() {  // Corrected function name
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' 
      ? quotes 
      : quotes.filter(quote => quote.category === selectedCategory);
  
    displayQuotes(filteredQuotes);  // Update displayed quotes based on the filter
    localStorage.setItem('lastSelectedCategory', selectedCategory);  // Save the filter in local storage
  }
  
  function displayQuotes(filteredQuotes) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = ''; // Clear existing quotes
    filteredQuotes.forEach(quote => {
      const quoteElement = document.createElement('div');
      quoteElement.innerHTML = `<p>"${quote.text}"</p><p><em>- ${quote.category}</em></p>`;
      quoteDisplay.appendChild(quoteElement);
    });
  }
  
  function loadLastSelectedCategory() {
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
    document.getElementById('categoryFilter').value = lastSelectedCategory;
    filterQuotes();  // Apply the filter based on the last selected category
  }
  
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    if (newQuoteText && newQuoteCategory) {
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
      quotes.push(newQuote);
      saveQuotes();
      
      // Add new category to dropdown if it's not already there
      const categoryFilter = document.getElementById('categoryFilter');
      if (!Array.from(categoryFilter.options).some(option => option.value === newQuoteCategory)) {
        const option = document.createElement('option');
        option.value = newQuoteCategory;
        option.textContent = newQuoteCategory;
        categoryFilter.appendChild(option);
      }
  
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      filterQuotes();  // Refresh the quotes after adding a new one
    } else {
      alert('Please enter both quote and category!');
    }
  }
  
  function exportToJson() {
    const jsonData = JSON.stringify(quotes);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'quotes.json';
    link.click();
  }
  
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
      showRandomQuote();
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  function storeLastViewedQuote() {
    const lastViewed = quotes[Math.floor(Math.random() * quotes.length)];
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(lastViewed));
  }
  
  function loadLastViewedQuote() {
    const lastViewed = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
    if (lastViewed) {
      const quoteDisplay = document.getElementById('quoteDisplay');
      quoteDisplay.innerHTML = `<p>"${lastViewed.text}"</p><p><em>- ${lastViewed.category}</em></p>`;
    }
  }
  
  document.getElementById('newQuote').addEventListener('click', function() {
    showRandomQuote();
    storeLastViewedQuote();
  });
  
  document.getElementById('exportJson').addEventListener('click', exportToJson);
  
  createAddQuoteForm();
  populateCategories();
  showRandomQuote();
  loadLastSelectedCategory();  // Load last selected category from local storage
  