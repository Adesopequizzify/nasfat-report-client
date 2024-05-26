// Firebase initialization and imports 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore, collection, query, where, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA3-J-B0YbermAgsi1L0wwpg803w1V_uGM",
    authDomain: "nasfat-s.firebaseapp.com",
    databaseURL: "https://nasfat-s-default-rtdb.firebaseio.com",
    projectId: "nasfat-s",
    storageBucket: "nasfat-s.appspot.com",
    messagingSenderId: "200980555631",
    appId: "1:200980555631:web:3577ec25198c9f6c9e2a9a",
    measurementId: "G-4ENB5J6509"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const emailDisplay = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");
const reportDate = document.getElementById("reportDate");
const totalMembers = document.getElementById("totalMembers");
const totalMales = document.getElementById("totalMales");
const totalFemales = document.getElementById("totalFemales");

onAuthStateChanged(auth, (user) => {
  if (user) {
    emailDisplay.textContent = user.email;
    fetchLatestReport(user.uid);
  } else {
    window.location.href = "index.html";
  }
});


async function fetchLatestReport(userId) {
  try {
    const reportsRef = collection(db, "reports");
    const q = query(reportsRef, where("userId", "==", userId), orderBy("date", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const latestReport = querySnapshot.docs[0].data();
        reportDate.textContent = latestReport.date.toDate().toLocaleDateString();
        totalMembers.textContent = latestReport.totalMembers;
        totalMales.textContent = latestReport.totalMales;
        totalFemales.textContent = latestReport.totalFemales;
    } else {
        reportDate.textContent = "No reports available.";
        totalMembers.textContent = "-";
        totalMales.textContent = "-";
        totalFemales.textContent = "-";
    }
  } catch (error) {
    console.error("Error fetching report:", error);
    // Handle the error (e.g., display an error message to the user)
  }
}


// Add logout functionality
logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userEmail");
    window.location.href = "index.html";
  }).catch((error) => {
    console.error("Logout error:", error);
  });
});

