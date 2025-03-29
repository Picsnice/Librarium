// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, addDoc, collection, Timestamp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCJ3jYAV_Gezs15BXksrlAltDreRyinsyo",
  authDomain: "librarium-b4c0d.firebaseapp.com",
  projectId: "librarium-b4c0d",
  storageBucket: "librarium-b4c0d.firebasestorage.app",
  messagingSenderId: "1441664273",
  appId: "1:1441664273:web:fdcaa227a96992c5e0d0b0"
};

// Init Firebase + Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Récupération des éléments HTML
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const typeSelector = document.getElementById('type');
const resultsContainer = document.getElementById('results');
const startScanButton = document.getElementById('start-scan');
const stopScanButton = document.getElementById('stop-scan');
const scannerDiv = document.getElementById('scanner');

let html5QrcodeScanner;

// Recherche Google Books
searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const query = searchInput.value;
  lancerRecherche(query);
});

function lancerRecherche(query) {
// Recherche via Google Books (livres et BD)
fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=AIzaSyD6ZoSkNp9fHsyWdJe0kB8uVqv9hC_oH9s`)
  .then(response => response.json())
  .then(data => {
    if (!data.items || data.items.length === 0) {
      resultsContainer.innerHTML = '<p>Aucun résultat trouvé.</p>';
      return;
    }

    data.items.forEach(item => {
      const book = item.volumeInfo;
      const title = book.title;
      const authors = book.authors ? book.authors.join(', ') : 'Inconnu';
      const thumbnail = book.imageLinks?.thumbnail || '';
      const publisher = book.publisher || '';
      const fullTitle = book.title || '';

      // Extraction série et tome pour BD
      let series = '';
      let tome = '';

      if (type === 'bd') {
        const match = fullTitle.match(/^(.*?)(?:\s[-–]\s)?(?:Tome|T|T\.)?\s?#?(\d{1,3})/i);
        if (match) {
          series = match[1].trim();
          tome = match[2];
        }
      }

      const bookElement = document.createElement('div');
      bookElement.classList.add('book-result');
      bookElement.innerHTML = `
        <h3>${title}</h3>
        <p>Auteur(s) : ${authors}</p>
        ${publisher ? `<p>Éditeur : ${publisher}</p>` : ''}
        ${series ? `<p>Série : ${series}</p>` : ''}
        ${tome ? `<p>Tome : ${tome}</p>` : ''}
        ${thumbnail ? `<img src="${thumbnail}" alt="Couverture" style="max-height:150px;">` : ''}
        <p>${book.description ? book.description.substring(0, 150) + '...' : 'Pas de description disponible'}</p>
        <button onclick="ajouterLivre(
          '${title.replace(/'/g, "\\'")}', 
          '${authors.replace(/'/g, "\\'")}', 
          '${thumbnail}', 
          '${type}', 
          '${publisher.replace(/'/g, "\\'")}', 
          '${series.replace(/'/g, "\\'")}', 
          '${tome}')">Ajouter à ma collection</button>
      `;
      resultsContainer.appendChild(bookElement);
    });
  })
  .catch(err => {
    console.error('Erreur API Google Books', err);
    resultsContainer.innerHTML = '<p>Erreur lors de la recherche.</p>';
  });

}

// Fonction pour ajouter un livre ou une BD dans Firestore
async function ajouterLivre(title, authors, thumbnail) {
  const type = typeSelector.value;
  const collectionName = type === 'bd' ? 'bd' : 'livres';

  try {
    await addDoc(collection(db, collectionName), {
      title,
      authors,
      thumbnail,
      createdAt: Timestamp.now()
    });
    alert(`"${title}" ajouté à votre collection de ${type === 'bd' ? 'BD' : 'livres'} !`);
  } catch (error) {
    console.error("Erreur lors de l'ajout dans Firestore :", error);
    alert("Erreur lors de l'enregistrement.");
  }
}

// Scanner un code ISBN
startScanButton.addEventListener('click', () => {
  startScanButton.style.display = 'none';
  stopScanButton.style.display = 'inline-block';

  html5QrcodeScanner = new Html5Qrcode("scanner");

  Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {
      html5QrcodeScanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 100 } },
        (decodedText) => {
          html5QrcodeScanner.stop().then(() => {
            scannerDiv.innerHTML = "";
            startScanButton.style.display = "inline-block";
            stopScanButton.style.display = "none";
            searchInput.value = decodedText;
            lancerRecherche(decodedText);
          });
        }
      );
    }
  }).catch(err => {
    alert("Erreur d'accès à la caméra : " + err);
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

// ✅ Rendre la fonction accessible depuis le HTML
window.ajouterLivre = ajouterLivre;
