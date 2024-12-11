document.addEventListener("DOMContentLoaded", () => {
    
    var idClase = document.getElementById("idClase").textContent
    var idAlumno = document.getElementById("idAlumno").textContent

    fetch(`/dataAlumno?idAlumno=${idAlumno}&idClase=${idClase}`)
    .then(response => response.json())
    .then(data =>{
        console.log(data)
    })
})