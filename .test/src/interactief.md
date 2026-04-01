---
theme: dashboard
title: interactief horizontaal
---

# Interactieve Horizontale Grafiek



```js
const launches = FileAttachment("data/launches.csv").csv({typed: true});
const workbook = await FileAttachment("data/AHM 2024 YNG_NL.xlsx").xlsx();
const dataDetail = workbook.sheet(4, {headers: true});
const schoneDataDetail = dataDetail.map(d => ({
  id: d["#"],
  niveau1: d["Detail mismatch onderwijsniveau"],
  niveau2: d["Detail mismatch onderwijsniveau_"],
  niveau3: d["Detail mismatch onderwijsniveau__"],
  niveau4: d["Detail mismatch onderwijsniveau___"],
  niveau5: d["Detail mismatch onderwijsniveau____"],
  niveau6: d["Detail mismatch onderwijsniveau_____"],
  niveau7: d["Detail mismatch onderwijsniveau______"],
  niveau8: d["Detail mismatch onderwijsniveau_______"],
  niveau9: d["Detail mismatch onderwijsniveau________"],
  niveau10: d["Detail mismatch onderwijsniveau_________"],
  niveau11: d["Detail mismatch onderwijsniveau__________"],
  niveau12: d["Detail mismatch onderwijsniveau___________"],
  niveau13: d["Detail mismatch onderwijsniveau____________"],
  niveau14: d["Detail mismatch onderwijsniveau_____________"]
}));

const labels1 = new Map();
{
  labels1.set(0, "Onderwijsniveau komt overeen met wat nodig is voor mijn job");
  labels1.set(1, "Onderwijsniveau is hoger dan wat nodig is voor mijn job");
  labels1.set(2, "Onderwijsniveau is lager dan wat nodig is voor mijn job");
}

const dataM = [0,0,0];
dataM[0] = schoneDataDetail[5].niveau4;
dataM[1] = schoneDataDetail[6].niveau4;
dataM[2] = schoneDataDetail[7].niveau4;
const dataV = [0,0,0];
dataV[0] = schoneDataDetail[5].niveau7;
dataV[1] = schoneDataDetail[6].niveau7;
dataV[2] = schoneDataDetail[7].niveau7;


// 1. Data generator
function getRandomDataset(size = 5) {
  return Array.from({length: size}, () => 5 + Math.floor(Math.random() * 20));
}

// 2. Variabelen
const data1 = [45,20,10,60,70];
const data2 = [10,90,10,90,10];
let data = data1;
let isData1 = true;
const width = 600; // Iets breder voor horizontale bars
const height = 500; 
const padding = {top: 20, left: 50, right: 40, bottom: 20}; 

// 3. SVG aanmaken
const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

// 4. Scales OMDRAAIEN
// X is nu de waarde (lengte van de balk)
let xScale = d3.scaleLinear()                
    .domain([0, 100])
    .range([padding.left, width - padding.right]);

// Y is nu de categorie (positie van de balk)
let yScale = d3.scaleBand() 
    .domain(d3.range(data.length))  
    .rangeRound([padding.top, height - padding.bottom])     
    .paddingInner(0.1);        

let cScale = d3.scaleSequential(d3.interpolateGreens)
    .domain([0, 100]);

// 5. Teken de bars (Horizontaal)
svg.append("g")
  .selectAll("rect")
  .data(data)
  .join("rect")
    .attr("x", padding.left)               
    .attr("y", (d, i) => yScale(i))
    .attr("width", d => xScale(d) - padding.left)            
    .attr("height", yScale.bandwidth())
    .attr("fill", d => cScale(d));

// 6. Voeg labels toe
svg.append("g")
    .attr("class", "labels")
  .selectAll("text")
  .data(data)
  .join("text")
    .text(d => d)                                     
    .attr("x", d => xScale(d) - 5) // Label aan het einde van de bar
    .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")
    .attr("fill", "white");

// 7. Update functie
function updateData() {
  isData1 = !isData1;
  data = isData1 ? data1:data2;

  svg.selectAll("rect")
    .data(data)
    .transition()
    .duration(750)
    .delay((d, i) => i * 20)
    .attr("width", d => xScale(d) - padding.left)
    .attr("fill", d => cScale(d));

  svg.selectAll(".labels text")
    .data(data)
    .transition()
    .duration(750)
    .delay((d, i) => i * 20)
    .text(d => d)
    .attr("x", d => xScale(d) - 5);
}

// 8. Koppel de knop
const btn2 = Inputs.button("Wissel data");

btn2.addEventListener("click", () => {
  updateData();  
});
```

