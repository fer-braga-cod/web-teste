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

//Gera a lista de petianos do modal Novo Membro
function gerarLista(){
    const div = document.getElementById("petianos");
    
    const collectionRef = db.collection('users');

    collectionRef.get()
    .then(snapshot => {
        snapshot.docs.forEach(doc => {
        const nome = doc.data().nome;
        const sobrenome = doc.data().sobrenome;
        const ul = document.createElement("ul");
        ul.textContent = nome + " " + sobrenome;
        div.appendChild(ul);
        });
    })
    .catch(error => {
        console.error("Erro ao buscar dados:", error);
    });
}

//Ao iniciar a página varre a coleção projetos criando um dropdown para cada projeto
function gerarDropdown(){
    const collectionRef = db.collection('projetos');

    collectionRef.get()
    .then(snapshot => {
        snapshot.docs.forEach(doc => {
            const projeto = doc.data();
            const nome = projeto.nome;
            const membros = projeto.membros;

            const dropdown = document.createElement("div");
            dropdown.className = "dropdown";
            dropdown.id = nome;
            const button = document.createElement("button");
            button.className = "dropdown-btn";
            button.textContent = nome;
            const dropCont = document.createElement("div");
            dropCont.className = "dropdown-content";
            const ul = document.createElement("ul");

            for(const dados of membros){
                const li = document.createElement("li");
                li.id = dados;
                const span = document.createElement("span");
                span.textContent = dados;
                const bt = document.createElement("button");
                bt.className = "item-btn";
                bt.textContent = "X";

                li.appendChild(span);
                li.appendChild(bt);                
                ul.appendChild(li);
            }
            const divBT = document.createElement("div");
            divBT.className = "divBT";
            const novoMembro = document.createElement("button");
            novoMembro.textContent = "+ Novo Membro";
            novoMembro.className = "novoMembro";
            const excluirProj = document.createElement("button");
            excluirProj.textContent = "Excluir Projeto";
            excluirProj.className = "excluirProj";
            divBT.appendChild(novoMembro);
            divBT.appendChild(excluirProj);
            dropCont.appendChild(divBT);
            dropCont.appendChild(ul);
            dropdown.appendChild(button);
            dropdown.appendChild(dropCont);
            const lista = document.querySelector("#lista");
            lista.appendChild(dropdown);
        });
    })
    .catch(error => {
        console.error("Erro ao buscar dados:", error);
    });
}

//Procura o projeto no BD e exclui o petiano desejado do vetor no campo "membros"
//Também remove o item do dropdown referente aquele petiano
async function excluirPetiano(nomeProjeto, nomePetiano) {
    try {        
        const projetoRef = db.collection('projetos').where('nome', '==', nomeProjeto);
        const snapshot = await projetoRef.get();

        if (snapshot.empty) {
            throw new Error('Projeto não encontrado');
        }
        const doc = snapshot.docs[0];
        const novosMembros = doc.data().membros.filter(membro => membro !== nomePetiano);
       
        await doc.ref.update({ membros: novosMembros });
        
        const dropdown = document.getElementById(nomeProjeto);
        const li = dropdown.querySelector(`.dropdown-content ul li[id="${nomePetiano}"]`);
        if (li) {
            li.remove();
            console.log('Membro excluído com sucesso!');
        } else {
            console.warn('Elemento não encontrado para exclusão.');
        }
    } catch (error) {
        console.error('Erro ao excluir membro:', error);
        alert('Ocorreu um erro ao excluir o membro. Tente novamente mais tarde.');
    }
}

//Cadastra um novo projeto na coleção "projetos"
//E cria um novo dropdown
function cadastro(){
    const nomeProj = document.getElementById("nomeProj").value;
    const corProj = document.getElementById("corProj").value;

    db.collection("projetos").add({
        nome: nomeProj,
        cor: corProj,
        membros: []
    })
    .then(() => {
        console.log("Cadastro Realizado!");
    })
    .catch((error) => {
        console.error("Erro no cadastro: ", error);
    });
    closeModal();
    const dropdown = document.createElement("div");
    dropdown.className = "dropdown";
    dropdown.id = nomeProj;
    const button = document.createElement("button");
    button.className = "dropdown-btn";
    button.textContent = nomeProj;
    const dropCont = document.createElement("div");
    dropCont.className = "dropdown-content";
    const ul = document.createElement("ul");
    const divBT = document.createElement("div");
    const novoMembro = document.createElement("button");
    novoMembro.textContent = "+ Novo Membro";
    novoMembro.className = "novoMembro";
    const excluirProj = document.createElement("button");
    excluirProj.textContent = "Excluir Projeto";
    excluirProj.className = "excluirProj";
    divBT.appendChild(novoMembro);
    divBT.appendChild(excluirProj);
    dropCont.appendChild(divBT);
    dropCont.appendChild(ul);
    dropdown.appendChild(button);
    dropdown.appendChild(dropCont);
    const lista = document.querySelector("#lista");
    lista.appendChild(dropdown);     
}

//Mensagem de confirmação se deseja mesmo excluir o projeto
function confirmarDelete(mensagem, callback) {
    const confirmacao = window.confirm(mensagem);
    if (confirmacao) {
      callback();
    }
}

