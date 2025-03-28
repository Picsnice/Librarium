const apiKey = 'AIzaSyD6ZoSkNp9fHsyWdJe0kB8uVqv9hC_oH9s';
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const typeSelector = document.getElementById('type');
const resultsContainer = document.getElementById('results');
const startScanButton = document.getElementById('start-scan');
const stopScanButton = document.getElementById('stop-scan');
const scannerDiv = document.getElementById('scanner');

let html5QrcodeScanner;

// 🔍 Recherche manuelle
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

// ➕ Ajout du livre ou BD selon sélection
function ajouterLivre(title, authors, thumbnail) {
    const typeSelector = document.getElementById('type');
    const type = typeSelector.value;
    const livre = { title, authors, thumbnail };
    let collectionKey = (type === 'bd') ? 'collectionBD' : 'collection';
  
    let collection = JSON.parse(localStorage.getItem(collectionKey)) || [];
    collection.push(livre);
    localStorage.setItem(collectionKey, JSON.stringify(collection));
    alert(`"${title}" ajouté à votre collection de ${type === 'bd' ? 'BD' : 'livres'} !`);
  }
  

// 📷 Scan via Html5Qrcode
startScanButton.addEventListener('click', () => {
  startScanButton.style.display = 'none';
  stopScanButton.style.display = 'inline-block';

  html5QrcodeScanner = new Html5Qrcode("scanner");

  Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {
      const cameraId = devices[0].id;

      html5QrcodeScanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 100 }
        },
        (decodedText, decodedResult) => {
          html5QrcodeScanner.stop().then(() => {
            scannerDiv.innerHTML = "";
            startScanButton.style.display = "inline-block";
            stopScanButton.style.display = "none";
            searchInput.value = decodedText;
            lancerRecherche(decodedText);
          });
        },
        errorMessage => {
          // Silencieux pour éviter les erreurs spam
        }
      );
    }
  }).catch(err => {
    alert("Erreur accès caméra : " + err);
  });
});

stopScanButton.addEventListener('click', () => {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.stop().then(() => {
      scannerDiv.innerHTML = "";
      startScanButton.style.display = "inline-block";
      stopScanButton.style.display = "none";
    });
  }
});