<div class="card">
  <div id="button-area">${btn2}</div>
  <div id="chart">${svg.node()}</div>
</div>

```js
const labels1 = new Map();
{
  labels1.set(0, "Onderwijsniveau komt overeen met wat nodig is voor mijn job");
  labels1.set(1, "Onderwijsniveau is hoger dan wat nodig is voor mijn job");
  labels1.set(2, "Onderwijsniveau is lager dan wat nodig is voor mijn job");
}

const gestapeldeDataGeslacht = [
    { groep: "Man", categorie: labels1.get(0), waarde: Number(dataM[0]) },
    { groep: "Man", categorie: labels1.get(1), waarde: Number(dataM[1]) },
    { groep: "Man", categorie: labels1.get(2), waarde: Number(dataM[2]) },
    { groep: "Vrouw", categorie: labels1.get(0), waarde: Number(dataV[0]) },
    { groep: "Vrouw", categorie: labels1.get(1), waarde: Number(dataV[1]) },
    { groep: "Vrouw", categorie: labels1.get(2), waarde: Number(dataV[2]) }
];

// 3. SVG aanmaken
const svg2 = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

// X is nu de waarde (lengte van de balk)
let xScale = d3.scaleLinear()                
    .domain([0, 100])
    .range([padding.left, width - padding.right]);

// Y is nu de categorie (positie van de balk)
let yScale = d3.scaleBand() 
    .domain(d3.range(data.length))  
    .rangeRound([padding.top, height - padding.bottom])     
    .paddingInner(0.1);        

let cScale = d3.scaleSequential(d3.interpolateGreens)
    .domain([0, 100]);

let isMan = true;
let groepnu = isMan ? "Man":"Vrouw";

// 5. Teken de bars (Horizontaal)
svg2.append("g")
  .selectAll("rect")
  .data(gestapeldeDataGeslacht)
  .join("rect")
    .filter(d => d.groep === groepnu)
    .attr("x", d => padding.left)               
    .attr("y", (d, i) => yScale(i))
    .attr("width", d => xScale(d.waarde) - padding.left)            
    .attr("height", yScale.bandwidth())
    .attr("fill", d => cScale(d.waarde));

// 6. Voeg labels toe
svg2.append("g")
    .attr("class", "labels")
  .selectAll("text")
  .data(gestapeldeDataGeslacht)
  .join("text")
    .filter(d => d.groep === groepnu)
    .text(d => d.waarde)                                     
    .attr("x", d => xScale(d.waarde) - 5) // Label aan het einde van de bar
    .attr("y", (d, i) => yScale(i) + yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")
    .attr("fill", "white");

// 7. Update functie
function updateData() {
  isMan = !isMan;
  groepnu = isMan ? "Man":"Vrouw";
  const data0 = gestapeldeDataGeslacht.filter(d => d.groep === groepnu);

  svg2.selectAll("rect")
    .data(data0)
    .transition()
    .duration(750)
    .delay((d, i) => i * 20)
    .attr("width", d => xScale(d.waarde) - padding.left)
    .attr("fill", d => cScale(d.waarde));

  svg2.selectAll(".labels text")
    .data(data0)
    .transition()
    .duration(750)
    .delay((d, i) => i * 20)
    .text(d => d.waarde)
    .attr("x", d => xScale(d.waarde) - 5);
}

// 8. Koppel de knop
const btn3 = Inputs.button("Wissel data");

btn3.addEventListener("click", () => {
  updateData();  
});

```

<div class="card">
  <div id="button-area2">${btn3}</div>
  <div id="chart2">${svg2.node()}</div>
</div>

<div id="test">