document.addEventListener("DOMContentLoaded", () => {
    
    var idClase = document.getElementById("idClase").textContent
    var idAlumno = document.getElementById("idAlumno").textContent

    console.log(idClase, idAlumno)

    fetch(`/dataAlumno?idAlumno=${idAlumno}&idClase=${idClase}`)
    .then(response => response.json())
    .then(data =>{
        console.log(data)
    })

})

function joinClass(){
    var container = document.getElementById("container1");
    container.innerHTML = '<div class="rounded p-3 mb-4 shadow-sm" style="background-color: #000161;"><form class="d-flex align-items-center" action="/addPruebaAlumno"><div class="flex-grow-1 me-2"><select class="form-select" name="prueba" id="selectPruebasMaster" aria-label="Seleccione una prueba"><option value="" selected disabled>Seleccione una prueba</option></select></div><button type="submit" class="btn btn-primary px-4">Añadir</button></form></div>'

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