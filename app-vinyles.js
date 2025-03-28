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
  