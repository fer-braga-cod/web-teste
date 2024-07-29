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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function cadastrar(){
    const input = document.getElementById("field").value;

    db.collection("users").add({
        nome: input,
        x1: ['07:15', false, false, false, false],
        x2: ['09:25', false, false, false, false],
        x3: ['13:15', false, false, false, false],
        x4: ['15:25', false, false, false, false],
        x5: ['17:30', false, false, false, false],
        x6: ['18:30', false, false, false, false],
        x7: ['20:40', false, false, false, false]
    })
    .then(() => {
        console.log("Cadastro Realizado!");
    })
    .catch((error) => {
        console.error("Erro no cadastro: ", error);
    });
}

document.getElementById("cadastro").onclick = function()
{cadastrar()};

