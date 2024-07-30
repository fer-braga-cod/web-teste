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

function gerarTabela(){
    const tbody = document.querySelector("tbody");
    for(var l = 0; l < 7; l++){
        const row = document.createElement("tr");
        for (var i = 0; i < 6; i++) {
            const cell = row.insertCell();
            const div = document.createElement("div");
            div.className = 'nomes';
            cell.appendChild(div);        
        }
        tbody.appendChild(row);
    }
}

function gerarDropdown(){
    const collectionRef = db.collection('users');

    collectionRef.get()
    .then(snapshot => {
        snapshot.docs.forEach(doc => {
        const nome = doc.data().nome;
        const lista = document.querySelector('.content');
        const label = document.createElement("label");
        label.textContent = nome;
        const input = document.createElement("input");
        input.type = 'checkbox';
        input.value = nome;
        label.appendChild(input);
        lista.appendChild(label);
        });
    })
    .catch(error => {
        console.error("Erro ao buscar dados:", error);
    });
}

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
              if ((typeof dados[coluna]) == "string") {
                cell.textContent = dados[coluna];
              }else if(dados[coluna]){
                cell.style.backgroundColor = "hsl(0, 0%, 90%)"; 
                const ul = document.createElement("ul");
                ul.textContent = usuario.nome;
                ul.className = 'nome';
                ul.style.backgroundColor = usuario.cor;                  
                const div = cell.querySelector("div");
                div.appendChild(ul); 
              }
            }
            linha++;
        }
        marcarFiltro(usuario.nome, usuario.cor);    
      } else {
        console.error(`Documento não encontrado para o usuário: ${usuarioSelecionado}`);
      }
    });
}

function buscarUsuario(nome) {
    const usersRef = db.collection('users');
  
    let userId;
  
    usersRef.where('nome', '==', nome)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('Nenhum usuário encontrado com esse nome.');
        } else {
          snapshot.docs.forEach(doc => {
            getHorarios(doc.id);
          });
        }
      })
      .catch(error => {
        console.error('Erro ao buscar usuário:', error);
      });
  
    return userId;
}

function marcarFiltro(nome, cor){
  const ul = document.createElement("ul");
  ul.textContent = nome;
  ul.className = 'nome';
  ul.style.backgroundColor = cor;   
  const container = document.querySelector("#container");
  container.appendChild(ul);
}

function limparTabela(){
  tbody.innerHTML = "";
  gerarTabela();
  container.innerHTML = "";

  var checkboxes = document.querySelectorAll('input[type="checkbox"]');  
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
}
  

const usuarios = document.querySelector('.content');
usuarios.addEventListener('change', (event) => {
  const checkbox = event.target;
  if (checkbox.checked) {    
    buscarUsuario(checkbox.value);    
  }else{
    limparTabela();
  }
});

document.getElementById("clear").onclick = function()
{limparTabela()};

gerarTabela();
gerarDropdown();
const tbody = document.querySelector("tbody");
const container = document.querySelector("#container");