const apiKey = 'AIzaSyD6ZoSkNp9fHsyWdJe0kB8uVqv9hC_oH9s';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');
const startScanButton = document.getElementById('start-scan');
const stopScanButton = document.getElementById('stop-scan');
const scannerDiv = document.getElementById('scanner');

let html5QrcodeScanner;

searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const query = searchInput.value;
  lancerRecherche(query);
});

function lancerRecherche(query) {
  fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      resultsContainer.innerHTML = '';
      if (!data.items || data.items.length === 0) {
        resultsContainer.innerHTML = '<p>Aucun résultat trouvé.</p>';
        return;
      }

      data.items.forEach(item => {
        const book = item.volumeInfo;
        const bookElement = document.createElement('div');
        bookElement.classList.add('book-result');
        bookElement.innerHTML = `
          <h3>${book.title}</h3>
          <p>Auteur(s) : ${book.authors ? book.authors.join(', ') : 'Inconnu'}</p>
          <img src="${book.imageLinks?.thumbnail || ''}" alt="Couverture" style="max-height:150px;">
          <p>${book.description ? book.description.substring(0, 150) + '...' : 'Pas de description disponible'}</p>
          <button onclick="ajouterLivre('${book.title.replace(/'/g, "\\'")}', '${(book.authors ? book.authors.join(', ') : 'Inconnu').replace(/
