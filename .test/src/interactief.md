---
theme: dashboard
title: interactief
---

# interactief

<div class="card" id="chart-container">
  <div>Geslacht</div>
  <div>Onderwijsniveau</div>

</div>

```js
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

const gestapeldeDataGeslacht = [
    { groep: "Man", categorie: labels1.get(0), waarde: Number(schoneDataDetail[5].niveau4) },
    { groep: "Man", categorie: labels1.get(1), waarde: Number(schoneDataDetail[6].niveau4) },
    { groep: "Man", categorie: labels1.get(2), waarde: Number(schoneDataDetail[7].niveau4) },
    { groep: "Vrouw", categorie: labels1.get(0), waarde: Number(schoneDataDetail[5].niveau7) },
    { groep: "Vrouw", categorie: labels1.get(1), waarde: Number(schoneDataDetail[6].niveau7) },
    { groep: "Vrouw", categorie: labels1.get(2), waarde: Number(schoneDataDetail[7].niveau7) }
];

const width = 928;
const marginTop = 30;
const marginRight = 20;
const marginBottom = 0;
const marginLeft = 90;
const height = 90;
const afstandLabel = 30;

const data0 = gestapeldeDataGeslacht.filter(d => d.groep === "Man");

const series = d3.stack()
    .keys(d3.union(data0.map(d => d.categorie))) // distinct series keys, in input order
    .value(([, D], key) => D.get(key).waarde) // get value for each series key and stack
    .offset(d3.stackOffsetExpand)
  (d3.index(data0, d => d.groep, d => d.categorie)); // group by stack then series key

// Compute the height from the number of stacks.
//const height = series[0].length * 25 + marginTop + marginBottom;

// Prepare the scales for positional and color encodings.
let x = d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    .range([marginLeft, width - marginRight]);

let y = d3.scaleBand()
    .domain(d3.groupSort(data0, (D) => -D.find(d => d.categorie === labels1.get(0)).waarde / d3.sum(D, d => d.waarde), d => d.groep))
    .range([marginTop, height - marginBottom])
    .padding(0.08);

const color = d3.scaleOrdinal()
    .domain(series.map(d => d.key))
    .range(d3.schemeRdYlBu[series.length])
    .unknown("#ccc");

// A function to format the value in the tooltip.
const formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

// Create the SVG container.
const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

// Append a group for each series, and a rect for each element in the series.
svg.append("g")
  .selectAll()
  .data(series)
  .join("g")
    .attr("class", "layer") 
    .attr("fill", d => color(d.key))
  .selectAll("rect")
  .data(D => D.map(d => (d.key = D.key, d)))
  .join("rect")
    .attr("x", d => x(d[0]))
    .attr("y", d => y(d.data[0]))
    .attr("height", y.bandwidth())
    .attr("width", d => x(d[1]) - x(d[0]))
  .append("title")
    .text(d => `${d.data[0]} ${d.key}\n${formatValue(d.data[1].get(d.key).waarde)}`);

//append labels (probeersel)
svg.append("g")
  .selectAll()
  .data(series)
  .join("g")
    .attr("class", "labels")
  .selectAll("text")
  .data(D => D.map(d => (d.key = D.key, d)))
  .join("text")
    .text(d => ((d[1] -d[0])*100).toFixed(1))
    .attr("class", "label")
    .attr("x", d => x(d[0])+afstandLabel)
    .attr("y", d => y(d.data[0])+25)
    .attr("fill", "black")
    .attr("dy", "0.35em")
    .attr("text-anchor", "end");


// Append the horizontal axis.
svg.append("g")
    .attr("transform", `translate(0,${marginTop})`)
    .call(d3.axisTop(x).ticks(width / 100, "%"))
    .call(g => g.selectAll(".domain").remove());

// Append the vertical axis.
svg.append("g")
    .attr("class", "y-axis") 
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove());

let isMan = true;
let groepnu = isMan ? "Man":"Vrouw";

const type = Inputs.select(["Man", "Vrouw"], {label: "Bekijk data voor: "});
type.addEventListener("selectionchange", () => {
  updateData();  
});


function updateData() {
  isMan = !isMan;
  const groepnu = type.value;
  const dataNu = gestapeldeDataGeslacht.filter(d => d.groep === groepnu);

  // 1. Bereken de nieuwe stack
  const series0 = d3.stack()
    .keys(d3.union(dataNu.map(d => d.categorie)))
    .value(([, D], key) => D.get(key).waarde) 
    .offset(d3.stackOffsetExpand)
    (d3.index(dataNu, d => d.groep, d => d.categorie)); 

  // 2. Update de Y-as (zodat het label "Man" naar "Vrouw" verspringt)
  const y0 = d3.scaleBand()
    .domain([groepnu]) // Omdat we maar 1 bar tegelijk tonen
    .range([marginTop, height - marginBottom])
    .padding(0.08);
  
  // Update de visuele as links
  svg.select(".y-axis") // Zorg dat je de as hieronder een class geeft
    .transition()
    .duration(750)
    .call(d3.axisLeft(y0).tickSizeOuter(0));

  // 3. Update de RECTS
  // We selecteren de groepen (de 'g' elementen die de kleuren vasthouden)
  svg.selectAll("g.layer") 
    .data(series0)
    .selectAll("rect")
    .data(D => D.map(d => (d.key = D.key, d))) // Koppel de sub-data
    .transition()
    .duration(750)
    .attr("x", d => x(d[0])) // x-as schaal blijft 0-1 (100%) dus kan 'x' blijven
    .attr("y", d => y0(d.data[0]))
    .attr("width", d => x(d[1]) - x(d[0]))
    .attr("height", y0.bandwidth());
    
  svg.selectAll("g.labels") 
    .data(series0)
    .selectAll("text")
    .data(D => D.map(d => (d.key = D.key, d))) // Koppel de sub-data
    .transition()
    .duration(750)
    .text(d => ((d[1] - d[0])*100).toFixed(1))
    .attr("x", d => x(d[0])+afstandLabel);  

  // Update tooltips
  svg.selectAll("rect").select("title")
    .text(d => `${d.data[0]} ${d.key}\n${formatValue(d.data[1].get(d.key).waarde)}`);
}

const legendContainer = d3.create("div")
  .style("display", "flex")
  .style("flex-wrap", "wrap")
  .style("gap", "15px")
  .style("margin-bottom", "10px");

// Gebruik de domain van je bestaande color scale
color.domain().forEach(key => {
  const item = legendContainer.append("div")
    .style("display", "flex")
    .style("align-items", "center")
    .style("font-size", "12px");

  item.append("div")
    .style("width", "12px")
    .style("height", "12px")
    .style("background-color", color(key))
    .style("margin-right", "5px")
    .style("border-radius", "2px");

  item.append("span").text(key);
});

// Display de legenda in je button-area of boven de chart
//display(legendContainer.node());

// 8. Koppel de knop
const btn2 = Inputs.button("Wissel data");

btn2.addEventListener("click", () => {
  updateData();  
});


``` 
<div class="card" id="chart-container">
  <div id="button-area">
    ${btn2}
    ${type}
  </div>
  <div id="chart", style="margin-top: 10px;">
    ${legendContainer.node()}
    ${svg.node()}

  </div>
