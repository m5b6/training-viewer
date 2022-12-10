


document.querySelectorAll(".muscle-groups svg g g[id]").forEach(function (group) {
  // For the hover
  group.addEventListener('mouseover', function (el) {
    let id = el.path[1].id.toLowerCase()
    if (!id) id = el.path[2].id.toLowerCase()
    let label = document.querySelectorAll("label[for=" + id + "]")[0]
    if (label.classList)
      label.classList.add("hover")
    else
      label.className += ' ' + "hover"
  })
  group.addEventListener('mouseout', function (el) {
    let id = el.path[1].id.toLowerCase()
    if (!id) id = el.path[2].id.toLowerCase()
    let label = document.querySelectorAll("label[for=" + id + "]")[0]
    let clss = "hover"
    if (label.classList)
      label.classList.remove(clss)
    else
      label.className = label.className.replace(new RegExp('(^|\\b)' + clss.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
  })
  // For the click
  group.addEventListener('click', function (el) {
    let id = el.path[1].id.toLowerCase()
    if (!id) id = el.path[2].id.toLowerCase()
    let input = document.getElementById(id)
    if (input.checked) input.checked = false
    else input.checked = true

  });

})
/////////////////////FIN DE CODIGO DE CODEPEN/////////////////////
/////////////////////FIN DE CODIGO DE CODEPEN/////////////////////
/////////////////////FIN DE CODIGO DE CODEPEN/////////////////////

//CONSIDERACIÓN: ESTOS DATOS DE PONDERACIÓN SON 
//OBTENIDOS DE EXPERIENCIA PERSONAL Y ELECTROMIOGRAFÍA,
//Y BUSCAN PONDERAR LA ACTIVACION DE DISTINTOS GRUPOS MUSCULARES
//EN DISTINTOS EJERCICIOS.

exercisePonderation = {
  "LEGS": { "QUADS": 1, "ADDUCTORS": 0.3, "HAMSTRINGS": 0.6, "GLUTES": 0.5, "ABS": 0.2 },
  "DEADLIFT": { "QUADS": 0.4, "LATS": 0.2, "TRAPEZIUS": 0.3, "HAMSTRINGS": 1, "GLUTES": 0.8, "ABS": 0.5, "FOREARMS": 0.2 },
  "PULL_UP": { "LATS": 1, "TRAPEZIUS": 0.4, "BICEPS": 0.6, "FOREARMS": 0.4 },
  "LATS": { "LATS": 1, "TRAPEZIUS": 0.2, "BICEPS": 0.7, "FOREARMS": 0.2 },
  "CARDIO": { "QUADS": 0.2, "ADDUCTORS": 0.2, "HAMSTRINGS": 0.4, "CALVES": 1, "GLUTES": 0.4, "ABS": 0.4 },
  "BENCH_PRESS": { "PECTORALS": 1, "TRICEPS": 0.4, "DELTOIDS": 0.6, "ABS": 0.2 },
  "CHEST": { "PECTORALS": 1, "DELTOIDS": 0.6 },
  "DELTOIDS": { "DELTOIDS": 1, "TRICEPS": 0.4, "ABS": 0.1 },
  "SHOULDERS": { "DELTOIDS": 1, "TRICEPS": 0.4, "ABS": 0.1 },
  "TRICEPS_EXTENSION": { "TRICEPS": 1, "DELTOIDS": 0.3 },
  "DIPS": { "TRICEPS": 1, "PECTORALS": 0.8, "DELTOIDS": 0.6 },
  "PUSH_UP": { "PECTORALS": 1, "DELTOIDS": 0.6, "TRICEPS": 0.4 },
  "LATERAL_RAISE": { "DELTOIDS": 1 },
  "CURL": { "BICEPS": 1, "FOREARMS": 0.4 },
  "ROW": { "LATS": 0.5, "TRAPEZIUS": 1, "BICEPS": 0.5, "FOREARMS": 0.4 },
  "CLEAN": { "QUADS": 0.4, "LATS": 0.2, "TRAPEZIUS": 0.3, "HAMSTRINGS": 1, "GLUTES": 0.8, "ABS": 0.5, "FOREARMS": 0.2 },
  "SIT_UP": { "ABS": 1 },
}






  //manejo de datos CRUDOS de GARMIN
  function makeGarminDataUsable(d) {
    const muscleGroupUsage = {
      "QUADS": 0,
      "ADDUCTORS": 0,
      "HAMSTRINGS": 0,
      "CALVES": 0,
      "GLUTES": 0,
      "ABS": 0,
      "LATS": 0,
      "TRAPEZIUS": 0,
      "BICEPS": 0,
      "FOREARMS": 0,
      "PECTORALS": 0,
      "DELTOIDS": 0,
      "TRICEPS": 0
      //HAY 13 MUSCULOS NO OLVIDAR.... FALTA BORRAR OBLIQUES DEL CODIGO!!!!!//
    }
    let jason = (JSON.parse(JSON.stringify(d[0])))
    let keys = Object.keys(jason)
    let values = Object.values(jason)
    let pretty = []
    for (let i = 0; i < keys.length; i++) {
      let obj = {}
      obj[keys[i]] = values[i]
      pretty.push(obj)
    }
    let summarizedActivities = pretty[0].summarizedActivitiesExport
    let setsData = []
    summarizedActivities.forEach(function (activity) {
      if (activity.name === "Strength") {
        (activity.summarizedExerciseSets).forEach(function (set) {
          setsData.push(set)
        })
      }
    }
    )
    setsData.forEach(function (set) {
      let ponderation = exercisePonderation[set.category]


      try {
        Object.entries(ponderation).forEach(function (entry) {
          muscleGroupUsage[entry[0]] += entry[1] * set.reps
        })
      } catch (error) {
        //buen manejo de errores va aqui :P
      }
    })
    return (muscleGroupUsage)
  }

  function repsOverTime(d){
    let quadsUsage = []
    let adductorsUsage = []
    let hamstringsUsage = []
    let calvesUsage = []
    let glutesUsage = []
    let absUsage = []
    let latsUsage = []
    let trapeziusUsage = []
    let bicepsUsage = []
    let forearmsUsage = []
    let pectoralsUsage = []
    let deltoidsUsage = []
    let tricepsUsage = []

    let jason = (JSON.parse(JSON.stringify(d[0])))
    let keys = Object.keys(jason)
    let values = Object.values(jason)
    let pretty = []
    for (let i = 0; i < keys.length; i++) {
      let obj = {}
      obj[keys[i]] = values[i]
      pretty.push(obj)
    }
    setsData = []
    let summarizedActivities = pretty[0].summarizedActivitiesExport
    let asd = 0

    summarizedActivities.forEach(function (activity) {
      if (activity.name === "Strength") {
        (activity.summarizedExerciseSets).forEach(function (set) {
          
          if (exercisePonderation[set.category] !== undefined){
          
          if (exercisePonderation[set.category]["HAMSTRINGS"] !== undefined) {  
            hamstringsUsage.push([set.reps * exercisePonderation[set.category]["HAMSTRINGS"], (activity.beginTimestamp)])
          }
          if (exercisePonderation[set.category]["QUADS"] !== undefined) {
            quadsUsage.push([set.reps * exercisePonderation[set.category]["QUADS"], (activity.beginTimestamp)])
          }
          if (exercisePonderation[set.category]["ADDUCTORS"] !== undefined) {
            adductorsUsage.push([set.reps * exercisePonderation[set.category]["ADDUCTORS"], (activity.beginTimestamp)])
          }
          if (exercisePonderation[set.category]["CALVES"] !== undefined) {
            calvesUsage.push([set.reps * exercisePonderation[set.category]["CALVES"], (activity.beginTimestamp)])
          }
          if (exercisePonderation[set.category]["GLUTES"] !== undefined) {
            glutesUsage.push([set.reps * exercisePonderation[set.category]["GLUTES"], (activity.beginTimestamp)])
          }
          if (exercisePonderation[set.category]["ABS"] !== undefined) {
            absUsage.push([set.reps * exercisePonderation[set.category]["ABS"], (activity.beginTimestamp)])
          }
          if (exercisePonderation[set.category]["LATS"] !== undefined) {
            latsUsage.push([set.reps * exercisePonderation[set.category]["LATS"], (activity.beginTimestamp)])
          }
          if (exercisePonderation[set.category]["TRAPEZIUS"] !== undefined) {
            trapeziusUsage.push([set.reps * exercisePonderation[set.category]["TRAPEZIUS"], (activity.beginTimestamp)])
          }
          if (exercisePonderation[set.category]["BICEPS"] !== undefined) {
            bicepsUsage.push([set.reps * exercisePonderation[set.category]["BICEPS"], (activity.beginTimestamp)])
          }
          if (exercisePonderation[set.category]["FOREARMS"] !== undefined) {
            forearmsUsage.push([set.reps * exercisePonderation[set.category]["FOREARMS"], (activity.beginTimestamp)])
          }
          if (exercisePonderation[set.category]["PECTORALS"] !== undefined) {
            pectoralsUsage.push([set.reps * exercisePonderation[set.category]["PECTORALS"], (activity.beginTimestamp)])
          }
          if (exercisePonderation[set.category]["DELTOIDS"] !== undefined) {
            deltoidsUsage.push([set.reps * exercisePonderation[set.category]["DELTOIDS"], (activity.beginTimestamp)])
          }
          if (exercisePonderation[set.category]["TRICEPS"] !== undefined) {
            tricepsUsage.push([set.reps * exercisePonderation[set.category]["TRICEPS"], (activity.beginTimestamp)])
          }

        }
        }
        )
      }
    }
    
    )

    return(
      {
        "QUADS": quadsUsage,
        "ADDUCTORS": adductorsUsage,
        "HAMSTRINGS": hamstringsUsage,
        "CALVES": calvesUsage,
        "GLUTES": glutesUsage,
        "ABS": absUsage,
        "LATS": latsUsage,
        "TRAPEZIUS": trapeziusUsage,
        "BICEPS": bicepsUsage,
        "FOREARMS": forearmsUsage,
        "PECTORALS": pectoralsUsage,
        "DELTOIDS": deltoidsUsage,
        "TRICEPS": tricepsUsage
      }
    )
  }


  d3.json("UGLY.json").then(function (data) {
    const muscleUsage = (makeGarminDataUsable(data));
    const repsTime = (repsOverTime(data))
    
    Viz1(muscleUsage,repsTime)

  })








function Viz1(obj,repsTime) {

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let currentDate = `${year}-${month}-${day}`;

  (document.getElementById("date_end")).value = currentDate

  checkboxArray = [].slice.call(document.getElementsByTagName('input'))
  //esta es for the click de checkbox
  let ges = [].slice.call(document.getElementsByTagName("g"))
  checkboxArray.forEach(function (checkbox) {
    if (checkbox.id !== "date_start" & checkbox.id !== "date_end") {
    checkbox.addEventListener('change', function (e) {
      checkboxArray.forEach(function (checkbox) {
        checkbox.checked = false
      })
    
      e.target.checked = true
      Viz2(repsTime[e.target.id.toUpperCase()],e.target.id)
      ges.forEach(function (g) {
        if (obj[g.id.toUpperCase()] !== undefined && g.id.toLowerCase() !== e.target.id.toLowerCase()) {
          g.style.opacity = 0.3
                }
        else {
          g.style.opacity = 1
        }

      })
    })
  }})
  document.getElementById("date_start").value = "2022-10-01"


  let minimumEngagement = Math.min(...Object.values(obj))
  let maximumEngagement = Math.max(...Object.values(obj))

  document.getElementById("legendContainer").appendChild(
    (Legend(d3.scaleSequential([0, maximumEngagement], d3.interpolateOranges), {title: "Repeticiones hechas "}))
    )
  //COLOUR SCALE GOES HERE!
  var myColor = d3.scaleSequential()
  .interpolator(d3.interpolateOranges)
    .domain([0, maximumEngagement])
  //COLOUR SCALE GOES HERE!

  const SVGFront = d3.selectAll("#Back-Muscles,#Front-Muscles")


 

  const muscleGroups = SVGFront
    .selectAll("g")

  const individualMuscles = muscleGroups
    .selectAll("path")


  const applyColour = individualMuscles.attr("style", function (d) {
    return "fill:" + myColor(obj[(this.parentNode.id).toUpperCase()])
  })

  individualMuscles.on("mousemove", (event) => {
    Tooltip.style("opacity", 0.9)
      .style("left", (event.pageX + 10) + "px")
      .style("top", (event.pageY - 20) + "px")
      .html(event.path[1].id.toUpperCase() + ": " + Math.floor(obj[event.path[1].id.toUpperCase()]) + " Repeticiones hechas")

  })

  //todo MOUSELEAVE
  individualMuscles.on("mouseleave", (event) => {
    Tooltip.style("opacity", 0)
  })


  var Tooltip = d3.select("main")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .html(function () {
      return this.parentNode
    })
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "1px")
    .style("padding", "5px")
    .style("width", "101px")
    .style("height", "auto")
    .style("position", "absolute")
    .style("z-index", "99999")

}

  function Viz2(dataset,name){
  timestamps = []
  reps = []
  cumulative = []
  count = 0
  const xmargin = 55
  const ymargin = 25
  dataset.forEach(function (array) {
    timestamps.push(array[1])
    reps.push(array[0])
    count += array[0]
    cumulative.push(count)
  })



  new_data = []
  restrictedStamps = []
  let timeConstraint = [0,9999999999999999999999999999999999999999]

  //get value of date input
  let dateInputEnd = document.getElementById("date_end")
  let dateInputStart = document.getElementById("date_start")
  if (dateInputEnd.value !== "") {
    timeConstraint = [new Date(dateInputStart.value).getTime() +86400000 , new Date(dateInputEnd.value).getTime() + 86400000]
  }
  dateInputEnd.addEventListener("change", function (e) {
  setTimeout(function () {
  Viz2(dataset,name)}, 100)
  })
  dateInputStart.addEventListener("change", function (e) {
    setTimeout(function () {
    Viz2(dataset,name)}, 100)
    })
  
  dataset.forEach(function (array) {
    let i = dataset.indexOf(array)
    if(timestamps[(timestamps).length -  i - 1] < timeConstraint[1] & timestamps[(timestamps).length -  i - 1] > timeConstraint[0]){ 

      new_data.push([cumulative[i], timestamps[(timestamps).length -  i - 1]])
      restrictedStamps.push(timestamps[(timestamps).length -  i - 1])}
  })  

  //timestamps to date
  timestamps_date = restrictedStamps.map(function (timestamp) {
    return new Date(timestamp)
  })
  let min_date =(timestamps_date[timestamps_date.length - 1])  
  let max_date = (timestamps_date[0])  


  //////////////////////////////////////////////
d3.select("svg#vis2").remove()
d3.select(".placeholder").remove()

d3.select(".other")
.append("svg")
.attr("id","vis2")
.attr("width","690")
.attr("height","405")

var svg = d3.select("svg#vis2"),
    margin = 180,
    width = svg.attr("width") - margin, 
    height = svg.attr("height") - margin+90

var xScale = d3.scaleLinear().domain([Math.min(...restrictedStamps), Math.max(...restrictedStamps)]).range([0, width]),
    yScale = d3.scaleLinear().domain([0, Math.max(...cumulative)*1.3]).range([height, 0]);
    timeScale = d3.scaleUtc().domain([min_date, max_date]).range([0, width])
    
var g = svg.append("g")
    .attr("transform", "translate(" + xmargin + "," + ymargin + ")");

svg.append('text')
.attr('x', width/2 + xmargin)
.attr('y', ymargin)
.attr('text-anchor', 'middle')
.style('font-size', "1.3em")
.text('Repeticiones hechas con '+name+' a través del tiempo');

svg.append('text')
.attr('x', width/2 + xmargin)
.attr('y', height +85)
.attr('text-anchor', 'middle')
.style('font-size', 12)
.text('Fecha')

svg.append('text')
.attr('transform', 'translate('+(xmargin-45)+',' + (ymargin+290) + ')rotate(-90)')
.style('font-size', 12)
.text('Repeticiones hechas (acumulado)');

g.append("g")
 .attr("id", "x-axis")
 .attr("transform", "translate(0," + height + ")")
 .call(d3.axisBottom(timeScale)
 .tickFormat(d3.timeFormat("%d-%m-%Y"))
 .ticks(10))
 .selectAll("text")
 .attr("transform", "rotate(-45)" )
 .attr("dy", ".14em")
 .attr("dx", "-3.2em")

g.append("g")
 .call(d3.axisLeft(yScale)
 .ticks(7));



var line = d3.line()
.x(function(d) { return xScale(d[1]); }) 
.y(function(d) { return yScale(d[0]); }) 
.curve(d3.curveStep)

svg.append("path")
.datum(new_data) 
.attr("class", "line") 
.attr("transform", "translate(" + xmargin + "," + ymargin + ")")
.attr("d", line)
.style("fill", "none")
.style("stroke", "orange")
.style("stroke-width", "2");



}




//funcion para obtener leyenda de escala de colores sacada de https://observablehq.com/@d3/color-legend
function Legend(color, {
  title,
  tickSize = 6,
  width = 320, 
  height = 44 + tickSize,
  marginTop = 18,
  marginRight = 0,
  marginBottom = 16 + tickSize,
  marginLeft = 0,
  ticks = width / 64,
  tickFormat,
  tickValues
} = {}) {

  function ramp(color, n = 256) {
    const canvas = document.createElement("canvas");
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    for (let i = 0; i < n; ++i) {
      context.fillStyle = color(i / (n - 1));
      context.fillRect(i, 0, 1, 1);
    }
    return canvas;
  }

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .style("overflow", "visible")
      .style("display", "block");

  let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
  let x;

  // Continuous
  if (color.interpolate) {
    const n = Math.min(color.domain().length, color.range().length);

    x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));

    svg.append("image")
        .attr("x", marginLeft)
        .attr("y", marginTop)
        .attr("width", width - marginLeft - marginRight)
        .attr("height", height - marginTop - marginBottom)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
  }

  // Sequential
  else if (color.interpolator) {
    x = Object.assign(color.copy()
        .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
        {range() { return [marginLeft, width - marginRight]; }});

    svg.append("image")
        .attr("x", marginLeft)
        .attr("y", marginTop)
        .attr("width", width - marginLeft - marginRight)
        .attr("height", height - marginTop - marginBottom)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", ramp(color.interpolator()).toDataURL());

    // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
    if (!x.ticks) {
      if (tickValues === undefined) {
        const n = Math.round(ticks + 1);
        tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
      }
      if (typeof tickFormat !== "function") {
        tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
      }
    }
  }

  // Threshold
  else if (color.invertExtent) {
    const thresholds
        = color.thresholds ? color.thresholds() // scaleQuantize
        : color.quantiles ? color.quantiles() // scaleQuantile
        : color.domain(); // scaleThreshold

    const thresholdFormat
        = tickFormat === undefined ? d => d
        : typeof tickFormat === "string" ? d3.format(tickFormat)
        : tickFormat;

    x = d3.scaleLinear()
        .domain([-1, color.range().length - 1])
        .rangeRound([marginLeft, width - marginRight]);

    svg.append("g")
      .selectAll("rect")
      .data(color.range())
      .join("rect")
        .attr("x", (d, i) => x(i - 1))
        .attr("y", marginTop)
        .attr("width", (d, i) => x(i) - x(i - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", d => d);

    tickValues = d3.range(thresholds.length);
    tickFormat = i => thresholdFormat(thresholds[i], i);
  }

  // Ordinal
  else {
    x = d3.scaleBand()
        .domain(color.domain())
        .rangeRound([marginLeft, width - marginRight]);

    svg.append("g")
      .selectAll("rect")
      .data(color.domain())
      .join("rect")
        .attr("x", x)
        .attr("y", marginTop)
        .attr("width", Math.max(0, x.bandwidth() - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", color);

    tickAdjust = () => {};
  }

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x)
        .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
        .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
        .tickSize(tickSize)
        .tickValues(tickValues))
      .call(tickAdjust)
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", marginLeft)
        .attr("y", marginTop + marginBottom - height - 6)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .attr("class", "title")
        .text(title));

  return svg.node();
}
