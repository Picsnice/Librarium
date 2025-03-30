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
  
          // Génération d’un bloc avec data-attributes
          div.innerHTML = `
            <h3>${bd.title}</h3>
            <p>Auteur(s) : ${bd.authors}</p>
            ${bd.publisher ? `<p>Éditeur : ${bd.publisher}</p>` : ''}
            ${bd.series ? `<p>Série : ${bd.series}</p>` : ''}
            ${bd.tome ? `<p>Tome : ${bd.tome}</p>` : ''}
            ${bd.thumbnail ? `<img src="${bd.thumbnail}" alt="Couverture" style="max-height:150px;">` : ''}
            <br>
            <button onclick="modifierDocument('${doc.id}', this)">✏️ Modifier</button>
            <button onclick="supprimerDocument('${doc.id}', 'bd')">🗑️ Supprimer</button>
          `;
          
          // Ajout des données au bouton
          const modifierBtn = div.querySelector("button");
          modifierBtn.dataset.title = bd.title;
          modifierBtn.dataset.authors = bd.authors;
          modifierBtn.dataset.publisher = bd.publisher || '';
          modifierBtn.dataset.series = bd.series || '';
          modifierBtn.dataset.tome = bd.tome || '';
  
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
          if (!bd.series || !bd.series.trim()) return;
  
          const seriesKey = bd.series.trim().toLowerCase();
          if (!seriesMap[seriesKey]) {
            seriesMap[seriesKey] = {
              name: bd.series.trim(),
              tomes: []
            };
          }
          seriesMap[seriesKey].tomes.push({ ...bd, id: doc.id });
        });
  
        if (Object.keys(seriesMap).length === 0) {
          container.innerHTML += "<p>Aucune série détectée.</p>";
          return;
        }
  
        Object.values(seriesMap).forEach(serieObj => {
          const serieDiv = document.createElement('div');
          serieDiv.classList.add('serie');
  
          const title = document.createElement('div');
          title.classList.add('serie-title');
          title.textContent = serieObj.name;
          title.onclick = () => {
            const visible = serieDiv.querySelectorAll('.tome')[0]?.style.display !== 'none';
            serieDiv.querySelectorAll('.tome').forEach(t => t.style.display = visible ? 'none' : 'block');
          };
  
          serieDiv.appendChild(title);
  
          serieObj.tomes.forEach(tome => {
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
  
  function modifierDocument(id, button) {
    const container = document.getElementById("bd");
  
    const formDiv = document.createElement("div");
    formDiv.style.border = "1px dashed #999";
    formDiv.style.padding = "10px";
    formDiv.style.margin = "10px 0";
  
    formDiv.innerHTML = `
      <h4>Modifier "${button.dataset.title}"</h4>
      <label>Titre : <input type="text" id="edit-title" value="${button.dataset.title}"></label><br>
      <label>Auteur(s) : <input type="text" id="edit-authors" value="${button.dataset.authors}"></label><br>
      <label>Éditeur : <input type="text" id="edit-publisher" value="${button.dataset.publisher}"></label><br>
      <label>Série : <input type="text" id="edit-series" value="${button.dataset.series}"></label><br>
      <label>Tome : <input type="number" id="edit-tome" value="${button.dataset.tome}"></label><br><br>
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
  