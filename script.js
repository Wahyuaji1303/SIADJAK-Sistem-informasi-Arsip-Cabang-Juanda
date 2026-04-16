// 🔥 CONFIG FIREBASE (ISI PUNYAMU)
const firebaseConfig = {
  apiKey: "ISI_APIKEY",
  authDomain: "ISI_DOMAIN",
  projectId: "ISI_PROJECT",
  storageBucket: "ISI_BUCKET",
  appId: "ISI_APPID"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const storage = firebase.storage();

// LOGIN
function login(){
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  if(user !== "" && pass !== ""){
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("app").classList.remove("hidden");
    loadData();
  } else {
    alert("Isi login!");
  }
}

// NAVIGASI
function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  loadData();
}

// UPLOAD
async function tambahArsip(){
  let no = document.getElementById("no").value;
  let proyek = document.getElementById("proyek").value;
  let perusahaan = document.getElementById("perusahaan").value;
  let lokal = document.getElementById("lokal").value;
  let nominal = document.getElementById("nominal").value;
  let jenis = document.getElementById("jenis").value;
  let file = document.getElementById("file").files[0];

  let ref = storage.ref("arsip/" + Date.now() + "_" + file.name);

  await ref.put(file);
  let url = await ref.getDownloadURL();

  await db.collection("arsip").add({
    no, proyek, perusahaan, lokal, nominal, jenis, url
  });

  alert("Upload berhasil!");
  loadData();
}

// LOAD DATA
async function loadData(){
  let table = document.getElementById("arsipTable");
  let laman = document.getElementById("lamanData");
  let user = document.getElementById("userData");

  table.innerHTML = "";
  laman.innerHTML = "";
  user.innerHTML = "";

  let data = await db.collection("arsip").get();

  data.forEach(doc=>{
    let a = doc.data();

    table.innerHTML += `
      <tr>
        <td>${a.no}</td>
        <td>${a.proyek}</td>
        <td>${a.perusahaan}</td>
        <td>${a.lokal}</td>
        <td>Aktif</td>
        <td><a href="${a.url}" target="_blank">PDF</a></td>
      </tr>
    `;

    laman.innerHTML += `<div class="card">${a.proyek}</div>`;

    user.innerHTML += `
      <div class="card">
        <p>${a.proyek}</p>
        <p>${a.perusahaan}</p>
        <p>${a.nominal}</p>
      </div>
    `;
  });
}