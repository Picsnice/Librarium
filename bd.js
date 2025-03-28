const bdContainer = document.getElementById('bd');

async function afficherBD() {
  try {
    const snapshot = await window.db.collection('bd').orderBy('createdAt', 'desc').get();

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
