// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";

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
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Get references to HTML elements
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signInButton = document.querySelector(".btn-primary");
const messageContainer = document.getElementById("message-container");

signInButton.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent default form submission

  const email = emailInput.value;
  const password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Save user information to session storage
      sessionStorage.setItem("userId", user.uid);
      sessionStorage.setItem("userEmail", user.email); // Store email in session storage
      showMessage("success", "Signed in successfully!");

      // Redirect to home.html
      window.location.href = "home.html"; 
    })
    .catch((error) => {
      showMessage("danger", error.message);
    });
});

// Function to show feedback message (unchanged)
function showMessage(type, message) {
  messageContainer.innerHTML = `<div class="alert alert-${type} mt-3" role="alert">${message}</div>`;
  messageContainer.style.display = "block";
}
