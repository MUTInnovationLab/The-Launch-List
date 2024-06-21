import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

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

async function fetchUnapprovedScholarships() {
    try {
        const querySnapshot = await getDocs(collection(db, 'scholarships'));
        const unapprovedScholarships = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(scholarship => !scholarship.approved);
        displayUnapprovedScholarships(unapprovedScholarships);
    } catch (error) {
        console.error('Error fetching unapproved scholarships: ', error);
    }
}

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
                    <input type="text" class="form-control mb-2" placeholder="Enter category" id="category-${scholarship.id}">
                    <button class="btn btn-success approve-btn" data-id="${scholarship.id}">Approve</button>
                </div>
            </div>
        `;
        container.appendChild(scholarshipCard);
    });

    // Add event listeners to the "Approve" buttons
    document.querySelectorAll('.approve-btn').forEach(button => {
        button.addEventListener('click', async (event) => {
            const scholarshipId = event.target.getAttribute('data-id');
            const category = document.getElementById(`category-${scholarshipId}`).value;
            await approveScholarship(scholarshipId, category);
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

document.addEventListener('DOMContentLoaded', fetchUnapprovedScholarships);
