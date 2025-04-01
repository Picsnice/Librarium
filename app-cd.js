// Config Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCJ3jYAV_Gezs15BXksrlAltDreRyinsyo",
    authDomain: "librarium-b4c0d.firebaseapp.com",
    projectId: "librarium-b4c0d",
    storageBucket: "librarium-b4c0d.firebasestorage.app",
    messagingSenderId: "1441664273",
    appId: "1:1441664273:web:fdcaa227a96992c5e0d0b0"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  function afficherCD() {
    const container = document.getElementById("cd");
    container.innerHTML = "";
  
    db.collection("cd").orderBy("createdAt", "desc").get()
      .then(snapshot => {
        if (snapshot.empty) {
          container.innerHTML = "<p>Aucun CD dans votre collection.</p>";
          return;
        }
  
        snapshot.forEach(doc => {
          const cd = doc.data();
          const cdDiv = document.createElement('div');
          cdDiv.classList.add('livre');
          cdDiv.innerHTML = `
  <h3>${cd.title}</h3>
  <p>Auteur(s) : ${cd.authors}</p>
  ${cd.thumbnail ? `<img src="${cd.thumbnail}" alt="Pochette" style="max-height:150px;">` : ''}
  <br>
  <button onclick="supprimerDocument('${doc.id}', 'cd')">🗑️ Supprimer</button>
`;

          container.appendChild(cdDiv);
        });
      })
      .catch(err => {
        console.error("Erreur Firestore :", err);
        container.innerHTML = "<p>Erreur de chargement.</p>";
      });
  }
  function supprimerDocument(id, collection) {
    if (confirm("Supprimer ce CD ?")) {
      db.collection(collection).doc(id).delete()
        .then(() => {
          alert("CD supprimé.");
          location.reload();
        })
        .catch(error => {
          console.error("Erreur lors de la suppression :", error);
          alert("Erreur lors de la suppression.");
        });
    }
  }
  function afficherArtistes() {
    const container = document.getElementById("cd");
    container.innerHTML = "<h2>🎤 Artistes</h2>";
  
    db.collection("cd").orderBy("authors").get()
      .then(snapshot => {
        const artisteMap = {};
  
        snapshot.forEach(doc => {
          const cd = doc.data();
          if (!cd.authors || !cd.authors.trim()) return;
  
          const artistKey = cd.authors.trim().toLowerCase();
          if (!artisteMap[artistKey]) {
            artisteMap[artistKey] = {
              name: cd.authors.trim(),
              albums: []
            };
          }
          artisteMap[artistKey].albums.push({ ...cd, id: doc.id });
        });
  
        if (Object.keys(artisteMap).length === 0) {
          container.innerHTML += "<p>Aucun artiste trouvé.</p>";
          return;
        }
  
        Object.values(artisteMap).forEach(artiste => {
          const artisteDiv = document.createElement('div');
          artisteDiv.classList.add('serie');
  
          const title = document.createElement('div');
          title.classList.add('serie-title');
          title.textContent = artiste.name;
          title.onclick = () => {
            const visible = artisteDiv.querySelectorAll('.tome')[0]?.style.display !== 'none';
            artisteDiv.querySelectorAll('.tome').forEach(t => t.style.display = visible ? 'none' : 'block');
          };
  
          artisteDiv.appendChild(title);
  
          artiste.albums.forEach(album => {
            const albumDiv = document.createElement('div');
            albumDiv.classList.add('tome');
            albumDiv.innerHTML = `
              <strong>${album.title}</strong>
              ${album.thumbnail ? `<br><img src="${album.thumbnail}" alt="Couverture" style="max-height:100px;">` : ''}
              <br>
              <button onclick="supprimerDocument('${album.id}', 'cd')">🗑️ Supprimer</button>
              <hr>
            `;
            albumDiv.style.display = 'none';
            artisteDiv.appendChild(albumDiv);
          });
  
          container.appendChild(artisteDiv);
        });
      });
  }
  
  document.addEventListener('DOMContentLoaded', afficherCD);
  