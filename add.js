import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore, collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

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

const addReportForm = document.getElementById("add-report-form");
const messageContainer = document.getElementById("message-container");
const dateInput = document.getElementById("dateInput");
const userEmailInput = document.getElementById("userEmailInput");
const totalMembersInput = document.getElementById("totalMembersInput");
const totalMalesInput = document.getElementById("totalMalesInput");
const totalFemalesInput = document.getElementById("totalFemalesInput");

const today = new Date().toISOString().split('T')[0];
dateInput.value = today;
dateInput.readOnly = true; 

onAuthStateChanged(auth, (user) => {
    if (user) {
        userEmailInput.value = user.email;
        userEmailInput.readOnly = true;
    } else {
        window.location.href = "index.html";
    }
});

function calculateTotalMembers() {
    const males = parseInt(totalMalesInput.value, 10) || 0;
    const females = parseInt(totalFemalesInput.value, 10) || 0;
    totalMembersInput.value = males + females;
}

totalMalesInput.addEventListener("input", calculateTotalMembers);
totalFemalesInput.addEventListener("input", calculateTotalMembers);

addReportForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const dateValue = dateInput.value;
    const totalMales = parseInt(totalMalesInput.value, 10) || 0;
    const totalFemales = parseInt(totalFemalesInput.value, 10) || 0;
    const userEmail = userEmailInput.value;
    const userId = sessionStorage.getItem("userId");
    const totalMembers = totalMales + totalFemales;
    
    try {
        await addDoc(collection(db, "reports"), {
            date: Timestamp.fromDate(new Date(dateValue)),
            totalMembers,
            totalMales,
            totalFemales,
            userId,
            userEmail
        });
        showMessage("success", "Report added successfully! Redirecting...");
        setTimeout(() => {
            window.location.href = "home.html";
        }, 1500);
    } catch (error) {
        showMessage("danger", `Error adding report: ${error.message}`);
    }
});

function showMessage(type, message) {
    messageContainer.innerHTML = `<div class="alert alert-${type} mt-3" role="alert">${message}</div>`;
    messageContainer.style.display = "block";
}
