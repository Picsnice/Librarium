
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
    const type = document.getElementById('type').value;
    console.log("Type sélectionné :", type);

    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
  
    if (type === 'cd' || type === 'vinyle' || type === 'jeu') {
        if (type === 'jeu') {
            fetch(`https://api.rawg.io/api/games?key=a14c3397b9134a3c8f97f361ce178aff&search=${encodeURIComponent(query)}&page_size=10`)
              .then(response => response.json())
              .then(data => {
                if (!data.results || data.results.length === 0) {
                  resultsContainer.innerHTML = '<p>Aucun jeu trouvé.</p>';
                  return;
                }
          
                data.results.forEach(game => {
                  const title = game.name;
                  const authors = game.developers?.map(dev => dev.name).join(', ') || 'Inconnu';
                  const img = game.background_image || '';
          
                  const div = document.createElement('div');
                  div.classList.add('book-result');
                  div.innerHTML = `
                    <h3>${title}</h3>
                    <p>Développeur(s) : ${authors}</p>
                    ${img ? `<img src="${img}" alt="Visuel jeu" style="max-height:150px;">` : ''}
                    <button onclick="ajouterLivre('${title.replace(/'/g, "\\'")}', '${authors.replace(/'/g, "\\'")}', '${img}', 'jeu')">Ajouter à ma collection</button>
                  `;
                  resultsContainer.appendChild(div);
                });
              })
              .catch(err => {
                console.error("Erreur API jeux vidéo :", err);
                resultsContainer.innerHTML = '<p>Erreur lors de la recherche jeu vidéo.</p>';
              });
            return;
          }
          
        // Recherche via MusicBrainz
      fetch(`https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(query)}&fmt=json&limit=10`)
        .then(response => response.json())
        .then(data => {
          if (!data.releases || data.releases.length === 0) {
            resultsContainer.innerHTML = '<p>Aucun CD trouvé.</p>';
            return;
          }
  
          data.releases.forEach(release => {
            const title = release.title || "Sans titre";
            const authors = release['artist-credit']?.map(a => a.name).join(', ') || "Inconnu";
            const releaseId = release.id;
  
            const resultDiv = document.createElement('div');
            resultDiv.classList.add('book-result');
            resultDiv.innerHTML = `
              <h3>${title}</h3>
              <p>Artiste(s) : ${authors}</p>
              <p>Chargement de la pochette...</p>
              <button onclick="ajouterLivre('${title.replace(/'/g, "\\'")}', '${authors.replace(/'/g, "\\'")}', '', '${type}')">Ajouter à ma collection</button>

            `;
            resultsContainer.appendChild(resultDiv);
  
            // Ajout de la pochette via Cover Art Archive
            fetch(`https://coverartarchive.org/release/${releaseId}`)
              .then(res => res.json())
              .then(coverData => {
                const img = coverData.images?.[0]?.thumbnails?.large || coverData.images?.[0]?.image || '';
                if (img) {
                  resultDiv.querySelector('p:nth-of-type(2)').insertAdjacentHTML('afterend', `<img src="${img}" alt="Pochette" style="max-height:150px;">`);
                  resultDiv.querySelector('button').setAttribute('onclick',
                    `ajouterLivre('${title.replace(/'/g, "\\'")}', '${authors.replace(/'/g, "\\'")}', '${img}', '${type}')`);
                  
                                  }
              })
              .catch(() => {
                // pas de pochette dispo, on laisse vide
              });
          });
        })
        .catch(err => {
          console.error("Erreur MusicBrainz :", err);
          resultsContainer.innerHTML = '<p>Erreur lors de la recherche CD.</p>';
        });
  
    } else {
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

      // Extraction série et tome améliorée pour BD
      let series = '';
      let tome = '';

      if (type === 'bd') {
        const match = fullTitle.match(/^(.*?)(?:\s[-–:]?\s)?(?:T(?:ome)?|T|Vol\.?)\s?#?(\d{1,3})/i);
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
  }
  
  
  // Ajouter dans Firestore
  function ajouterLivre(title, authors, thumbnail, forcedType = null, publisher = '', series = '', tome = '') {
    const type = forcedType || document.getElementById('type').value;
  
    const collectionName = type === 'bd' ? 'bd' :
                          type === 'cd' ? 'cd' :
                          type === 'vinyle' ? 'vinyles' :
                          type === 'jeu' ? 'jeux' :
                          'livres';
  
                          const docData = {
                            title,
                            authors,
                            thumbnail,
                            publisher,
                            series,
                            tome: tome && !isNaN(tome) ? parseInt(tome, 10) : '',
                            createdAt: new Date()
                          };
  
    db.collection(collectionName).add(docData)
      .then(() => {
        alert(`"${title}" ajouté à votre collection de ${collectionName} !`);
      })
      .catch((error) => {
        console.error("Erreur Firestore :", error);
        alert("Erreur lors de l'ajout.");
      });
  }
  
  window.ajouterLivre = ajouterLivre;
  
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

  