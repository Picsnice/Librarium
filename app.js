// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCJ3jYAV_Gezs15BXksrlAltDreRyinsyo",
    authDomain: "librarium-b4c0d.firebaseapp.com",
    projectId: "librarium-b4c0d",
    storageBucket: "librarium-b4c0d.firebasestorage.app",
    messagingSenderId: "1441664273",
    appId: "1:1441664273:web:fdcaa227a96992c5e0d0b0"
  };
  
  // Initialisation Firebase
  window.firebase.initializeApp(firebaseConfig);
  const db = window.firebase.firestore();
  
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
          `;
          container.appendChild(livreDiv);
        });
      })
      .catch(err => {
        console.error("Erreur Firestore :", err);
        container.innerHTML = "<p>Erreur de chargement.</p>";
      });
  }
  
  document.addEventListener('DOMContentLoaded', afficherLivres);
  