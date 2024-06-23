import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Firebase configuration
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

// Fetch unapproved scholarships
async function fetchUnapprovedScholarships() {
    try {
        const querySnapshot = await getDocs(collection(db, 'scholarships'));
        const unapprovedScholarships = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(scholarship => !scholarship.approved); // Filter unapproved scholarships

        displayUnapprovedScholarships(unapprovedScholarships);
    } catch (error) {
        console.error('Error fetching unapproved scholarships: ', error);
    }
}

// Display unapproved scholarships
function displayUnapprovedScholarships(scholarships) {
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
                    <p class="card-text"><strong>Category:</strong> ${scholarship.category}</p>
                    <button class="btn btn-success approve-btn" data-id="${scholarship.id}">Approve</button>
                    <button class="btn btn-danger reject-btn" data-id="${scholarship.id}">Reject</button>
                </div>
            </div>
        `;
        container.appendChild(scholarshipCard);
    });

    // Add event listeners to the "Approve" buttons
    document.querySelectorAll('.approve-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const scholarshipId = event.target.getAttribute('data-id');
            await approveScholarship(scholarshipId);
            fetchUnapprovedScholarships(); // Refresh the list
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

// Approve a scholarship
async function approveScholarship(scholarshipId) {
    try {
        const scholarshipRef = doc(db, 'scholarships', scholarshipId);
        await updateDoc(scholarshipRef, {
            approved: true
        });
    } catch (error) {
        console.error('Error approving scholarship: ', error);
    }
}

// Reject (delete) a scholarship
async function rejectScholarship(scholarshipId) {
    try {
        const scholarshipRef = doc(db, 'scholarships', scholarshipId);
        await deleteDoc(scholarshipRef);
    } catch (error) {
        console.error('Error rejecting (deleting) scholarship: ', error);
    }
}

// Fetch and display unapproved scholarships on page load
document.addEventListener('DOMContentLoaded', fetchUnapprovedScholarships);
