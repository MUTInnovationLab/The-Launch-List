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

async function fetchScholarships() {
    try {
        const querySnapshot = await getDocs(collection(db, 'scholarships'));
        scholarships = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(scholarship => scholarship.approved);
        displayScholarships(scholarships);
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
        const scholarshipCard = document.createElement('div');
        scholarshipCard.className = 'col-md-4 mb-4';
        scholarshipCard.innerHTML = `
            <div class="card shadow">
                <img src="${filesData.length > 0 ? filesData[0].url : 'https://via.placeholder.com/300x200'}" class="card-img-top" alt="${scholarship.name}">
                <div class="card-body">
                    <h5 class="card-title">${scholarship.name}</h5>
                    <p class="card-text">${scholarship.description}</p>
                    <a href="#" class="btn btn-primary" data-toggle="modal" data-target="#scholarshipModal" data-id="${scholarship.id}">Learn More</a>
                </div>
            </div>
        `;
        scholarshipsContainer.appendChild(scholarshipCard);
    });

    // Add event listeners to the "Learn More" buttons
    addLearnMoreEventListeners();
}

function addLearnMoreEventListeners() {
    const pdfViewer = document.getElementById('pdf-viewer');
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', async (event) => {
            const scholarshipId = event.target.getAttribute('data-id');
            const scholarship = scholarships.find(s => s.id === scholarshipId);
            const modalBody = document.querySelector('#scholarshipModal .modal-body');
            const filesSnapshot = await getDocs(collection(db, 'scholarshipFiles'));
            const filesData = filesSnapshot.docs.find(doc => doc.data().scholarshipId === scholarshipId)?.data().files || [];

            modalBody.innerHTML = `
                <h5>${scholarship.name}</h5>
                <p>${scholarship.description}</p>
                <p><strong>Deadline:</strong> ${scholarship.deadline}</p>
                <p><strong>Amount:</strong> $${scholarship.amount}</p>
                <p><strong>Documents:</strong></p>
            `;

            pdfViewer.innerHTML = ''; // Clear the existing PDF viewer

            if (filesData.length > 0) {
                const pdfUrl = await getDownloadURL(ref(storage, filesData[0].path));
                const pdfData = await fetch(pdfUrl).then(response => response.arrayBuffer());

                pdfjsLib.getDocument(pdfData).promise.then(pdf => {
                    pdf.getPage(1).then(page => {
                        const scale = 1.5;
                        const viewport = page.getViewport({ scale });
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        pdfViewer.appendChild(canvas);
                        page.render({ canvasContext: context, viewport });
                    });
                }).catch(error => {
                    console.error('Error rendering PDF: ', error);
                });
            } else {
                pdfViewer.innerHTML = 'No PDF file available for this scholarship.';
            }
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
