import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, getDoc, orderBy } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

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

const reportSelect = document.getElementById("reportSelect");
const editReportForm = document.getElementById("edit-report-form");
const messageContainer = document.getElementById("message-container");
const editDateInput = document.getElementById("editDateInput");
const editUserEmailInput = document.getElementById("editUserEmailInput");
const editTotalMembersInput = document.getElementById("editTotalMembersInput");
const editTotalMalesInput = document.getElementById("editTotalMalesInput");
const editTotalFemalesInput = document.getElementById("editTotalFemalesInput");
const saveChangesButton = editReportForm.querySelector("button[type='submit']");

let originalReportData = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        populateReportDropdown(user.uid);
        document.getElementById("userEmail").textContent = user.email;
    } else {
        window.location.href = "index.html";
    }
});

async function populateReportDropdown(userId) {
    try {
        const reportsRef = collection(db, "reports");
        const q = query(reportsRef, where("userId", "==", userId), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
            const reportId = doc.id;
            const reportDate = doc.data().date.toDate().toLocaleDateString();
            const option = document.createElement("option");
            option.value = reportId; 
            option.text = `Report from ${reportDate}`;
            reportSelect.add(option);
        });
    } catch (error) {
        showMessage("danger", "Error fetching reports: " + error.message);
    }
}

reportSelect.addEventListener("change", async () => {
    const selectedReportId = reportSelect.value;

    try {
        const reportDocRef = doc(db, "reports", selectedReportId);
        const reportDocSnap = await getDoc(reportDocRef);

        if (reportDocSnap.exists()) {
            originalReportData = reportDocSnap.data();
            originalReportData.id = reportDocSnap.id;

            editDateInput.value = originalReportData.date.toDate().toISOString().split('T')[0];
            editUserEmailInput.value = originalReportData.userEmail;
            editTotalMembersInput.value = originalReportData.totalMembers;
            editTotalMalesInput.value = originalReportData.totalMales;
            editTotalFemalesInput.value = originalReportData.totalFemales;
            editReportForm.style.display = "block";
            saveChangesButton.disabled = true;
        } else {
            showMessage("info", "No report found with that ID.");
            editReportForm.style.display = "none";
            saveChangesButton.disabled = true; 
        }
    } catch (error) {
        showMessage("danger", "Error fetching report: " + error.message);
        saveChangesButton.disabled = true; 
    }
});

editTotalMembersInput.addEventListener("input", checkForChanges);
editTotalMalesInput.addEventListener("input", checkForChanges);
editTotalFemalesInput.addEventListener("input", calculateTotalMembers);

function calculateTotalMembers() {
    const males = parseInt(editTotalMalesInput.value, 10) || 0;
    const females = parseInt(editTotalFemalesInput.value, 10) || 0;
    editTotalMembersInput.value = males + females;
    checkForChanges(); // Call this to ensure save button state is updated when total members is calculated
}

function checkForChanges() {
    if (originalReportData) {
        const currentData = {
            totalMembers: parseInt(editTotalMembersInput.value, 10) || 0,
            totalMales: parseInt(editTotalMalesInput.value, 10) || 0,
            totalFemales: parseInt(editTotalFemalesInput.value, 10) || 0
        };

        // Compare without the document ID and date
        saveChangesButton.disabled = JSON.stringify(currentData) === JSON.stringify({
            totalMembers: originalReportData.totalMembers,
            totalMales: originalReportData.totalMales,
            totalFemales: originalReportData.totalFemales
        });
    } else {
        saveChangesButton.disabled = true; 
    }
}

editReportForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (confirm("Are you sure you want to save the changes?")) {
        try {
            const updatedData = {
                totalMembers: parseInt(editTotalMembersInput.value, 10) || 0,
                totalMales: parseInt(editTotalMalesInput.value, 10) || 0,
                totalFemales: parseInt(editTotalFemalesInput.value, 10) || 0
            };

            const reportDocRef = doc(db, "reports", originalReportData.id);
            await updateDoc(reportDocRef, updatedData);
            showMessage("success", "Report updated successfully!");
            setTimeout(() => {
                window.location.href = "home.html";
            }, 1500);
        } catch (error) {
            showMessage("danger", "Error updating report: " + error.message);
        }
    }
});

function showMessage(type, message) {
    messageContainer.innerHTML = `<div class="alert alert-${type} mt-3" role="alert">${message}</div>`;
    messageContainer.style.display = "block";
}