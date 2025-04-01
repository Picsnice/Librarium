// firebase-config.js

// Remplacez les valeurs ci-dessous par celles fournies par votre console Firebase
var firebaseConfig = {
    apiKey: "VotreApiKey",
    authDomain: "VotreAuthDomain",
    projectId: "VotreProjectId",
    storageBucket: "VotreStorageBucket",
    messagingSenderId: "VotreMessagingSenderId",
    appId: "VotreAppId"
  };
  
  // Initialiser Firebase
  firebase.initializeApp(firebaseConfig);
  // Initialiser Firestore
  var db = firebase.firestore();
  