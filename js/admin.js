// File: js/admin.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';

const firebaseConfig = {
    apiKey: "AIzaSyA1yd7lAFXJh-VZ2il5fDzqfWqGuSyregY",
    authDomain: "workscape-84122.firebaseapp.com",
    projectId: "workscape-84122",
    storageBucket: "workscape-84122.appspot.com",
    messagingSenderId: "734998941399",
    appId: "1:734998941399:web:1a69bc537ee162f64e6a92"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

document.getElementById('scholarshipForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const deadline = document.getElementById('deadline').value;
    const amount = document.getElementById('amount').value;
    const documents = document.getElementById('documents').files;
    
    try {
        const docRef = await addDoc(collection(db, 'scholarships'), {
            name,
            description,
            deadline,
            amount,
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
