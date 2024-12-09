document.addEventListener("DOMContentLoaded", () => {
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
    
})