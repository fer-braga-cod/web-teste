const firebaseConfig = {
    apiKey: "AIzaSyAq_prIeX49TqGM6U-2HfNkO_eRW8Du5Cc",
    authDomain: "pet-impedimentos.firebaseapp.com",
    databaseURL: "https://pet-impedimentos-default-rtdb.firebaseio.com",
    projectId: "pet-impedimentos",
    storageBucket: "pet-impedimentos.appspot.com",
    messagingSenderId: "954522036021",
    appId: "1:954522036021:web:87bbe3b635cbcbb113ce7c",
    measurementId: "G-5VR17YG7BM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();
      
db.collection("users").get().then((querySnapshot) => {
    const listaElementos = document.getElementById("lista-dados");
  
    querySnapshot.forEach((doc) => {
      const itemLista = document.createElement("li");
      itemLista.textContent = `${doc.id} => ${doc.data().nome}`; // Exibe nome e email
      listaElementos.appendChild(itemLista);
    });
  });
  
