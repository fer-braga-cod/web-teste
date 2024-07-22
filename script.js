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
      

function getUsuarios() {
  db.collection("users").get().then((querySnapshot) => {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const usuario = doc.data();
      const row = tbody.insertRow();

      const nomeCell = row.insertCell();
      nomeCell.textContent = usuario.nome;

      const idadeCell = row.insertCell();
      idadeCell.textContent = usuario.idade;
    });
  });
}

function alteraCor() {
  // Get the clicked row from the global variable (assuming it's set in handleRowClick)
  const clickedRow = window.clickedRow; // Adjust if you store the clicked row elsewhere

  if (clickedRow) {
    // Set the background color of the clicked row
    clickedRow.style.backgroundColor = "lightblue"; // Change the color as desired

    // Optionally, reset the color of previously clicked rows (if needed)
    clickedRow.parentElement.querySelectorAll('tr').forEach(row => {
      if (row !== clickedRow) {
        row.style.backgroundColor = ""; // Reset background color
      }
    });
  }
}



function handleRowClick(event) {
  const clickedRow = event.target.closest("tr");
  if (clickedRow) {
    const userData = getRowData(clickedRow);    
    console.log("Usuário clicado:", userData);
    window.clickedRow = clickedRow;

    alteraCor();
  }
}
function getRowData(row) {
  const nome = row.cells[0].textContent;
  const idade = row.cells[1].textContent;
  return { nome, idade };
}

getUsuarios();
const tbody = document.querySelector("tbody");
tbody.addEventListener("click", handleRowClick);


