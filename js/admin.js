// File: js/admin.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';

const firebaseConfig = {
    apiKey: "AIzaSyAWObvbOoDNyhvhWJutoRhjIWdNTsTL6-k",
  authDomain: "scholarship-480e8.firebaseapp.com",
  projectId: "scholarship-480e8",
  storageBucket: "scholarship-480e8.appspot.com",
  messagingSenderId: "900430271329",
  appId: "1:900430271329:web:ca53beb6a6aea45d742b20",
  measurementId: "G-0QSSG444CW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

document.getElementById('scholarshipForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
      const description = document.getElementById('description').value;
      const fields = document.getElementById('fields').value;
      const expenses = document.getElementById('expenses').value;
      const eligibility = document.getElementById('eligibility').value;
      const documentz = document.getElementById('documentz').value;
      const deadline = document.getElementById('deadline').value;
      const info = document.getElementById('info').value;
    const documents = document.getElementById('image').files;
    
    try {
        const docRef = await addDoc(collection(db, 'scholarships'), {
            name,
          description,
          fields,
          expenses,
          eligibility,
          documentz,
          deadline,
          info,
            createdAt: serverTimestamp()
        });

        const promises = [];
        for (let i = 0; i < documents.length; i++) {
            const file = documents[i];
            const storageRef = ref(storage, `scholarships/${docRef.id}/${file.name}`);
            const uploadTask = uploadBytes(storageRef, file).then(snapshot => {
                return getDownloadURL(snapshot.ref);
            }).then(downloadURL => {
                return { fileName: file.name, url: downloadURL };
            });
            promises.push(uploadTask);
        }

        const files = await Promise.all(promises);
        await addDoc(collection(db, 'scholarshipFiles'), {
            scholarshipId: docRef.id,
            files
        });

        alert('Scholarship added successfully!');
    } catch (error) {
        console.error('Error adding document: ', error);
        alert('Error adding scholarship. Please try again.');
    }
});

