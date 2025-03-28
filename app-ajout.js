// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCJ3jYAV_Gezs15BXksrlAltDreRyinsyo",
    authDomain: "librarium-b4c0d.firebaseapp.com",
    projectId: "librarium-b4c0d",
    storageBucket: "librarium-b4c0d.firebasestorage.app",
    messagingSenderId: "1441664273",
    appId: "1:1441664273:web:fdcaa227a96992c5e0d0b0"
  };
  
  // Init Firebase
  window.firebase.initializeApp(firebaseConfig);
  const db = window.firebase.firestore();
  
  // Fonction d'ajout
  function ajouterLivre(title, authors, thumbnail) {
    const type = document.getElementById('type').value;
    const collectionName = type === 'bd' ? 'bd' : 'livres';
  
    db.collection(collectionName).add({
      title,
      authors,
      thumbnail,
      createdAt: new Date()
    }).then(() => {
      alert(`"${title}" ajouté à votre collection de ${collectionName} !`);
    }).catch((error) => {
      console.error("Erreur Firestore :", error);
      alert("Erreur lors de l'ajout.");
    });
  }
  
  // Rendre accessible depuis le HTML
  window.ajouterLivre = ajouterLivre;
  