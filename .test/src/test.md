---
theme: dashboard
title: test
---

# test

<div class="card" id="chart-container">
  <div id="button-area">
  </div>
  <div id="chart"></div>
</div>

```js
// 1. Data generator
function getRandomDataset(size = 25) {
  const data = [];
  for (let i = 0; i < size; i++) {
    data.push(5 + Math.floor(Math.random() * 20));
  }
  return data;
}

// 2. Variabelen (gebruik LET voor data omdat we het later overschrijven)
let data = getRandomDataset();
const width = 600;
const height = 150; 
const padding = {top: 30, left: 20, right: 20, bottom: 20}; 

// 3. SVG aanmaken
const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

// 4. Scales
let xScale = d3.scaleBand() 
    .domain(d3.range(data.length))  
    .rangeRound([padding.left, width - padding.right])     
    .paddingInner(0.05);        

let yScale = d3.scaleLinear()                
    .domain([0, 25]) // Fixeer de domein voor een rustiger effect, of gebruik d3.max(data)
    .range([height - padding.bottom, padding.top]);

let cScale = d3.scaleSequential()             
    .interpolator(d3.interpolateGreens)
    .domain([0, 25]);

// 5. Teken de bars
let bars = svg.append("g")
  .selectAll("rect")
  .data(data)
  .join("rect")
    .attr("x", (d, i) => xScale(i))               
    .attr("y", d => yScale(d))
    .attr("width", xScale.bandwidth())            
    .attr("height", d => yScale(0) - yScale(d))
    .attr("fill", d => cScale(d));

// 6. Voeg labels toe
let labels = svg.append("g")
    .attr("class", "labels")
  .selectAll("text")
  .data(data)
  .join("text")
    .text(d => d)                                     
    .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2) 
    .attr("y", d => yScale(d) + 15)
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")                  
    .attr("font-size", "10px")
    .attr("fill", "white");

// 7. Update functie
function updateData() {
  data = getRandomDataset(25); // Geen 'const' hier!
  
  // Update scales indien nodig
  yScale.domain([0, d3.max(data)]); 

  svg.selectAll("rect")
    .data(data)
    .transition()
    .duration(750)
    .delay((d, i) => i * 20)
    .attr("y", d => yScale(d))
    .attr("height", d => yScale(0) - yScale(d))
    .attr("fill", d => cScale(d));

  svg.selectAll(".labels text")
    .data(data)
    .transition()
    .duration(750)
    .delay((d, i) => i * 20)
    .text(d => d)
    .attr("y", d => yScale(d) + 15);
}

// 8. Koppel de knop (Framework stijl)
const btn2 = Inputs.button("Wissel data");

btn2.addEventListener("click", () => {
  updateData();  
});

// 9. Display alles
//display(btn);
//display(svg.node());

``` 
<div class="card" id="chart-container">
  <div id="button-area">
    ${btn2}

  </div>
  <div id="chart">
    ${svg.node()}

  </div>
</div>
