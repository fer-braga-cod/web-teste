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




function gerarDropdown(){
    const collectionRef = db.collection('projetos');

    collectionRef.get()
    .then(snapshot => {
        snapshot.docs.forEach(doc => {
            const petiano = doc.data();
            const nome = petiano.nome;
            const membros = petiano.membros;

            const dropdown = document.createElement("div");
            dropdown.className = "dropdown";
            const button = document.createElement("button");
            button.className = "dropdown-btn";
            button.textContent = nome;
            const dropCont = document.createElement("div");
            dropCont.className = "dropdown-content";
            const ul = document.createElement("ul");

            for(const dados of membros){
                const li = document.createElement("li");
                const span = document.createElement("span");
                span.textContent = dados;
                const bt = document.createElement("button");
                bt.className = "item-btn";
                bt.textContent = "X";

                li.appendChild(span);
                li.appendChild(bt);
                ul.appendChild(li);
            }
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


function excluirPetiano(nomeProjeto, nomePetiano) {
    db.collection('projetos')
      .where('nome', '==', nomeProjeto)
      .get()
      .then(snapshot => {
          if (snapshot.empty) {
              console.error('Projeto não encontrado');
              return;
          }

          const doc = snapshot.docs[0];
          const membros = doc.data().membros;

          const novoArrayMembros = membros.filter(membro => membro !== nomePetiano);

          doc.ref.update({
              membros: novoArrayMembros
          })
          .then(() => {
              console.log('Membro excluído com sucesso!');
          })
          .catch(error => {
              console.error('Erro ao excluir membro:', error);
          });
      })
      .catch(error => {
          console.error('Erro ao buscar projeto:', error);
      });
}

// Função para mostrar/esconder o conteúdo do dropdown
const lista = document.getElementById("lista");

lista.addEventListener('click', (event) => {
  if (event.target.classList.contains('dropdown-btn')) {
    const content = event.target.nextElementSibling;
    content.classList.toggle('show');
  }
});

lista.addEventListener('click', (event) => {
    if(event.target.classList.contains('item-btn')) {
        const li = event.target.parentNode;
        const nomePetiano = li.querySelector('span').textContent;
        const nomeProjeto = li.closest('.dropdown').querySelector('.dropdown-btn').textContent;

        alert(`Você deseja excluir o petiano ${nomePetiano} do projeto ${nomeProjeto}?`);

        excluirPetiano(nomeProjeto, nomePetiano);        
    }
});

gerarDropdown();