document.addEventListener("DOMContentLoaded", () => {
    fetch("/getResultadosPrueba")
    .then(result => result.json())
    .then(data => {
        console.log(data)
    })

    

})