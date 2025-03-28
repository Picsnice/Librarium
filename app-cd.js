// Config Firebase
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
  
  function afficherCD() {
    const container = document.getElementById("cd");
    container.innerHTML = "";
  
    db.collection("cd").orderBy("createdAt", "desc").get()
      .then(snapshot => {
        if (snapshot.empty) {
          container.innerHTML = "<p>Aucun CD dans votre collection.</p>";
          return;
        }
  
        snapshot.forEach(doc => {
          const cd = doc.data();
          const cdDiv = document.createElement('div');
          cdDiv.classList.add('livre');
          cdDiv.innerHTML = `
            <h3>${cd.title}</h3>
            <p>Auteur(s) : ${cd.authors}</p>
            ${cd.thumbnail ? `<img src="${cd.thumbnail}" alt="Pochette" style="max-height:150px;">` : ''}
          `;
          container.appendChild(cdDiv);
        });
      })
      .catch(err => {
        console.error("Erreur Firestore :", err);
        container.innerHTML = "<p>Erreur de chargement.</p>";
      });
  }
  
  document.addEventListener('DOMContentLoaded', afficherCD);
  