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
      div.classList.add('livre', 'vinyle');
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

function afficherArtistes() {
  const container = document.getElementById("vinyle");
  container.innerHTML = "<h2>🎤 Artistes</h2>";

  db.collection("vinyle").orderBy("authors").get().then(snapshot => {
    const artisteMap = {};

    snapshot.forEach(doc => {
      const vinyle = doc.data();
      if (!vinyle.authors || !vinyle.authors.trim()) return;

      const key = vinyle.authors.trim().toLowerCase();
      if (!artisteMap[key]) {
        artisteMap[key] = {
          name: vinyle.authors.trim(),
          albums: []
        };
      }
      artisteMap[key].albums.push({ ...vinyle, id: doc.id });
    });

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
        albumDiv.classList.add('tome', 'livre', 'vinyle');
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

function supprimerDocument(id, type) {
  if (confirm("Supprimer ce document ?")) {
    db.collection(type).doc(id).delete()
      .then(() => location.reload())
      .catch(err => alert("Erreur suppression"));
  }
}

document.addEventListener("DOMContentLoaded", afficherAlbums);
window.afficherAlbums = afficherAlbums;
window.afficherArtistes = afficherArtistes;
