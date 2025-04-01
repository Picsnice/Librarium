// app.js

document.addEventListener("DOMContentLoaded", function() {
  // Récupérer la référence de l'élément pour afficher les collections
  var collectionsList = document.getElementById('collections-list');

  // Récupérer les données de la collection "collections" dans Firestore
  db.collection("collections")
    .orderBy("titre")
    .limit(20)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        var data = doc.data();
        var li = document.createElement("li");
        li.textContent = data.titre + " (" + data.type + ")";
        collectionsList.appendChild(li);
      });
    })
    .catch(function(error) {
      console.error("Erreur lors du chargement des collections : ", error);
      collectionsList.innerHTML = "<li>Erreur de chargement des données</li>";
    });
});
