document.addEventListener("DOMContentLoaded" , () =>{
    var contenedor = document.getElementById("contenedor");

    fetch("/getClasses")
    .then(response => response.json())
    .then(data => {
        data.forEach(clase => {
            contenedor.innerHTML += ` <a href="/class?code=${clase.code}"><div style="background-color: #000161" class="rounded m-1 p-3 row mb-3 ps-1 hover">
            <h1 style='font-family: "Plus Jakarta Sans", sans-serif; font-weight:bolder; font-size: 30px; width: fit-content;' class="col">${clase.name}</h1>
            <div style="background-color: #003893;padding: 11px;width: 100px; max-width:125px;" class="float-end col-sm rounded shadow "><b>${clase.teacherName}</b></div></a>
        </div>`
        });
        console.log(clase.name)
        console.log(clase.teacherId)
    })
})

function joinClass(){
    var container = document.getElementById("container1");
    container.innerHTML = '<div id="container1" style="background-color: #000161" class="rounded p-3 mb-3 hover"><div class=""><form class="d-flex" method="post" action="/joinClass"><input type="text" name="classCode" class="form-control me-2 flex-grow-1 mx-0" placeholder="Código de clase"><input type="submit" value="Crear" class="btn-primary btn"></form></div></div>'
}