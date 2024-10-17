import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';

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

// Fetch and populate categories
const fetchCategories = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'scholarships'));
        const categorySelect = document.getElementById('category');
        
        // Use a Set to track unique categories in a case-insensitive manner
        const categoriesSet = new Set();

        querySnapshot.forEach((doc) => {
            const category = doc.data().category;
            const categoryLower = category.toLowerCase();
            
            if (!categoriesSet.has(categoryLower)) {
                categoriesSet.add(categoryLower);
                
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error fetching categories: ', error);
    }
};

// Initialize categories on page load
document.addEventListener('DOMContentLoaded', fetchCategories);

// Show new category input when 'Add new category' is selected
document.getElementById('category').addEventListener('change', (e) => {
    const newCategoryGroup = document.getElementById('new-category-group');
    if (e.target.value === 'new') {
        newCategoryGroup.style.display = 'block';
    } else {
        newCategoryGroup.style.display = 'none';
    }
});

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
    const link = document.getElementById('link').value;
    const category = document.getElementById('category').value;
    const newCategory = document.getElementById('new-category').value;
    const documents = document.getElementById('image').files;
    const documents2 = document.getElementById('docs').files;
    
    let categoryToSave = category;
    if (category === 'new' && newCategory) {
        const confirmation = confirm(`Are you sure the category "${newCategory}" is correct?`);
        if (!confirmation) {
            return;
        }
        
        // Add the new category to Firestore
        try {
            const newCategoryRef = await addDoc(collection(db, 'scholarships'), {
                name: newCategory,
                createdAt: serverTimestamp()
            });
            categoryToSave = newCategory;  // Use the new category name
        } catch (error) {
            console.error('Error adding new category: ', error);
            alert('Failed to add new category. Please try again.');
            return;
        }
    } else {
        // Check for case-insensitive matching of existing categories
        const categoriesSnapshot = await getDocs(collection(db, 'scholarships'));
        categoriesSnapshot.forEach((doc) => {
            if (doc.data().category.toLowerCase() === categoryToSave.toLowerCase()) {
                categoryToSave = doc.data().category;
            }
        });
    }

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
            link,
            category: categoryToSave,
            createdAt: serverTimestamp()
        });

        const uploadFiles = async (docRef, files) => {
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const storageRef = ref(storage, `scholarships/${docRef.id}/${file.name}`);
                const uploadTask = uploadBytes(storageRef, file).then(snapshot => {
                    return getDownloadURL(snapshot.ref);
                }).then(downloadURL => {
                    return { fileName: file.name, url: downloadURL };
                });
                promises.push(uploadTask);
            }
            return Promise.all(promises);
        };

        const files1 = await uploadFiles(docRef, documents);
        const files2 = await uploadFiles(docRef, documents2);
        
        const allFiles = [...files1, ...files2];
        
        await addDoc(collection(db, 'scholarshipFiles'), {
            scholarshipId: docRef.id,
            files: allFiles,
        });

        alert('Scholarship added successfully!');
        document.getElementById('scholarshipForm').reset();
        document.getElementById('new-category-group').style.display = 'none';
    } catch (error) {
        console.error('Error adding document: ', error);
        alert('Error adding scholarship. Please try again.');
    }
});
