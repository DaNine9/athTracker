var nameDisplay = document.getElementById("nameDisplay");
var centerDisplay = document.getElementById("centerDisplay");

//info user
var nombreCompleto = ""
var nombre = ""
var username = ""
var center = ""

//info center
var nombreCentro

fetch("/getUserData")
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            const user = data[0];

            nombreCompleto = user.name;
            nombre = user.name.split(" ")[0];
            username = user.username;
            center = user.center;

            //poner el nombre
            nameDisplay.innerText = nombre
        }
    })

    fetch("/getCenterData")
    .then(response => response.json())
    .then(data => {
        if (data.length > 0) {
            const center = data[0];

            nombreCentro = center.name;

            //poner el nombre
            centerDisplay.innerText = nombreCentro
        }
    })


function createClass(){
    var container = document.getElementById("container1");
    container.innerHTML = '<div id="container1" style="background-color: #000161" class="rounded p-3 mb-3 hover"><div class=""><form class="d-flex" method="post" action="/newClass"><input type="text" name="ndci" class="form-control me-2 flex-grow-1 mx-0" placeholder="Nombre de la nueva clase"><input type="submit" value="Crear" class="btn-primary btn"></form></div></div>'
}