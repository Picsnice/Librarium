const livresContainer = document.getElementById('livres');

async function afficherCollection() {
  try {
    const snapshot = await window.db.collection('livres').orderBy('createdAt', 'desc').get();

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

// Redirection bouton
const boutonAjouter = document.getElementById('go-to-search');
if (boutonAjouter) {
  boutonAjouter.addEventListener('click', () => {
    window.location.href = 'ajouter-livre.html';
  });
}
