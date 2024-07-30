import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';

const firebaseConfig = {
    apiKey: "AIzaSyAttPgb4lZ4Aki8i9Uqec6YkDNETPFuV6k",
  authDomain: "scholarship-76632.firebaseapp.com",
  projectId: "scholarship-76632",
  storageBucket: "scholarship-76632.appspot.com",
  messagingSenderId: "596975275612",
  appId: "1:596975275612:web:60880032ef32ccf4cc2099",
  measurementId: "G-DMWPVLCJ8V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
