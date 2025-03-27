const apiKey = 'AIzaSyD6ZoSkNp9fHsyWdJe0kB8uVqv9hC_oH9s';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');
const scanButton = document.getElementById('scan-button');
const scannerContainer = document.getElementById('scanner-container');

// 🔍 Recherche manuelle
searchForm.addEventListener('submit', function(e) {
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
          <button onclick="ajouterLivre('${book.title.replace(/'/g, "\\'")}', '${(book.authors ? book.authors.join(', ') : 'Inconnu').replace(/'/g, "\\'")}', '${book.imageLinks?.thumbnail || ''}')">Ajouter à ma collection</button>
        `;
        resultsContainer.appendChild(bookElement);
      });
    })
    .catch(err => {
      console.error('Erreur API', err);
      resultsContainer.innerHTML = '<p>Une erreur est survenue lors de la recherche.</p>';
    });
}

function ajouterLivre(title, authors, thumbnail) {
  const book = { title, authors, thumbnail };
  let collection = JSON.parse(localStorage.getItem('collection')) || [];
  collection.push(book);
  localStorage.setItem('collection', JSON.stringify(collection));
  alert(`"${title}" ajouté à votre collection !`);
}

// 📷 Scanner un ISBN
scanButton.addEventListener('click', function() {
  scannerContainer.style.display = 'block';
  if (!document.getElementById('cancel-scan')) {
    const cancelButton = document.createElement('button');
    cancelButton.id = 'cancel-scan';
    cancelButton.textContent = '❌ Annuler';
    cancelButton.style.marginTop = '10px';
    scannerContainer.appendChild(cancelButton);

    cancelButton.addEventListener('click', () => {
      Quagga.stop();
      scannerContainer.style.display = 'none';
    });
  }

  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#scanner'),
      constraints: {
        facingMode: "environment"
      }
    },
    decoder: {
      readers: ["ean_reader"]
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
    searchInput.value = code;
    lancerRecherche(code);
  });
});
