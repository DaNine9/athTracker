document.addEventListener("DOMContentLoaded" , () =>{
    var contenedor = document.getElementById("clasesDisplay");

    fetch("/getClasses")
    .then(response => response.json())
    .then(data => {
        data.forEach(clase => {
            contenedor.innerHTML += ` <a href="/class?code=${clase.code}"><div style="background-color: #000161" class="rounded m-1 p-3 row mb-3 ps-1 hover">
            <h1 style='font-family: "Plus Jakarta Sans", sans-serif; font-weight:bolder; font-size: 30px; width: fit-content;' class="col">${clase.name}</h1>
            <div style="background-color: #003893;padding: 11px;width: 100px; max-width:125px;" class="float-end col-sm rounded shadow "><b>${clase.code}</b></div>
        </div></a>`
        });
    })
})
