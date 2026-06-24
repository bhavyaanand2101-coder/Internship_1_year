// Function to smooth scroll to the 'Projects' section of the webpage
function scrollToProjects(){
    // Find the HTML element with id "projects" and trigger a smooth scrolling transition to it
    document
    .getElementById("projects")
    .scrollIntoView({
        behavior:"smooth" // Enables animated smooth scrolling rather than a sudden jump
    });
}

// Add an event listener to the contact form to handle submission
document
.querySelector("form")
.addEventListener("submit", function(e){
    // Prevent the default browser form submission behavior (which reloads the page)
    e.preventDefault();

    // Show a success message alert to the user
    alert("Message Sent Successfully!");
});