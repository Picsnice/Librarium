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
  
  function afficherAlbums() {
    const container = document.getElementById("vinyle");
    container.innerHTML = "<h2>📚 Tous les Albums</h2>";
  
    db.collection("vinyle").get().then(snapshot => {
      if (snapshot.empty) {
        container.innerHTML += "<p>Aucun vinyle.</p>";
        return;
      }
  
      snapshot.forEach(doc => {
        const vinyle = doc.data();
        const div = document.createElement('div');
        div.classList.add('livre');
        div.innerHTML = `
          <h3>${vinyle.title}</h3>
          <p>Artiste : ${vinyle.authors}</p>
          ${vinyle.publisher ? `<p>Label : ${vinyle.publisher}</p>` : ''}
          ${vinyle.thumbnail ? `<img src="${vinyle.thumbnail}" alt="Couverture" style="max-height:150px;">` : ''}
          <br>
          <button onclick="supprimerDocument('${doc.id}', 'vinyle')">🗑️ Supprimer</button>
        `;
        container.appendChild(div);
      });
    });
  }
  
  function afficherVinyles() {
    const container = document.getElementById("vinyles");
    container.innerHTML = "";
  
    db.collection("vinyles").orderBy("createdAt", "desc").get()
      .then(snapshot => {
        if (snapshot.empty) {
          container.innerHTML = "<p>Aucun vinyle dans votre collection.</p>";
          return;
        }
  
        snapshot.forEach(doc => {
          const v = doc.data();
          const vDiv = document.createElement('div');
          vDiv.classList.add('livre');
          vDiv.innerHTML = `
            <h3>${v.title}</h3>
            <p>Artiste(s) : ${v.authors}</p>
            ${v.thumbnail ? `<img src="${v.thumbnail}" alt="Pochette" style="max-height:150px;">` : ''}
            <br>
            <button onclick="supprimerDocument('${doc.id}', 'vinyles')">🗑️ Supprimer</button>
          `;
          container.appendChild(vDiv);
        });
      })
      .catch(err => {
        console.error("Erreur Firestore :", err);
        container.innerHTML = "<p>Erreur de chargement.</p>";
      });
  }
  
  document.addEventListener('DOMContentLoaded', afficherVinyles);
  
  function supprimerDocument(id, collection) {
    if (confirm("Supprimer ce vinyle ?")) {
      db.collection(collection).doc(id).delete()
        .then(() => {
          alert("Vinyle supprimé.");
          location.reload();
        })
        .catch(error => {
          console.error("Erreur lors de la suppression :", error);
          alert("Erreur lors de la suppression.");
        });
    }
  }
  function afficherArtistes() {
    const container = document.getElementById("vinyle");
    container.innerHTML = "<h2>🎤 Artistes</h2>";
  
    db.collection("vinyle").orderBy("authors").get()
      .then(snapshot => {
        const artisteMap = {};
  
        snapshot.forEach(doc => {
          const vinyle = doc.data();
          if (!vinyle.authors || !vinyle.authors.trim()) return;
  
          const artistKey = vinyle.authors.trim().toLowerCase();
          if (!artisteMap[artistKey]) {
            artisteMap[artistKey] = {
              name: vinyle.authors.trim(),
              albums: []
            };
          }
          artisteMap[artistKey].albums.push({ ...vinyle, id: doc.id });
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
              <button onclick="supprimerDocument('${album.id}', 'vinyle')">🗑️ Supprimer</button>
              <hr>
            `;
            albumDiv.style.display = 'none';
            artisteDiv.appendChild(albumDiv);
          });
  
          container.appendChild(artisteDiv);
        });
      });
  }
  document.addEventListener("DOMContentLoaded", afficherAlbums);
  window.afficherAlbums = afficherAlbums;
  window.afficherArtistes = afficherArtistes;
  