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

function gerarLinha(dados) {
  const row = document.createElement("tr");
  for (const valor of dados) {
      const cell = row.insertCell();
      cell.style.backgroundColor = valor === true ? "lightblue" : "";
  }
  return row;
}

function getHorarios(usuarioSelecionado) {
  db.doc(`users/${usuarioSelecionado}`).get().then((doc) => {
    if (doc.exists) {
      const tbody = document.querySelector("tbody");
      tbody.innerHTML = "";

      const usuario = doc.data();
      const horarios = [usuario.x1, usuario.x2, usuario.x3, usuario.x4, usuario.x5, usuario.x6, usuario.x7];

      for (const dados of horarios) {
          const linha = gerarLinha(dados);
          tbody.appendChild(linha);
      }
    } else {
      console.error(`Documento não encontrado para o usuário: ${usuarioSelecionado}`);
    }
  });
}


function confirmarMudanca(mensagem, callback) {
  const confirmacao = window.confirm(mensagem);
  if (confirmacao) {
    callback();
  }
}

function mudarHora(clickedCell) {
  const mensagem = "Tem certeza que deseja alterar essa hora?";

  confirmarMudanca(mensagem, () => {
    const usuarios = document.querySelector('.usuarios');
    const selectedUser = usuarios.querySelector('input[name="usuario"]:checked').value;

    db.doc(`users/${selectedUser}`).get().then((doc) => {
      if (doc.exists) {
        const row = clickedCell.parentNode;
        const rowIndex = row.rowIndex - 1;

        const usuario = doc.data();
        const horarios = [usuario.x1, usuario.x2, usuario.x3, usuario.x4, usuario.x5, usuario.x6, usuario.x7];

        const hora = horarios[rowIndex];
        const columnIndex = clickedCell.cellIndex;
        hora[columnIndex] = !hora[columnIndex];

        const docRef = db.doc(`users/${selectedUser}`);

        docRef.update({ [`x${rowIndex + 1}`]: hora }).then(() => {
          console.log("Horario atualizado!");
          clickedCell.style.backgroundColor = hora[columnIndex] === true ? "lightblue" : "";
        }).catch((error) => {
          console.error("Erro ao atualizar:", error);
        });
      } else {
        console.error(`Documento não encontrado para o usuário: ${selectedUser}`);
      }
    });
  });
}


function cellClick(event) {
  const clickedCell = event.target;
  if (clickedCell.tagName === "TD") {    
    mudarHora(clickedCell);   
  }
}

const usuarios = document.querySelector('.usuarios');
usuarios.addEventListener('change', (event) => {
  const selectedUser = event.target.value;
  getHorarios(selectedUser);
});


const tbody = document.querySelector("tbody");
tbody.addEventListener("click", cellClick);