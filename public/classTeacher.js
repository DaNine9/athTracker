document.addEventListener("DOMContentLoaded" , () =>{
    var contenedor = document.getElementById("studentsDisplay");
    var idClase = document.getElementById("idClase").textContent;

    fetch(`/getClassData`)
    .then(response => response.json())
    .then(data => {
        data.forEach(alumno => {
            contenedor.innerHTML += `<a href="/detalleAlumno?idAlumno=${alumno.UID}&idClase=${idClase}"><div style="background-color: #000161" class="rounded m-1 p-3 row mb-3 hover">
                <h1 style='font-family: "Plus Jakarta Sans", sans-serif; font-weight:bolder; font-size: 30px; width: fit-content;' class="ps-1 col">${alumno.FNAME}</h1>
        </div></a>`
        });
    })
})