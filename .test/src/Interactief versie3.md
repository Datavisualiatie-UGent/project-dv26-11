---
theme: dashboard
title: Interactief versie3
toc: false
---

# Interactief Versie 3

```js

// --- 1. DATA VOORBEREIDING ---
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

const labels1 = ["Onderwijsniveau komt overeen met wat nodig is voor mijn job", "Onderwijsniveau is hoger dan wat nodig is voor mijn job", "Onderwijsniveau is lager dan wat nodig is voor mijn job"]; // Kortere keys voor gemak

const dataGeslacht = [
  { groep: "Man", categorie: labels1[0], waarde: Number(schoneDataDetail[5].niveau4) },
  { groep: "Man", categorie: labels1[1], waarde: Number(schoneDataDetail[6].niveau4) },
  { groep: "Man", categorie: labels1[2], waarde: Number(schoneDataDetail[7].niveau4) },
  { groep: "Vrouw", categorie: labels1[0], waarde: Number(schoneDataDetail[5].niveau7) },
  { groep: "Vrouw", categorie: labels1[1], waarde: Number(schoneDataDetail[6].niveau7) },
  { groep: "Vrouw", categorie: labels1[2], waarde: Number(schoneDataDetail[7].niveau7) }
];

const dataNiveau = [
  { groep: "Laaggeschoold", categorie: labels1[0], waarde: Number(schoneDataDetail[15].niveau4) },
  { groep: "Laaggeschoold", categorie: labels1[1], waarde: Number(schoneDataDetail[16].niveau4) },
  { groep: "Laaggeschoold", categorie: labels1[2], waarde: Number(schoneDataDetail[17].niveau4) },
  { groep: "Middengeschoold", categorie: labels1[0], waarde: Number(schoneDataDetail[15].niveau7) },
  { groep: "Middengeschoold", categorie: labels1[1], waarde: Number(schoneDataDetail[16].niveau7) },
  { groep: "Middengeschoold", categorie: labels1[2], waarde: Number(schoneDataDetail[17].niveau7) },
  { groep: "Hooggeschoold", categorie: labels1[0], waarde: Number(schoneDataDetail[15].niveau10) },
  { groep: "Hooggeschoold", categorie: labels1[1], waarde: Number(schoneDataDetail[16].niveau10) },
  { groep: "Hooggeschoold", categorie: labels1[2], waarde: Number(schoneDataDetail[17].niveau10) }
];

// --- 2. DE REBRUIKBARE CHART FUNCTIE ---
function createStackedChart(data, initialGroup) {
  const width = 928;
  const height = 100;
  const margin = {top: 30, right: 20, bottom: 0, left: 100};

  const color = d3.scaleOrdinal()
    .domain(labels1)
    .range(d3.schemeRdYlBu[3]);

  const x = d3.scaleLinear().range([margin.left, width - margin.right]);
  const y = d3.scaleBand().range([margin.top, height - margin.bottom]).padding(0.1);

  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  // Containers voor onderdelen
  const layerGroup = svg.append("g").attr("class", "layers");
  const labelGroup = svg.append("g").attr("class", "labels");
  const yAxisGroup = svg.append("g").attr("class", "y-axis").attr("transform", `translate(${margin.left},0)`);
  
  svg.append("g")
    .attr("transform", `translate(0,${margin.top})`)
    .call(d3.axisTop(x).ticks(10, "%"))
    .call(g => g.selectAll(".domain").remove());

  // De eigenlijke update logica
  function update(selectedGroup) {
    const filtered = data.filter(d => d.groep === selectedGroup);
    const series = d3.stack()
      .keys(labels1)
      .value(([, D], key) => D.get(key).waarde)
      .offset(d3.stackOffsetExpand)
      (d3.index(filtered, d => d.groep, d => d.categorie));

    y.domain([selectedGroup]);
    yAxisGroup.transition().duration(750).call(d3.axisLeft(y).tickSizeOuter(0));

    // Balken
    layerGroup.selectAll("g")
      .data(series)
      .join("g")
        .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(D => D.map(d => (d.key = D.key, d)))
      .join("rect")
        .transition().duration(750)
        .attr("x", d => x(d[0]))
        .attr("y", d => y(d.data[0]))
        .attr("width", d => x(d[1]) - x(d[0]))
        .attr("height", y.bandwidth());

    // Slimme Labels
    labelGroup.selectAll("text")
      .data(series.flatMap(D => D.map(d => ({...d, key: D.key}))))
      .join("text")
        .transition().duration(750)
        // Plaats in het midden van het segment
        .attr("x", d => x(d[0]) + (x(d[1]) - x(d[0])) / 2)
        .attr("y", d => y(d.data[0]) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("fill", d => (d[1] - d[0] > 0.4) ? "white" : "black") // Dynamische kleur voor leesbaarheid
        .text(d => {
          const pct = (d[1] - d[0]);
          return pct > 0.05 ? (pct * 100).toFixed(1) + "%" : (pct * 100).toFixed(0) + "%"; // Verberg als < 5%
        });
  }

  update(initialGroup);
  return { node: svg.node(), update, color };
}

// --- 3. INITIALISATIE ---
const chart1 = createStackedChart(dataGeslacht, "Man");
const chart2 = createStackedChart(dataNiveau, "Middengeschoold");

// Inputs koppelen met 'input' event
const select1 = Inputs.select(["Man", "Vrouw"], {label: "Geslacht:"});
select1.addEventListener("input", () => chart1.update(select1.value));

const select2 = Inputs.select(["Laaggeschoold", "Middengeschoold", "Hooggeschoold"], {label: "Niveau:"});
select2.addEventListener("input", () => chart2.update(select2.value));
```

<div class="card" id="chart-container">
  <div id="button-area">
    ${select1}
  </div>
  <div id="chart", style="margin-top: 10px;">
    ${chart1.node}

  </div>
</div>
<div class="card" id="chart-container">
  <div id="button-area">
    ${select2}
  </div>
  <div id="chart", style="margin-top: 10px;">
    ${chart2.node}

  </div>
</div>
