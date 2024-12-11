document.addEventListener("DOMContentLoaded", () => {
    fetch("/getName")
    .then(response => response.json())
    .then(name => {
        document.getElementById("userName").textContent = name.name
    })  
})