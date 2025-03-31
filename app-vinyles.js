// Affiche tous les vinyles
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
  
  // Affiche les vinyles regroupés par artiste
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
  
  // Fonction de suppression
  function supprimerDocument(id, type) {
    if (confirm("Supprimer ce document ?")) {
      db.collection(type).doc(id).delete()
        .then(() => {
          alert("Supprimé !");
          location.reload();
        })
        .catch(err => {
          console.error("Erreur suppression :", err);
          alert("Échec de la suppression.");
        });
    }
  }
  
  // Initialisation
  document.addEventListener("DOMContentLoaded", afficherAlbums);
  window.afficherAlbums = afficherAlbums;
  window.afficherArtistes = afficherArtistes;
  