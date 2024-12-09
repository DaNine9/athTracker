document.addEventListener("DOMContentLoaded" , () =>{
    var contenedor = document.getElementById("studentsDisplay");

    fetch(`/getClassData`)
    .then(response => response.json())
    .then(data => {
        data.forEach(alumno => {
            contenedor.innerHTML += ` <a href="/alumno?id=${alumno.UID}"><div style="background-color: #000161" class="rounded m-1 p-3 row mb-3 ps-1 hover">
            <h1 style='font-family: "Plus Jakarta Sans", sans-serif; font-weight:bolder; font-size: 30px; width: fit-content;' class="col">${alumno.FNAME}</h1>
            <div style="background-color: #003893;padding: 11px;width: 100px; max-width:125px;" class="float-end col-sm rounded shadow "></div>
        </div></a>`
        });
    })
})