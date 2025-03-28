// Détection type via URL
const urlParams = new URLSearchParams(window.location.search);
const preselectedType = urlParams.get('type');
if (preselectedType) {
  document.addEventListener('DOMContentLoaded', () => {
    const typeSelect = document.getElementById('type');
    if (typeSelect) {
      typeSelect.value = preselectedType;
    }
  });
}

// Config Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCJ3jYAV_Gezs15BXksrlAltDreRyinsyo",
    authDomain: "librarium-b4c0d.firebaseapp.com",
    projectId: "librarium-b4c0d",
    storageBucket: "librarium-b4c0d.firebasestorage.app",
    messagingSenderId: "1441664273",
    appId: "1:1441664273:web:fdcaa227a96992c5e0d0b0"
  };
  
  // Init Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Rechercher dans l'API Google Books
  document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const query = document.getElementById('search-input').value;
    lancerRecherche(query);
  });
  
  function lancerRecherche(query) {
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=AIzaSyD6ZoSkNp9fHsyWdJe0kB8uVqv9hC_oH9s`)
      .then(response => response.json())
      .then(data => {
        const resultsContainer = document.getElementById('results');
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
        document.getElementById('results').innerHTML = '<p>Erreur lors de la recherche.</p>';
      });
  }
  
  // Ajouter dans Firestore
  function ajouterLivre(title, authors, thumbnail) {
    const type = document.getElementById('type').value;
    const collectionName = type === 'bd' ? 'bd' : 'livres';
  
    db.collection(collectionName).add({
      title,
      authors,
      thumbnail,
      createdAt: new Date()
    }).then(() => {
      alert(`"${title}" ajouté à votre collection de ${collectionName} !`);
    }).catch((error) => {
      console.error("Erreur Firestore :", error);
      alert("Erreur lors de l'ajout.");
    });
  }
  
  // Rendre la fonction accessible
  window.ajouterLivre = ajouterLivre;
  