import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';

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

let scholarships = [];
let categories = new Set();

async function fetchScholarships() {
    try {
        const querySnapshot = await getDocs(collection(db, 'scholarships'));
        scholarships = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(scholarship => scholarship.approved);

        // Extract unique categories
        scholarships.forEach(scholarship => {
            if (scholarship.category) {
                categories.add(scholarship.category);
            }
        });

        displayScholarships(scholarships);
        displayCategories(Array.from(categories));
    } catch (error) {
        console.error('Error fetching scholarships: ', error);
    }
}

function displayScholarships(scholarships) {
    const scholarshipsContainer = document.querySelector('.scholarship-list .row');
    scholarshipsContainer.innerHTML = ''; // Clear existing content

    scholarships.forEach(async (scholarship) => {
        const filesSnapshot = await getDocs(collection(db, 'scholarshipFiles'));
        const filesData = filesSnapshot.docs.find(doc => doc.data().scholarshipId === scholarship.id)?.data().files || [];
        
        // Create the scholarship card
        const scholarshipCard = document.createElement('div');
        scholarshipCard.className = 'col-md-4 mb-4';
        scholarshipCard.innerHTML = `
            <div class="card shadow scholarship-card">
                <img src="${filesData.length > 0 ? filesData[0].url : 'https://via.placeholder.com/300x200'}" class="card-img-top" alt="${scholarship.name}">
                <div class="card-body">
                    <h5 class="card-title">${scholarship.name}</h5>
                    <p class="card-text">${scholarship.description.slice(0, 100)}...</p>
                    <div class="collapse scholarship-details" id="scholarship-${scholarship.id}">
                        <p><strong>Fields:</strong> ${scholarship.fields}</p>
                        <p><strong>Expenses:</strong> ${scholarship.expenses}</p>
                        <p><strong>Eligibility:</strong> ${scholarship.eligibility}</p>
                        <p><strong>Required Documents:</strong> ${scholarship.documentz}</p>
                        <p><strong>Deadline:</strong> ${scholarship.deadline}</p>
                        <p><strong>Additional Info:</strong> ${scholarship.info}</p>
                    </div>
                    <button class="btn btn-secondary btn-sm see-more-btn" data-toggle="collapse" data-target="#scholarship-${scholarship.id}" aria-expanded="false">See More</button>
                    <a href="${scholarship.link}" class="btn btn-primary" target="_blank">Learn More</a>
                    ${filesData.length > 1 ? `<button class="btn btn-outline-info btn-sm download-btn" data-url="${filesData[1].url}">Download Document</button>` : ''}
                </div>
            </div>
        `;
        
        scholarshipsContainer.appendChild(scholarshipCard);

        // Add event listener to toggle the "See More" button
        const seeMoreBtn = scholarshipCard.querySelector('.see-more-btn');
        const scholarshipDetails = scholarshipCard.querySelector('.scholarship-details');
        seeMoreBtn.addEventListener('click', () => {
            scholarshipDetails.classList.toggle('show');
            seeMoreBtn.textContent = scholarshipDetails.classList.contains('show') ? 'See Less' : 'See More';
        });

        // Add event listener for download button if it exists
        const downloadBtn = scholarshipCard.querySelector('.download-btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (event) => {
                const fileUrl = event.target.getAttribute('data-url');
                downloadDocument(fileUrl);
            });
        }
    });
}

// Function to handle downloading the document
function downloadDocument(url) {
    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank'; // Open in new tab/window
    link.download = ''; // Download attribute to suggest downloading

    // Append the link to the body
    document.body.appendChild(link);

    // Trigger the download by simulating a click
    link.click();

    // Clean up by removing the temporary link
    document.body.removeChild(link);
}

// Call fetchScholarships on page load
document.addEventListener('DOMContentLoaded', fetchScholarships);



function displayCategories(categories) {
    const categoryContainer = document.querySelector('.category-filter .d-flex');
    categoryContainer.innerHTML = ''; // Clear existing content

    categories.forEach(category => {
        const categoryBlock = document.createElement('div');
        categoryBlock.className = 'p-2';
        categoryBlock.innerHTML = `<button class="btn btn-outline-primary" data-category="${category}">${category}</button>`;
        categoryContainer.appendChild(categoryBlock);
    });

    // Add event listeners to category buttons
    addCategoryEventListeners();
}

function addCategoryEventListeners() {
    document.querySelectorAll('.category-filter .btn-outline-primary').forEach(button => {
        button.addEventListener('click', (event) => {
            const category = event.target.getAttribute('data-category');
            const filteredScholarships = scholarships.filter(scholarship => scholarship.category === category);
            displayScholarships(filteredScholarships);
        });
    });
}

document.addEventListener('DOMContentLoaded', fetchScholarships);

const searchInput = document.querySelector('input[type="text"]');
searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredScholarships = scholarships.filter(scholarship => scholarship.name.toLowerCase().includes(searchTerm));
    displayScholarships(filteredScholarships);
});
