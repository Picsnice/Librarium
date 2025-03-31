// Initialisation Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCJ3jYAV_Gezs15BXksrlAltDreRyinsyo",
    authDomain: "librarium-b4c0d.firebaseapp.com",
    projectId: "librarium-b4c0d",
    storageBucket: "librarium-b4c0d.appspot.com",
    messagingSenderId: "1441664273",
    appId: "1:1441664273:web:fdcaa227a96992c5e0d0b0"
  };
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Détection du type dans l'URL
  const params = new URLSearchParams(window.location.search);
  const urlType = params.get("type");
  if (urlType) document.getElementById("type").value = urlType;
  
  document.getElementById("search-form").addEventListener("submit", e => {
    e.preventDefault();
    const query = document.getElementById("search-input").value;
    const type = document.getElementById("type").value;
    lancerRecherche(query, type);
  });
  
  function lancerRecherche(query, type) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = "Recherche en cours...";
  
    if (type === "cd" || type === "vinyle") {
      fetch(`https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(query)}&fmt=json&limit=10`)
        .then(response => response.json())
        .then(data => {
          resultsContainer.innerHTML = "";
          if (!data.releases || data.releases.length === 0) {
            resultsContainer.innerHTML = "<p>Aucun résultat trouvé.</p>";
            return;
          }
  
          data.releases.forEach(release => {
            const title = release.title;
            const authors = release["artist-credit"]?.map(a => a.name).join(", ") || "Inconnu";
            const img = ""; // MusicBrainz ne fournit pas les pochettes directement
  
            const div = document.createElement("div");
            div.classList.add("book-result");
            div.innerHTML = `
              <h3>${title}</h3>
              <p>Artiste(s) : ${authors}</p>
              <button onclick="ajouterLivre('${title.replace(/'/g, "\\'")}', '${authors.replace(/'/g, "\\'")}', '${img}', '${type}')">Ajouter à ma collection</button>
            `;
            resultsContainer.appendChild(div);
          });
        })
        .catch(() => {
          resultsContainer.innerHTML = "<p>Erreur lors de la recherche.</p>";
        });
    } else {
      fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=AIzaSyD6ZoSkNp9fHsyWdJe0kB8uVqv9hC_oH9s`)
        .then(response => response.json())
        .then(data => {
          resultsContainer.innerHTML = "";
          if (!data.items || data.items.length === 0) {
            resultsContainer.innerHTML = "<p>Aucun résultat trouvé.</p>";
            return;
          }
  
          data.items.forEach(item => {
            const book = item.volumeInfo;
            const title = book.title;
            const authors = book.authors ? book.authors.join(", ") : "Inconnu";
            const img = book.imageLinks?.thumbnail || "";
            const publisher = book.publisher || "";
            const serie = "";
            const tome = "";
  
            const div = document.createElement("div");
            div.classList.add("book-result");
            div.innerHTML = `
              <h3>${title}</h3>
              <p>Auteur(s) : ${authors}</p>
              <img src="${img}" alt="Couverture" style="max-height:150px;">
              <button onclick="ajouterLivre('${title.replace(/'/g, "\\'")}', '${authors.replace(/'/g, "\\'")}', '${img}', '${type}', '${publisher}', '${serie}', '${tome}')">Ajouter à ma collection</button>
            `;
            resultsContainer.appendChild(div);
          });
        })
        .catch(() => {
          resultsContainer.innerHTML = "<p>Erreur lors de la recherche.</p>";
        });
    }
  }
  
  function ajouterLivre(title, authors, thumbnail, type, publisher = "", series = "", tome = "") {
    const docRef = db.collection(type).doc();
    docRef.set({
      title,
      authors,
      thumbnail,
      publisher,
      series,
      tome
    })
      .then(() => {
        alert("Ajouté à votre collection !");
      })
      .catch(err => {
        console.error("Erreur ajout :", err);
        alert("Erreur lors de l'ajout.");
      });
  }
  