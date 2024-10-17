import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

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

async function fetchScholarshipsByCategory() {
    try {
        const querySnapshot = await getDocs(collection(db, 'scholarships'));
        const scholarships = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(scholarship => scholarship.approved);
        displayScholarshipsByCategory(scholarships);
    } catch (error) {
        console.error('Error fetching scholarships: ', error);
    }
}

function displayScholarshipsByCategory(scholarships) {
    const container = document.getElementById('scholarships-container');
    container.innerHTML = ''; // Clear existing content

    const categories = scholarships.reduce((acc, scholarship) => {
        if (!acc[scholarship.category]) {
            acc[scholarship.category] = 0;
        }
        acc[scholarship.category]++;
        return acc;
    }, {});

    const sliderDiv = document.createElement('div');
    sliderDiv.className = 'scholarships-slider';

    for (const category in categories) {
        alert(category);
        const categoryWrapper = document.createElement('div');
        categoryWrapper.className = 'category-wrapper';

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-div mb-4 text-center';
        categoryDiv.innerHTML = `
            <div class="circular-div d-flex align-items-center justify-content-center mb-2">
                ${categories[category]}
            </div>
            <h5>${category}</h5>
        `;
        categoryWrapper.appendChild(categoryDiv);
        sliderDiv.appendChild(categoryWrapper);
    }

    container.appendChild(sliderDiv);

    // Initialize Slick Slider
    $('.scholarships-slider').slick({
        infinite: true,
        slidesToShow: 7,
        slidesToScroll: 6,
        arrows: true,
        dots: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
}

document.addEventListener('DOMContentLoaded', fetchScholarshipsByCategory);
