// Firebase config
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
  
  function afficherBD() {
    const container = document.getElementById("bd");
    container.innerHTML = "";
  
    db.collection("bd").orderBy("createdAt", "desc").get()
      .then(snapshot => {
        if (snapshot.empty) {
          container.innerHTML = "<p>Aucune BD dans votre collection.</p>";
          return;
        }
  
        snapshot.forEach(doc => {
          const bd = doc.data();
          const bdDiv = document.createElement('div');
          bdDiv.classList.add('livre');
          bdDiv.innerHTML = `
            <h3>${bd.title}</h3>
            <p>Auteur(s) : ${bd.authors}</p>
            ${bd.thumbnail ? `<img src="${bd.thumbnail}" alt="Couverture" style="max-height:150px;">` : ''}
          `;
          container.appendChild(bdDiv);
        });
      })
      .catch(err => {
        console.error("Erreur Firestore :", err);
        container.innerHTML = "<p>Erreur de chargement.</p>";
      });
  }
  
  document.addEventListener('DOMContentLoaded', afficherBD);
  