//Remove o projeto da coleção "projetos"
function deleteProj(projID){
    const mensagem = "Tem certeza que deseja deletar esse projeto?";
  
    confirmarDelete(mensagem, () => { 
        const docRef = db.collection('projetos').doc(projID);

        docRef.delete()
            .then(() => {
                console.log("Documento deletado com sucesso!");                
            })
            .catch((error) => {
                console.error("Erro ao deletar documento:", error);
            });
    });    
}

//Encontra o id do doc referente ao projeto a ser excluido e remove o dropdown do projeto
function excluirProjeto(nomeProj){
    const projRef = db.collection('projetos');    

    projRef.where('nome', '==', nomeProj)
    .get()
    .then(snapshot => {
        if (snapshot.empty) {
            console.log('Nenhum projeto encontrado com esse nome.');
        } else {
            snapshot.docs.forEach(doc => {
                deleteProj(doc.id);
                document.getElementById(nomeProj).remove();
            });
        }
    })
    .catch(error => {
        console.error('Erro ao buscar projeto:', error);
    });
}

//Função para adicionar um novo membro
//Encontra o projeto desejado na coleção "projetos" e adiciona o petiano no vetor do campo "membros"
function addMembro(petiano, projeto){
    db.collection('projetos')
      .where('nome', '==', projeto)
      .get()
      .then(snapshot => {
          if (snapshot.empty) {
              console.error('Projeto não encontrado');
              return;
          }

          const doc = snapshot.docs[0];
          const membros = doc.data().membros;

          membros.push(petiano);

          doc.ref.update({
              membros: membros
          })
          .then(() => {
                console.log('Membro adicionado com sucesso!');
                const dropdown = document.getElementById(projeto);
                const ul = dropdown.querySelector(`.dropdown-content ul`);                
                const li = document.createElement("li");
                li.id = petiano;
                const span = document.createElement("span");
                span.textContent = petiano;
                const bt = document.createElement("button");
                bt.className = "item-btn";
                bt.textContent = "X";
                li.appendChild(span);
                li.appendChild(bt);
                ul.appendChild(li);
          })
          .catch(error => {
              console.error('Erro ao adicionar membro:', error);
          });
      })
      .catch(error => {
          console.error('Erro ao buscar projeto:', error);
        }
    );
}

//Fecha o modal Novo Projeto
function closeModal() {    
    const mod = document.getElementById("addProj");    
    mod.classList.remove('active')
}
//Fecha o modal Novo Membro
function closeModal2() {
    const mod = document.getElementById("addMembro");    
    mod.classList.remove('active')
}
document.getElementById("salvarBT").onclick = function() //oncClick botão salvar do modal Novo Projeto
{cadastro()};
document.getElementById("cancelarBT").onclick = function() //onCLick botão cancelar do modal Novo Projeto
{closeModal()};

document.getElementById("salvarBT2").onclick = function() //onClick botão salvar do modal Novo Membro
{console.log("Cadastrar Membro")};
document.getElementById("cancelarBT2").onclick = function() //onClick botão cancelar do modal Novo Membro
{closeModal2()};

document.getElementById("newProj").onclick = function() //onClick botão +Novo Projeto
{openModal("addProj")};

//Aciona os modal tanto do Novo Membro quanto do Novo Projeto 
function openModal(modalNome){
    const modal = document.getElementById(modalNome);
    modal.classList.add('active');
}

//Eventos de click dos dropdown
const lista = document.getElementById("lista");
lista.addEventListener('click', (event) => {
    
    //Aciona o dropdown após clique no botão do mesmo
    if (event.target.classList.contains('dropdown-btn')) {
        const content = event.target.nextElementSibling;
        content.classList.toggle('show');
    
    //Chama o excluirPetiano() após clique no botão "X" presente em cada item do dropdown
    }else if(event.target.classList.contains('item-btn')){
        const li = event.target.parentNode;
        const nomePetiano = li.querySelector('span').textContent;
        const nomeProjeto = li.closest('.dropdown').querySelector('.dropdown-btn').textContent;
        alert(`Você deseja excluir o petiano ${nomePetiano} do projeto ${nomeProjeto}?`);
        excluirPetiano(nomeProjeto, nomePetiano); 
    
    //Evento do clique do botão Excluir Projeto
    }else if(event.target.classList.contains('excluirProj')){
        const nomeProjeto = event.target.closest('.dropdown').querySelector('.dropdown-btn').textContent;
        excluirProjeto(nomeProjeto);
    
    //Evento do clique do botão Novo membro
    }else if (event.target.classList.contains('novoMembro')) {
        const projeto = event.target.closest('.dropdown').querySelector('.dropdown-btn').textContent;
        const modal = document.getElementById("addMembro");
        modal.querySelector('#nomeProjeto').textContent = projeto;
        openModal("addMembro");
    }
});

//Evento de click da lista de petianos do modal(Novo Projeto)
const petianos = document.getElementById('petianos');
petianos.addEventListener('click', (event) => {    
    const ul = event.target;
    const projeto = event.target.closest('.modal').querySelector('#nomeProjeto').textContent;  
    addMembro(ul.textContent, projeto);  
});

//Ao criar a pagina é gerado o dropdown referente a cada projeto e a lista de petianos do modal
gerarDropdown();
gerarLista();