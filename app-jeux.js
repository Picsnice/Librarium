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
  
  function afficherJeux() {
    const container = document.getElementById("jeu");
    container.innerHTML = "<h2>🎮 Jeux Vidéo</h2>";
  
    db.collection("jeu").orderBy("title").get().then(snapshot => {
      if (snapshot.empty) {
        container.innerHTML += "<p>Aucun jeu trouvé.</p>";
        return;
      }
  
      snapshot.forEach(doc => {
        const jeu = doc.data();
        const div = document.createElement("div");
        div.classList.add("livre", "jeu");
        div.innerHTML = `
          <h3>${jeu.title}</h3>
          <p>Développeur(s) : ${jeu.authors}</p>
          ${jeu.thumbnail ? `<img src="${jeu.thumbnail}" alt="Visuel" style="max-height:150px;">` : ""}
          <br>
          <button onclick="supprimerDocument('${doc.id}', 'jeu')">🗑️ Supprimer</button>
        `;
        container.appendChild(div);
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
  
  document.addEventListener("DOMContentLoaded", afficherJeux);
  