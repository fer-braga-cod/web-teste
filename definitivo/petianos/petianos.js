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
            if(i == 0)
                cell.textContent = horarios[l];
            const div = document.createElement("div");            
            cell.appendChild(div);        
        }
        tbody.appendChild(row);
    }
}

function userList(){
    const collectionRef = db.collection('users');

    collectionRef.get()
    .then(snapshot => {
        snapshot.docs.forEach(doc => {
        const nome = doc.data().nome;
        const lista = document.querySelector('#petianos');
        const label = document.createElement("label");
        label.textContent = nome;
        const input = document.createElement("input");
        input.type = 'radio';
        input.value = nome;
        input.name = 'petianos';
        label.appendChild(input);
        lista.appendChild(label);
        });
    })
    .catch(error => {
        console.error("Erro ao buscar dados:", error);
    });
}

function gerarLinha(dados, cor) {
    const row = document.createElement("tr");
    for (const valor of dados) {
        const cell = row.insertCell();
        if((typeof valor) == "string")
            cell.textContent = valor;
        else
            cell.style.backgroundColor = valor === true ? cor : "";        
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
            const linha = gerarLinha(dados, usuario.cor);
            tbody.appendChild(linha);
        }
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


function confirmarMudanca(mensagem, callback) {
    const confirmacao = window.confirm(mensagem);
    if (confirmacao) {
      callback();
    }
}
  
  function mudarHora(clickedCell, userId) {
    const mensagem = "Tem certeza que deseja alterar essa hora?";
  
    confirmarMudanca(mensagem, () => { 
      
  
      db.doc(`users/${userId}`).get().then((doc) => {
        if (doc.exists) {
          const row = clickedCell.parentNode;
          const rowIndex = row.rowIndex - 1;
  
          const usuario = doc.data();
          const horarios = [usuario.x1, usuario.x2, usuario.x3, usuario.x4, usuario.x5, usuario.x6, usuario.x7];
  
          const hora = horarios[rowIndex];
          const columnIndex = clickedCell.cellIndex;
          hora[columnIndex] = !hora[columnIndex];
  
          const docRef = db.doc(`users/${userId}`);
  
          docRef.update({ [`x${rowIndex + 1}`]: hora }).then(() => {
            console.log("Horario atualizado!");
            clickedCell.style.backgroundColor = hora[columnIndex] === true ? usuario.cor : "";           
          }).catch((error) => {
            console.error("Erro ao atualizar:", error);
          });
        } else {
          console.error(`Documento não encontrado para o usuário: ${userId}`);
        }
      });
    });
  }

function cellClick(event) {
    const clickedCell = event.target;
    if (clickedCell.tagName === "TD") {
        if(clickedCell.textContent == ""){        
            const usersRef = db.collection('users');
            const usuarios = document.querySelector('#petianos');
            const nome = usuarios.querySelector('input[name="petianos"]:checked').value;   
    
            usersRef.where('nome', '==', nome)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                console.log('Nenhum usuário encontrado com esse nome.');
                } else {
                snapshot.docs.forEach(doc => {
                    mudarHora(clickedCell, doc.id);
                });
                }
            })
            .catch(error => {
                console.error('Erro ao buscar usuário:', error);
            });
        }        
    }
}

function confirmarDelete(mensagem, callback) {
    const confirmacao = window.confirm(mensagem);
    if (confirmacao) {
      callback();
    }
}

function deleteUser(userID, nome){
    const mensagem = "Tem certeza que deseja deletar esse petiano?";
  
    confirmarDelete(mensagem, () => { 
        const docRef = db.collection('users').doc(userID);

        docRef.delete()
            .then(() => {
                console.log("Documento deletado com sucesso!");
                const usuarios = document.querySelector('#petianos');
                const elementoRemovido = usuarios.querySelector(`input[value="${nome}"]`);
                if (elementoRemovido) {
                    elementoRemovido.parentElement.remove();
                    tbody.innerHTML = "";
                    gerarTabela();
                }
            })
            .catch((error) => {
                console.error("Erro ao deletar documento:", error);
            });
    });    
}

function deleteBT(){
    const usersRef = db.collection('users');
    const usuarios = document.querySelector('#petianos');
    const nome = usuarios.querySelector('input[name="petianos"]:checked').value;   

    usersRef.where('nome', '==', nome)
    .get()
    .then(snapshot => {
        if (snapshot.empty) {
            console.log('Nenhum usuário encontrado com esse nome.');
        } else {
            snapshot.docs.forEach(doc => {
                deleteUser(doc.id, nome);
            });
        }
    })
    .catch(error => {
        console.error('Erro ao buscar usuário:', error);
    });
}


const usuarios = document.querySelector('#petianos');
usuarios.addEventListener('change', (event) => {
    const radio = event.target;     
    buscarUsuario(radio.value);  
});

document.getElementById("delete").onclick = function()
{deleteBT()};


function cadastro(){
    const nomePet = document.getElementById("nomePet").value;
    const corPet = document.getElementById("corPet").value;

    db.collection("users").add({
        nome: nomePet,
        cor: corPet,
        x1: ['07:15', false, false, false, false, false],
        x2: ['09:25', false, false, false, false, false],
        x3: ['13:15', false, false, false, false, false],
        x4: ['15:25', false, false, false, false, false],
        x5: ['17:30', false, false, false, false, false],
        x6: ['18:30', false, false, false, false, false],
        x7: ['20:40', false, false, false, false, false]
    })
    .then(() => {
        console.log("Cadastro Realizado!");
    })
    .catch((error) => {
        console.error("Erro no cadastro: ", error);
    });
    closeModal();
    const lista = document.querySelector('#petianos');
    const label = document.createElement("label");
    label.textContent = nomePet;
    const input = document.createElement("input");
    input.type = 'radio';
    input.value = nomePet;
    input.name = 'petianos';
    label.appendChild(input);
    lista.appendChild(label);    
}


const modal = document.querySelector('.modal-container')

function openModal() {
  modal.classList.add('active')
}

function closeModal() {
    const nomePet = document.getElementById("nomePet");
    nomePet.value = "";
    modal.classList.remove('active')
}   

document.getElementById("salvarBT").onclick = function()
{cadastro()};
document.getElementById("cancelarBT").onclick = function()
{closeModal()};
document.getElementById("newPet").onclick = function()
{openModal()};


const horarios = ['07:15','09:25','13:15','15:25','17:30','18:30','20:40'];
gerarTabela();
userList();
const tbody = document.querySelector("tbody");
tbody.addEventListener("click", cellClick);