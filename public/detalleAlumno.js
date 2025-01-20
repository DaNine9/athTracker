var idAlumno = ""
var idClase = ""

document.addEventListener("DOMContentLoaded", () => {
    
    idClase = document.getElementById("idClase").textContent
    idAlumno = document.getElementById("idAlumno").textContent

    console.log(idClase, idAlumno)

    var contenedorPruebas = document.getElementById("contenedorPruebas")

    fetch("/getPruebasAlumno?idAlumno=" + idAlumno + "&idClase=" + idClase)
    .then(response => response.json())
    .then(pruebas => {
        console.log(pruebas)
        pruebas.forEach(prueba => {
            contenedorPruebas.innerHTML += `<div style="background-color: #000161" class="rounded m-1 p-3 row mb-3 ps-1 hover"><a href="/detallePrueba?id=${prueba.idPruebasAlumnos}">
                <h1 style="font-family: &quot;Plus Jakarta Sans&quot;, sans-serif; font-weight:bolder; font-size: 30px; width: fit-content;" class="col">${prueba.name}</h1>
                </a>
                </div>`
        })
    })

})

function joinClass(){
    var container = document.getElementById("container1");
    container.innerHTML = '<div class="rounded p-3 mb-4 shadow-sm" style="background-color: #000161;"><form method="POST" class="d-flex align-items-center" action="/addPruebaAlumno"><div class="flex-grow-1 me-2"><select class="form-select" name="prueba" id="selectPruebasMaster" aria-label="Seleccione una prueba"><option value="" selected disabled>Seleccione una prueba</option></select><input style="display:none;" value="'+idAlumno+'" name="idAlumno"><input style="display:none;" value="'+idClase+'" name="idClase"></div><button type="submit" class="btn btn-primary px-4">Añadir</button></form></div>'

    //MASTER PRUEBAS
    const selectPruebasMaster = document.getElementById("selectPruebasMaster")

    fetch("/getMasterPruebas")
    .then(response => response.json())
    .then(data => {
        console.log(data)
        data.forEach(prueba => {
            var opt = document.createElement("option")
            opt.value = prueba.id
            opt.textContent = prueba.name
            selectPruebasMaster.appendChild(opt)
        });
    })
}