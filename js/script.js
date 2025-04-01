const apiKey = 'AIzaSyD6ZoSkNp9fHsyWdJe0kB8uVqv9hC_oH9s';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');
const collectionContainer = document.getElementById('collection');

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const query = searchInput.value;
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            resultsContainer.innerHTML = '';
            data.items.forEach(item => {
                const book = item.volumeInfo;
                const bookElement = document.createElement('div');
                bookElement.innerHTML = `
                    <h3>${book.title}</h3>
                    <p>Auteur(s) : ${book.authors ? book.authors.join(', ') : 'Inconnu'}</p>
                    <img src="${book.imageLinks?.thumbnail || ''}" alt="Couverture">
                    <p>${book.description ? book.description.substring(0, 200) + '...' : 'Pas de description disponible'}</p>
                    <button onclick="addToCollection('${book.title}', '${book.authors ? book.authors.join(', ') : 'Inconnu'}', '${book.imageLinks?.thumbnail || ''}')">Ajouter à ma collection</button>
                `;
                resultsContainer.appendChild(bookElement);
            });
        })
        .catch(err => console.error('Erreur API', err));
});

function addToCollection(title, authors, thumbnail) {
    const book = { title, authors, thumbnail };
    let collection = JSON.parse(localStorage.getItem('collection')) || [];
    collection.push(book);
    localStorage.setItem('collection', JSON.stringify(collection));
    displayCollection();
}

function displayCollection() {
    collectionContainer.innerHTML = '';
    let collection = JSON.parse(localStorage.getItem('collection')) || [];
    collection.forEach(book => {
        const bookElement = document.createElement('li');
        bookElement.innerHTML = `
            <h3>${book.title}</h3>
            <p>Auteur(s) : ${book.authors}</p>
            <img src="${book.thumbnail}" alt="Couverture">
        `;
        collectionContainer.appendChild(bookElement);
    });
}

const scanButton = document.getElementById('scan-button');
const scannerContainer = document.getElementById('scanner-container');

scanButton.addEventListener('click', function() {
  scannerContainer.style.display = 'block';

  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#scanner'),
      constraints: {
        facingMode: "environment" // utilise la caméra arrière sur mobile
      }
    },
    decoder: {
      readers: ["ean_reader"] // Pour lire les ISBN (code-barres EAN)
    }
  }, function(err) {
    if (err) {
      console.error(err);
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected(data => {
    const code = data.codeResult.code;
    Quagga.stop();
    scannerContainer.style.display = 'none';
    searchInput.value = code; // Place le code dans le champ de recherche
    searchForm.dispatchEvent(new Event('submit')); // Lance la recherche automatiquement
  });
});
