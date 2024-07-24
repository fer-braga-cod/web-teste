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


function getHorarios(usuarioSelecionado) {
    db.doc(`users/${usuarioSelecionado}`).get().then((doc) => {
      if (doc.exists) {
        const tbody = document.querySelector("tbody");        
  
        const usuario = doc.data();
        const horarios = [usuario.x1, usuario.x2, usuario.x3, usuario.x4, usuario.x5, usuario.x6, usuario.x7];        
        
        let linha = 0;
        for (const dados of horarios) {
            for (let coluna = 0; coluna < dados.length; coluna++) {
            const cell = tbody.rows[linha].cells[coluna];
            if (dados[coluna]) {
                cell.innerHTML += (cell.innerHTML ? '<br>' : '') + usuario.nome;
                cell.style.backgroundColor = "lightblue";
            }
            }
            linha++;
        }
      } else {
        console.error(`Documento não encontrado para o usuário: ${usuarioSelecionado}`);
      }
    });
}


function gerarTabela(){
    const tbody = document.querySelector("tbody");
    for(var l = 0; l < 8; l++){
        const row = document.createElement("tr");
        for (var i = 0; i < 5; i++) {
            const cell = row.insertCell();        
        }
        tbody.appendChild(row);
    }
}

const usuarios = document.querySelector('.usuarios');
usuarios.addEventListener('change', (event) => {
  const checkbox = event.target;
  if (checkbox.checked) {
    const selectedUser = checkbox.value;
    getHorarios(selectedUser);
  }else{
    tbody.innerHTML = "";
    gerarTabela();
  }
});


gerarTabela();
const tbody = document.querySelector("tbody");
