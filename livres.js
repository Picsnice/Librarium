import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJ3jYAV_Gezs15BXksrlAltDreRyinsyo",
  authDomain: "librarium-b4c0d.firebaseapp.com",
  projectId: "librarium-b4c0d",
  storageBucket: "librarium-b4c0d.firebasestorage.app",
  messagingSenderId: "1441664273",
  appId: "1:1441664273:web:fdcaa227a96992c5e0d0b0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const livresContainer = document.getElementById('livres');

async function afficherCollection() {
  try {
    const q = query(collection(db, "livres"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      livresContainer.innerHTML = "<p>Aucun livre dans votre collection.</p>";
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

      livresContainer.appendChild(livreDiv);
    });

  } catch (error) {
    console.error("Erreur lors du chargement des livres :", error);
    livresContainer.innerHTML = "<p>Erreur de chargement. Vérifie ta connexion.</p>";
  }
}

document.addEventListener('DOMContentLoaded', afficherCollection);

const boutonAjouter = document.getElementById('go-to-search');
if (boutonAjouter) {
  boutonAjouter.addEventListener('click', () => {
    window.location.href = 'ajouter-livre.html';
  });
}
