let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivational" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "In the end, we will remember not the words of our enemies, but the silence of our friends.", category: "Friendship" }
  ];
  
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><em>- ${quote.category}</em></p>`;
  }
  
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    if (newQuoteText && newQuoteCategory) {
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
      quotes.push(newQuote);
      saveQuotes();
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      showRandomQuote();
    } else {
      alert('Please enter both quote and category!');
    }
  }
  
  function createAddQuoteForm() {
    const formContainer = document.getElementById('addQuoteFormContainer');
    
    const inputText = document.createElement('input');
    inputText.id = 'newQuoteText';
    inputText.type = 'text';
    inputText.placeholder = 'Enter a new quote';
  
    const inputCategory = document.createElement('input');
    inputCategory.id = 'newQuoteCategory';
    inputCategory.type = 'text';
    inputCategory.placeholder = 'Enter quote category';
  
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.onclick = addQuote;
  
    formContainer.appendChild(inputText);
    formContainer.appendChild(inputCategory);
    formContainer.appendChild(addButton);
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
  showRandomQuote();
  loadLastViewedQuote();
  