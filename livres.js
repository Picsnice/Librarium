const livresContainer = document.getElementById('livres');

function afficherCollection() {
  const collection = JSON.parse(localStorage.getItem('collection')) || [];

  if (collection.length === 0) {
    livresContainer.innerHTML = "<p>Aucun livre dans votre collection.</p>";
    return;
  }

  collection.forEach((livre, index) => {
    const livreDiv = document.createElement('div');
    livreDiv.classList.add('livre');

    livreDiv.innerHTML = `
      <h3>${livre.title}</h3>
      <p>Auteur(s) : ${livre.authors}</p>
      ${livre.thumbnail ? `<img src="${livre.thumbnail}" alt="Couverture" style="max-height:150px;">` : ''}
      <button onclick="supprimerLivre(${index})">❌ Retirer</button>
    `;

    livresContainer.appendChild(livreDiv);
  });
}

function supprimerLivre(index) {
  let collection = JSON.parse(localStorage.getItem('collection')) || [];
  collection.splice(index, 1);
  localStorage.setItem('collection', JSON.stringify(collection));
  location.reload();
}

document.addEventListener('DOMContentLoaded', afficherCollection);
