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

const bdContainer = document.getElementById('bd');

async function afficherBD() {
  try {
    const q = query(collection(db, "bd"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      bdContainer.innerHTML = "<p>Aucune BD dans votre collection.</p>";
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

      bdContainer.appendChild(bdDiv);
    });

  } catch (error) {
    console.error("Erreur lors du chargement des BD :", error);
    bdContainer.innerHTML = "<p>Erreur de chargement. Vérifie ta connexion.</p>";
  }
}

document.addEventListener('DOMContentLoaded', afficherBD);
