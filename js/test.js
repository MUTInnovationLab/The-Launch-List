document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("submitBtn").addEventListener("click", function() {
        sendEmail(); // Call the sendEmail function
    });
});

function sendEmail() {
    // Your email sending logic here
    console.log("Email sent!");
}
