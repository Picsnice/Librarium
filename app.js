// Config Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCJ3jYAV_Gezs15BXksrlAltDreRyinsyo",
    authDomain: "librarium-b4c0d.firebaseapp.com",
    projectId: "librarium-b4c0d",
    storageBucket: "librarium-b4c0d.firebasestorage.app",
    messagingSenderId: "1441664273",
    appId: "1:1441664273:web:fdcaa227a96992c5e0d0b0"
  };
  
  // Init Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Afficher les livres
  function afficherLivres() {
    const container = document.getElementById("livres");
    container.innerHTML = "";
  
    db.collection("livres").orderBy("createdAt", "desc").get()
      .then(snapshot => {
        if (snapshot.empty) {
          container.innerHTML = "<p>Aucun livre dans votre collection.</p>";
          return;
        }
  
        snapshot.forEach(doc => {
          const livre = doc.data();
          const livreDiv = document.createElement('div');
          livreDiv.classList.add('livre');
          livreDiv.innerHTML = `
          <h3>${livre.title}</h3>
          <p>Auteur(s) : ${livre.authors}</p>
          ${livre.thumbnail ? `<img src="${livre.thumbnail}" alt="Couverture" style="max-height:150px;">` : ''}
          <br>
          <button onclick="supprimerDocument('${doc.id}', 'livres')">🗑️ Supprimer</button>
        `;
        
          container.appendChild(livreDiv);
        });
      })
      .catch(err => {
        console.error("Erreur Firestore :", err);
        container.innerHTML = "<p>Erreur de chargement.</p>";
      });
  }
  function supprimerDocument(id, collection) {
    if (confirm("Supprimer ce document ?")) {
      db.collection(collection).doc(id).delete()
        .then(() => {
          alert("Document supprimé.");
          location.reload();
        })
        .catch(error => {
          console.error("Erreur lors de la suppression :", error);
          alert("Erreur lors de la suppression.");
        });
    }
  }
  
  document.addEventListener('DOMContentLoaded', afficherLivres);
  