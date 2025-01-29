document.addEventListener("DOMContentLoaded", () => {

    var metaValue
    
    fetch("/getMeta")
    .then(response => response.json())
    .then(data => {
        console.log(data.meta)
        metaValue = data.meta
        
    })

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
                    backgroundColor:"transparent"
                },
                {
                    // Adding a horizontal line at the meta value
                    label: "Objetivo",
                    data: new Array(values.length).fill(metaValue), // Create an array of the same meta value
                    borderColor: "#999999", // Set the color of the line
                    pointRadius:0,
                    borderWidth: 2,
                    borderDash: [5, 5], // Optional: make the line dashed
                    fill: false
                }]
            },
            options:{
                responsive:true,
                aspectRatio:1,
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