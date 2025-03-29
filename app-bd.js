alert("Script app-bd.js v9999 chargé !");

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
            <button onclick="modifierDocument('${doc.id}', ${JSON.stringify(bd).replace(/'/g, "\\'")})">✏️ Modifier</button>
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
              <button onclick="modifierDocument('${doc.id}', ${JSON.stringify(bd).replace(/'/g, "\\'")})">✏️ Modifier</button>
              <button onclick="supprimerDocument('${doc.id}', 'bd')">🗑️ Supprimer</button>
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
  
  function modifierDocument(id, bd) {
    const container = document.getElementById("bd");
    const formDiv = document.createElement("div");
    formDiv.style.border = "1px dashed #999";
    formDiv.style.padding = "10px";
    formDiv.style.margin = "10px 0";
    formDiv.innerHTML = `
      <h4>Modifier "${bd.title}"</h4>
      <label>Titre : <input type="text" id="edit-title" value="${bd.title}"></label><br>
      <label>Auteur(s) : <input type="text" id="edit-authors" value="${bd.authors}"></label><br>
      <label>Éditeur : <input type="text" id="edit-publisher" value="${bd.publisher || ''}"></label><br>
      <label>Série : <input type="text" id="edit-series" value="${bd.series || ''}"></label><br>
      <label>Tome : <input type="number" id="edit-tome" value="${bd.tome || ''}"></label><br><br>
      <button onclick="enregistrerModification('${id}')">💾 Enregistrer</button>
      <button onclick="this.parentNode.remove()">❌ Annuler</button>
    `;
    container.prepend(formDiv);
  }
  
  function enregistrerModification(id) {
    const updatedData = {
      title: document.getElementById("edit-title").value,
      authors: document.getElementById("edit-authors").value,
      publisher: document.getElementById("edit-publisher").value,
      series: document.getElementById("edit-series").value,
      tome: parseInt(document.getElementById("edit-tome").value) || '',
    };
  
    db.collection("bd").doc(id).update(updatedData)
      .then(() => {
        alert("BD mise à jour !");
        location.reload();
      })
      .catch(err => {
        console.error("Erreur lors de la mise à jour :", err);
        alert("Échec de la mise à jour.");
      });
  }
document.addEventListener('DOMContentLoaded', afficherAlbums);
window.modifierDocument = modifierDocument;
window.enregistrerModification = enregistrerModification;
  