const bdContainer = document.getElementById('bd');

function afficherBD() {
  const collectionBD = JSON.parse(localStorage.getItem('collectionBD')) || [];

  if (collectionBD.length === 0) {
    bdContainer.innerHTML = "<p>Aucune BD dans votre collection.</p>";
    return;
  }

  collectionBD.forEach((bd, index) => {
    const bdDiv = document.createElement('div');
    bdDiv.classList.add('livre');

    bdDiv.innerHTML = `
      <h3>${bd.title}</h3>
      <p>Auteur(s) : ${bd.authors}</p>
      ${bd.thumbnail ? `<img src="${bd.thumbnail}" alt="Couverture" style="max-height:150px;">` : ''}
      <button onclick="supprimerBD(${index})">❌ Retirer</button>
    `;

    bdContainer.appendChild(bdDiv);
  });
}

function supprimerBD(index) {
  let collectionBD = JSON.parse(localStorage.getItem('collectionBD')) || [];
  collectionBD.splice(index, 1);
  localStorage.setItem('collectionBD', JSON.stringify(collectionBD));
  location.reload();
}

document.addEventListener('DOMContentLoaded', afficherBD);