</div>

```js

const gestapeldeDataNiveau = [
    { groep: "Laaggeschoold", categorie: labels1.get(0), waarde: Number(schoneDataDetail[15].niveau4) },
    { groep: "Laaggeschoold", categorie: labels1.get(1), waarde: Number(schoneDataDetail[16].niveau4) },
    { groep: "Laaggeschoold", categorie: labels1.get(2), waarde: Number(schoneDataDetail[17].niveau4) },
    { groep: "Middengeschoold", categorie: labels1.get(0), waarde: Number(schoneDataDetail[15].niveau7) },
    { groep: "Middengeschoold", categorie: labels1.get(1), waarde: Number(schoneDataDetail[16].niveau7) },
    { groep: "Middengeschoold", categorie: labels1.get(2), waarde: Number(schoneDataDetail[17].niveau7) },
    { groep: "Hooggeschoold", categorie: labels1.get(0), waarde: Number(schoneDataDetail[15].niveau10) },
    { groep: "Hooggeschoold", categorie: labels1.get(1), waarde: Number(schoneDataDetail[16].niveau10) },
    { groep: "Hooggeschoold", categorie: labels1.get(2), waarde: Number(schoneDataDetail[17].niveau10) }
];

const data0NO = gestapeldeDataNiveau.filter(d => d.groep === "Middengeschoold");

const seriesNO = d3.stack()
    .keys(d3.union(data0NO.map(d => d.categorie))) // distinct series keys, in input order
    .value(([, D], key) => D.get(key).waarde) // get value for each series key and stack
    .offset(d3.stackOffsetExpand)
  (d3.index(data0NO, d => d.groep, d => d.categorie)); // group by stack then series key

// Compute the height from the number of stacks.
//const height = series[0].length * 25 + marginTop + marginBottom;

// Prepare the scales for positional and color encodings.
let x = d3.scaleLinear()
    .domain([0, d3.max(seriesNO, d => d3.max(d, d => d[1]))])
    .range([marginLeft, width - marginRight]);

let y = d3.scaleBand()
    .domain(d3.groupSort(data0NO, (D) => -D.find(d => d.categorie === labels1.get(0)).waarde / d3.sum(D, d => d.waarde), d => d.groep))
    .range([marginTop, height - marginBottom])
    .padding(0.08);

// Create the SVG container.
const svg2 = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

// Append a group for each series, and a rect for each element in the series.
svg2.append("g")
  .selectAll()
  .data(seriesNO)
  .join("g")
    .attr("class", "layer") 
    .attr("fill", d => color(d.key))
  .selectAll("rect")
  .data(D => D.map(d => (d.key = D.key, d)))
  .join("rect")
    .attr("x", d => x(d[0]))
    .attr("y", d => y(d.data[0]))
    .attr("height", y.bandwidth())
    .attr("width", d => x(d[1]) - x(d[0]))
  .append("title")
    .text(d => `${d.data[0]} ${d.key}\n${formatValue(d.data[1].get(d.key).waarde)}`);

//append labels (probeersel)
svg2.append("g")
  .selectAll()
  .data(seriesNO)
  .join("g")
    .attr("class", "labels")
  .selectAll("text")
  .data(D => D.map(d => (d.key = D.key, d)))
  .join("text")
    .text(d => ((d[1] -d[0])*100).toFixed(1))
    .attr("class", "label")
    .attr("x", d => x(d[0])+afstandLabel)
    .attr("y", d => y(d.data[0])+25)
    .attr("fill", "black")
    .attr("dy", "0.35em")
    .attr("text-anchor", "end");


// Append the horizontal axis.
svg2.append("g")
    .attr("transform", `translate(0,${marginTop})`)
    .call(d3.axisTop(x).ticks(width / 100, "%"))
    .call(g => g.selectAll(".domain").remove());

// Append the vertical axis.
svg2.append("g")
    .attr("class", "y-axis") 
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).tickSizeOuter(0))
    .call(g => g.selectAll(".domain").remove());

let OnderwijsNiveau = 0;
const NOM = new Map();
{
  NOM.set(0, "Laaggeschoold");
  NOM.set(1, "Middengeschoold");
  NOM.set(2, "Hooggeschoold");
}

const type2 = Inputs.select(["Laaggeschoold", "Middengeschoold", "Hooggeschoold"], {label: "Bekijk data voor: "});
type2.addEventListener("selectionchange", () => {
  updateData2();  
});

function updateData2() {
  OnderwijsNiveau = (OnderwijsNiveau +1)%3;
  const groepnu =type2.value;
  const dataNu = gestapeldeDataNiveau.filter(d => d.groep === groepnu);

  // 1. Bereken de nieuwe stack
  const series0 = d3.stack()
    .keys(d3.union(dataNu.map(d => d.categorie)))
    .value(([, D], key) => D.get(key).waarde) 
    .offset(d3.stackOffsetExpand)
    (d3.index(dataNu, d => d.groep, d => d.categorie)); 

  // 2. Update de Y-as (zodat het label "Man" naar "Vrouw" verspringt)
  const y0 = d3.scaleBand()
    .domain([groepnu]) // Omdat we maar 1 bar tegelijk tonen
    .range([marginTop, height - marginBottom])
    .padding(0.08);
  
  // Update de visuele as links
  svg2.select(".y-axis") // Zorg dat je de as hieronder een class geeft
    .transition()
    .duration(750)
    .call(d3.axisLeft(y0).tickSizeOuter(0));

  // 3. Update de RECTS
  // We selecteren de groepen (de 'g' elementen die de kleuren vasthouden)
  svg2.selectAll("g.layer") 
    .data(series0)
    .selectAll("rect")
    .data(D => D.map(d => (d.key = D.key, d))) // Koppel de sub-data
    .transition()
    .duration(750)
    .attr("x", d => x(d[0])) // x-as schaal blijft 0-1 (100%) dus kan 'x' blijven
    .attr("y", d => y0(d.data[0]))
    .attr("width", d => x(d[1]) - x(d[0]))
    .attr("height", y0.bandwidth());
    
  svg2.selectAll("g.labels") 
    .data(series0)
    .selectAll("text")
    .data(D => D.map(d => (d.key = D.key, d))) // Koppel de sub-data
    .transition()
    .duration(750)
    .text(d => ((d[1] - d[0])*100).toFixed(1))
    .attr("x", d => x(d[0])+afstandLabel);  

  // Update tooltips
  svg2.selectAll("rect").select("title")
    .text(d => `${d.data[0]} ${d.key}\n${formatValue(d.data[1].get(d.key).waarde)}`);
}

const legendContainer2 = d3.create("div")
  .style("display", "flex")
  .style("flex-wrap", "wrap")
  .style("gap", "15px")
  .style("margin-bottom", "10px");

// Gebruik de domain van je bestaande color scale
color.domain().forEach(key => {
  const item2 = legendContainer2.append("div")
    .style("display", "flex")
    .style("align-items", "center")
    .style("font-size", "12px");

  item2.append("div")
    .style("width", "12px")
    .style("height", "12px")
    .style("background-color", color(key))
    .style("margin-right", "5px")
    .style("border-radius", "2px");

  item2.append("span").text(key);
});

// Display de legenda in je button-area of boven de chart
//display(legendContainer.node());

// 8. Koppel de knop
const btn3 = Inputs.button("Wissel data");

btn3.addEventListener("click", () => {
  updateData2();  
});

``` 
<div class="card" id="chart-container">
  <div id="button-area">
    ${btn3}
    ${type2}
  </div>
  <div id="chart", style="margin-top: 10px;">
    ${legendContainer2.node()}
    ${svg2.node()}

  </div>
</div>
