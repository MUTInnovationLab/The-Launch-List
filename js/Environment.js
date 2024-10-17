import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyCFz6TF6mh2fQ-GWJpEeY46LyIY6yB-gb4",
  authDomain: "launchlistscholar.firebaseapp.com",
  projectId: "launchlistscholar",
  storageBucket: "launchlistscholar.appspot.com",
  messagingSenderId: "793457467249",
  appId: "1:793457467249:web:4728d562236c81bc8560d0",
  measurementId: "G-GPCQSTP3FN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
