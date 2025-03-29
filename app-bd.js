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
    const container = document.getElementById("bd");
    container.innerHTML = "<h2>📚 Tous les Albums</h2>";
  
    db.collection("bd").orderBy("title").get()
      .then(snapshot => {
        if (snapshot.empty) {
          container.innerHTML += "<p>Aucune BD.</p>";
          return;
        }
  
        snapshot.forEach(doc => {
          const bd = doc.data();
          const div = document.createElement('div');
          div.classList.add('livre');
          div.innerHTML = `
            <h3>${bd.title}</h3>
            <p>Auteur(s) : ${bd.authors}</p>
            ${bd.publisher ? `<p>Éditeur : ${bd.publisher}</p>` : ''}
            ${bd.series ? `<p>Série : ${bd.series}</p>` : ''}
            ${bd.tome ? `<p>Tome : ${bd.tome}</p>` : ''}
            ${bd.thumbnail ? `<img src="${bd.thumbnail}" alt="Couverture" style="max-height:150px;">` : ''}
            <br>
            <button onclick="supprimerDocument('${doc.id}', 'bd')">🗑️ Supprimer</button>
          `;
          container.appendChild(div);
        });
      });
  }
  
  function afficherSeries() {
    const container = document.getElementById("bd");
    container.innerHTML = "<h2>🗂️ Séries</h2>";
  
    db.collection("bd").orderBy("series").orderBy("tome").get()
      .then(snapshot => {
        const seriesMap = {};
  
        snapshot.forEach(doc => {
          const bd = doc.data();
          if (!bd.series) return;
          if (!seriesMap[bd.series]) seriesMap[bd.series] = [];
          seriesMap[bd.series].push({ ...bd, id: doc.id });
        });
  
        if (Object.keys(seriesMap).length === 0) {
          container.innerHTML += "<p>Aucune série détectée.</p>";
          return;
        }
  
        Object.keys(seriesMap).forEach(serie => {
          const serieDiv = document.createElement('div');
          serieDiv.classList.add('serie');
  
          const title = document.createElement('div');
          title.classList.add('serie-title');
          title.textContent = serie;
          title.onclick = () => {
            const visible = serieDiv.querySelectorAll('.tome').length > 0;
            serieDiv.querySelectorAll('.tome').forEach(t => t.style.display = visible ? 'none' : 'block');
          };
  
          serieDiv.appendChild(title);
  
          seriesMap[serie].forEach(tome => {
            const tomeDiv = document.createElement('div');
            tomeDiv.classList.add('tome');
            tomeDiv.innerHTML = `
              <strong>Tome ${tome.tome}:</strong> ${tome.title}
              ${tome.thumbnail ? `<br><img src="${tome.thumbnail}" alt="Couverture" style="max-height:100px;">` : ''}
              <br>
              <button onclick="supprimerDocument('${tome.id}', 'bd')">🗑️ Supprimer</button>
              <hr>
            `;
            tomeDiv.style.display = 'none';
            serieDiv.appendChild(tomeDiv);
          });
  
          container.appendChild(serieDiv);
        });
      });
  }
  
  function supprimerDocument(id, collection) {
    if (confirm("Supprimer cette BD ?")) {
      db.collection(collection).doc(id).delete()
        .then(() => {
          alert("BD supprimée.");
          location.reload();
        })
        .catch(error => {
          console.error("Erreur lors de la suppression :", error);
          alert("Erreur lors de la suppression.");
        });
    }
  }
  
  document.addEventListener('DOMContentLoaded', afficherAlbums);
  