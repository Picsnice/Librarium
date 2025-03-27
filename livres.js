const collectionList = document.getElementById('collection-livres');
const triSelect = document.getElementById('tri');
const btnAjout = document.getElementById('go-to-search');

btnAjout.addEventListener('click', () => {
  window.location.href = "ajouter-livre.html";
  ; // Remplace par ta future page de recherche dédiée si besoin
});

function chargerCollection() {
  let collection = JSON.parse(localStorage.getItem('collection')) || [];
  const critere = triSelect.value;

  // Trie la collection selon le critère choisi
  collection.sort((a, b) => {
    const valA = (a[critere] || '').toLowerCase();
    const valB = (b[critere] || '').toLowerCase();
    return valA.localeCompare(valB);
  });

  collectionList.innerHTML = '';

  if (collection.length === 0) {
    collectionList.innerHTML = '<p>Aucun livre pour le moment.</p>';
    return;
  }

  collection.forEach(book => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h3>${book.title}</h3>
      <p>Auteur(s) : ${book.authors}</p>
      <img src="${book.thumbnail}" alt="Couverture" style="max-height:150px;">
    `;
    collectionList.appendChild(li);
  });
}

triSelect.addEventListener('change', chargerCollection);
document.addEventListener('DOMContentLoaded', chargerCollection);
