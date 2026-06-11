function scrollToProjects(){
    document
    .getElementById("projects")
    .scrollIntoView({
        behavior:"smooth"
    });
}

document
.querySelector("form")
.addEventListener("submit", function(e){

    e.preventDefault();

    alert("Message Sent Successfully!");
});