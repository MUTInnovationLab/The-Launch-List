import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

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

async function fetchCategories() {
    try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        return querySnapshot.docs.map(doc => doc.data().name); // Assuming each category document has a 'name' field
    } catch (error) {
        console.error('Error fetching categories: ', error);
        return []; // Return an empty array in case of error
    }
}

async function fetchUnapprovedScholarships() {
    try {
        const querySnapshot = await getDocs(collection(db, 'scholarships'));
        const unapprovedScholarships = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(scholarship => !scholarship.approved);

        // Fetch categories once for all scholarships
        const categories = await fetchCategories();
        displayUnapprovedScholarships(unapprovedScholarships, categories);
    } catch (error) {
        console.error('Error fetching unapproved scholarships: ', error);
    }
}

function displayUnapprovedScholarships(scholarships, categories) {
    const container = document.getElementById('unapproved-scholarships');
    container.innerHTML = ''; // Clear existing content

    scholarships.forEach(scholarship => {
        const scholarshipCard = document.createElement('div');
        scholarshipCard.className = 'col-md-4 mb-4';
        scholarshipCard.innerHTML = `
            <div class="card shadow">
                <div class="card-body">
                    <h5 class="card-title">${scholarship.name}</h5>
                    <p class="card-text">${scholarship.description}</p>
                    <select class="form-control mb-2 category-dropdown" id="category-${scholarship.id}">
                        <option value="">Select category</option>
                        <option value="new">Add new category</option>
                        <option value="Science">Science</option>
                        <option value="IT">IT</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Science">Science</option>
                        <option value="IT">IT</option>
                        <option value="Medicine">Medicine</option>
                        <option value="Science">Science</option>
                        <option value="IT">IT</option>
                        <option value="Medicine">Medicine</option>
                        ${categories.map(category => `<option value="${category}">${category}</option>`).join('')}
                        <option value="new">Add new category</option>
                    </select>
                    <input type="text" class="form-control mb-2 d-none" placeholder="Enter new category" id="new-category-${scholarship.id}">
                    <button class="btn btn-success approve-btn" data-id="${scholarship.id}">Approve</button>
                    <button class="btn btn-danger reject-btn" data-id="${scholarship.id}">Reject</button>
                </div>
            </div>
        `;
        container.appendChild(scholarshipCard);

        // Add event listener to the dropdown to handle the "Add new category" option
        const categoryDropdown = document.getElementById(`category-${scholarship.id}`);
        const newCategoryInput = document.getElementById(`new-category-${scholarship.id}`);

        categoryDropdown.addEventListener('change', (event) => {
            if (event.target.value === 'new') {
                newCategoryInput.classList.remove('d-none');
            } else {
                newCategoryInput.classList.add('d-none');
            }
        });
    });

    // Add event listeners to the "Approve" buttons
    document.querySelectorAll('.approve-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const scholarshipId = event.target.getAttribute('data-id');
            const categoryDropdown = document.getElementById(`category-${scholarshipId}`);
            const selectedCategory = categoryDropdown.value;
            const newCategoryInput = document.getElementById(`new-category-${scholarshipId}`);
            const category = selectedCategory === 'new' ? newCategoryInput.value : selectedCategory;

            if (category) {
                await approveScholarship(scholarshipId, category);
                fetchUnapprovedScholarships(); // Refresh the list
            } else {
                alert('Please select or enter a category.');
            }
        });
    });

    // Add event listeners to the "Reject" buttons
    document.querySelectorAll('.reject-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const scholarshipId = event.target.getAttribute('data-id');
            await rejectScholarship(scholarshipId);
            fetchUnapprovedScholarships(); // Refresh the list
        });
    });
}

async function approveScholarship(scholarshipId, category) {
    try {
        const scholarshipRef = doc(db, 'scholarships', scholarshipId);
        await updateDoc(scholarshipRef, {
            approved: true,
            category: category
        });
    } catch (error) {
        console.error('Error approving scholarship: ', error);
    }
}

async function rejectScholarship(scholarshipId) {
    try {
        const scholarshipRef = doc(db, 'scholarships', scholarshipId);
        await deleteDoc(scholarshipRef);
    } catch (error) {
        console.error('Error rejecting (deleting) scholarship: ', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchUnapprovedScholarships);

// Add CSS styles
const style = document.createElement('style');
style.innerHTML = `
    .category-dropdown {
        max-height: 50px; /* Approximate height for 5 items */
        overflow-y: auto; /* Enable vertical scrolling */
    }
`;
document.head.appendChild(style);
