document.addEventListener("DOMContentLoaded", () => {
    fetch("/getResultadosPrueba")
    .then(result => result.json())
    .then(data => {
        console.log(data)

        const labels = data.map(d => d.createdOn.split(" ")[0])
        const values = data.map(d => d.resultado)

        const ctx = document.getElementById("chart").getContext("2d")

        var gradient = ctx.createLinearGradient(0,0,0,400)
        gradient.addColorStop(0,"#0d6efd")
        gradient.addColorStop(1,"#0d6efd00")
        
        new Chart(ctx, {
            type:"line",
            data:{
                labels:labels,
                datasets:[{
                    label:"Resultado",
                    data:values,
                    borderColor:"#0d6efd",
                    borderWidth:2,
                    fill:true,
                    tension:0.3,
                    backgroundColor:gradient
                }]
            },
            options:{
                responsive:true,
                scales:{
                    x:{
                        grid:{
                            color:"#333"
                        },
                        title:{
                            display:false,
                            text:"Fechas"
                        },
                        ticks:{
                            autoSkip:true,
                            maxRotation:90,
                            minRotation:90,
                            color:"white"

                        }
                    },
                    y:{
                        grid:{
                            color:"#333"
                        },
                        title:{
                            display:false,
                            text:"Resultados"
                        },
                        beginAtZero:true,
                        ticks:{
                            color:"white"

                        }
                    }
                }
            }
        });

        createLineChart();

    })
})