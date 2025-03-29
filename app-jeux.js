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
  
  function afficherJeux() {
    const container = document.getElementById("jeux");
    container.innerHTML = "";
  
    db.collection("jeux").orderBy("createdAt", "desc").get()
      .then(snapshot => {
        if (snapshot.empty) {
          container.innerHTML = "<p>Aucun jeu dans votre collection.</p>";
          return;
        }
  
        snapshot.forEach(doc => {
          const jeu = doc.data();
          const div = document.createElement('div');
          div.classList.add('livre');
          div.innerHTML = `
            <h3>${jeu.title}</h3>
            <p>Développeur(s) : ${jeu.authors}</p>
            ${jeu.thumbnail ? `<img src="${jeu.thumbnail}" alt="Visuel" style="max-height:150px;">` : ''}
            <br>
            <button onclick="supprimerDocument('${doc.id}', 'jeux')">🗑️ Supprimer</button>
          `;
          container.appendChild(div);
        });
      })
      .catch(err => {
        console.error("Erreur Firestore :", err);
        container.innerHTML = "<p>Erreur de chargement.</p>";
      });
  }
  
  document.addEventListener('DOMContentLoaded', afficherJeux);
  
  function supprimerDocument(id, collection) {
    if (confirm("Supprimer ce jeu ?")) {
      db.collection(collection).doc(id).delete()
        .then(() => {
          alert("Jeu supprimé.");
          location.reload();
        })
        .catch(error => {
          console.error("Erreur lors de la suppression :", error);
          alert("Erreur lors de la suppression.");
        });
    }
  }
  