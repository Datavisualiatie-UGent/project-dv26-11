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
const data = workbook.sheet(3, {headers: true});
const schoneData = data.map(d => ({
  id: d["#"],
  niveau1: d["Link diploma - job"],
  niveau2: d["Link diploma - job_"],
  niveau3: d["Link diploma - job__"],
  niveau4: d["Link diploma - job___"],
  niveau5: d["Link diploma - job____"],
  niveau6: d["Link diploma - job_____"],
  niveau7: d["Link diploma - job______"],
  niveau8: d["Link diploma - job_______"],
  niveau9: d["Link diploma - job________"],
  niveau10: d["Link diploma - job_________"],
  niveau11: d["Link diploma - job__________"]
}));

const dataTotaal = [
  { groep: "Totaal", categorie: labels1[0], waarde: Number(schoneData[3].niveau4) },
  { groep: "Totaal", categorie: labels1[1], waarde: Number(schoneData[4].niveau4) },
  { groep: "Totaal", categorie: labels1[2], waarde: Number(schoneData[5].niveau4) }
];

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

const dataGewest = [
  { groep: "Brussel", categorie: labels1[0], waarde: Number(schoneDataDetail[25].niveau4) },
  { groep: "Brussel", categorie: labels1[1], waarde: Number(schoneDataDetail[26].niveau4) },
  { groep: "Brussel", categorie: labels1[2], waarde: Number(schoneDataDetail[27].niveau4) },
  { groep: "Vlaams", categorie: labels1[0], waarde: Number(schoneDataDetail[25].niveau7) },
  { groep: "Vlaams", categorie: labels1[1], waarde: Number(schoneDataDetail[26].niveau7) },
  { groep: "Vlaams", categorie: labels1[2], waarde: Number(schoneDataDetail[27].niveau7) },
  { groep: "Waals", categorie: labels1[0], waarde: Number(schoneDataDetail[25].niveau10) },
  { groep: "Waals", categorie: labels1[1], waarde: Number(schoneDataDetail[26].niveau10) },
  { groep: "Waals", categorie: labels1[2], waarde: Number(schoneDataDetail[27].niveau10) }
];

const dataNat = [
  { groep: "Belgie", categorie: labels1[0], waarde: Number(schoneDataDetail[35].niveau4) },
  { groep: "Belgie", categorie: labels1[1], waarde: Number(schoneDataDetail[36].niveau4) },
  { groep: "Belgie", categorie: labels1[2], waarde: Number(schoneDataDetail[37].niveau4) },
  { groep: "EU27", categorie: labels1[0], waarde: Number(schoneDataDetail[35].niveau7) },
  { groep: "EU27", categorie: labels1[1], waarde: Number(schoneDataDetail[36].niveau7) },
  { groep: "EU27", categorie: labels1[2], waarde: Number(schoneDataDetail[37].niveau7) },
  { groep: "niet-EU27", categorie: labels1[0], waarde: Number(schoneDataDetail[35].niveau10) },
  { groep: "niet-EU27", categorie: labels1[1], waarde: Number(schoneDataDetail[36].niveau10) },
  { groep: "niet-EU27", categorie: labels1[2], waarde: Number(schoneDataDetail[37].niveau10) }
];

const dataAMS = [
  { groep: "IAB-werkloze", categorie: labels1[0], waarde: Number(schoneDataDetail[45].niveau4) },
  { groep: "IAB-werkloze", categorie: labels1[1], waarde: Number(schoneDataDetail[46].niveau4) },
  { groep: "IAB-werkloze", categorie: labels1[2], waarde: Number(schoneDataDetail[47].niveau4) },
  { groep: "Werkende IAB-actieve", categorie: labels1[0], waarde: Number(schoneDataDetail[45].niveau7) },
  { groep: "Werkende IAB-actieve", categorie: labels1[1], waarde: Number(schoneDataDetail[46].niveau7) },
  { groep: "Werkende IAB-actieve", categorie: labels1[2], waarde: Number(schoneDataDetail[47].niveau7) },
  { groep: "IAB-niet-beroepsactieve", categorie: labels1[0], waarde: Number(schoneDataDetail[45].niveau10) },
  { groep: "IAB-niet-beroepsactieve", categorie: labels1[1], waarde: Number(schoneDataDetail[46].niveau10) },
  { groep: "IAB-niet-beroepsactieve", categorie: labels1[2], waarde: Number(schoneDataDetail[47].niveau10) }
];

const dataVastTijdelijk = [
  { groep: "Vast", categorie: labels1[0], waarde: Number(schoneDataDetail[55].niveau4) },
  { groep: "Vast", categorie: labels1[1], waarde: Number(schoneDataDetail[56].niveau4) },
  { groep: "Vast", categorie: labels1[2], waarde: Number(schoneDataDetail[57].niveau4) },
  { groep: "Tijdelijk", categorie: labels1[0], waarde: Number(schoneDataDetail[55].niveau7) },
  { groep: "Tijdelijk", categorie: labels1[1], waarde: Number(schoneDataDetail[56].niveau7) },
  { groep: "Tijdelijk", categorie: labels1[2], waarde: Number(schoneDataDetail[57].niveau7) }
];

const dataAantalJarenWerk = [
  { groep: "0 tot 1 jaar", categorie: labels1[0], waarde: Number(schoneDataDetail[65].niveau4) },
  { groep: "0 tot 1 jaar", categorie: labels1[1], waarde: Number(schoneDataDetail[66].niveau4) },
  { groep: "0 tot 1 jaar", categorie: labels1[2], waarde: Number(schoneDataDetail[67].niveau4) },
  { groep: "Meer dan 1 tot 2 jaar", categorie: labels1[0], waarde: Number(schoneDataDetail[65].niveau7) },
  { groep: "Meer dan 1 tot 2 jaar", categorie: labels1[1], waarde: Number(schoneDataDetail[66].niveau7) },
  { groep: "Meer dan 1 tot 2 jaar", categorie: labels1[2], waarde: Number(schoneDataDetail[67].niveau7) },
  { groep: "Meer dan 2 tot 5 jaar", categorie: labels1[0], waarde: Number(schoneDataDetail[65].niveau10) },
  { groep: "Meer dan 2 tot 5 jaar", categorie: labels1[1], waarde: Number(schoneDataDetail[66].niveau10) },
  { groep: "Meer dan 2 tot 5 jaar", categorie: labels1[2], waarde: Number(schoneDataDetail[67].niveau10) },
  { groep: "Meer dan 5 jaar", categorie: labels1[0], waarde: Number(schoneDataDetail[65].niveau13) },
  { groep: "Meer dan 5 jaar", categorie: labels1[1], waarde: Number(schoneDataDetail[66].niveau13) },
  { groep: "Meer dan 5 jaar", categorie: labels1[2], waarde: Number(schoneDataDetail[67].niveau13) }
];

const databeroepsgroep = [
  { groep: "Groep1", categorie: labels1[0], waarde: Number(schoneDataDetail[75].niveau4) },
  { groep: "Groep1", categorie: labels1[1], waarde: Number(schoneDataDetail[76].niveau4) },
  { groep: "Groep1", categorie: labels1[2], waarde: Number(schoneDataDetail[77].niveau4) },
  { groep: "Groep2", categorie: labels1[0], waarde: Number(schoneDataDetail[75].niveau7) },
  { groep: "Groep2", categorie: labels1[1], waarde: Number(schoneDataDetail[76].niveau7) },
  { groep: "Groep2", categorie: labels1[2], waarde: Number(schoneDataDetail[77].niveau7) },
  { groep: "Groep3", categorie: labels1[0], waarde: Number(schoneDataDetail[75].niveau10) },
  { groep: "Groep3", categorie: labels1[1], waarde: Number(schoneDataDetail[76].niveau10) },
  { groep: "Groep3", categorie: labels1[2], waarde: Number(schoneDataDetail[77].niveau10) },
  { groep: "Groep4", categorie: labels1[0], waarde: Number(schoneDataDetail[75].niveau13) },
  { groep: "Groep4", categorie: labels1[1], waarde: Number(schoneDataDetail[76].niveau13) },
  { groep: "Groep4", categorie: labels1[2], waarde: Number(schoneDataDetail[77].niveau13) }
];

// --- 2. DE REBRUIKBARE CHART FUNCTIE ---
function createStackedChart(data, initialGroup) {
  const width = 928;
  const height = 100;
  const margin = {top: 30, right: 20, bottom: 0, left: 90};

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
        .attr("fill", d => (d[1] - d[0] > 0.45) ? "white" : "black") // Dynamische kleur voor leesbaarheid
        .text(d => {
          const pct = (d[1] - d[0]);
          return pct > 0.05 ? (pct * 100).toFixed(1) + "%" : (pct * 100).toFixed(0) + "%"; // Verberg als < 5%
        });
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
    }) ;

  update(initialGroup);
  return { node: svg.node(), update, color, legend:legendContainer };
}

// --- 3. INITIALISATIE ---

const chart0 = createStackedChart(dataTotaal, "Totaal");
const chart1 = createStackedChart(dataGeslacht, "Man");
const chart2 = createStackedChart(dataNiveau, "Middengeschoold");
const chart3 = createStackedChart(dataGewest, "Vlaams");
const chart4 = createStackedChart(dataNat, "Belgie");
const chart5 = createStackedChart(dataAMS, "Werkende IAB-actieve");
const chart6 = createStackedChart(dataVastTijdelijk, "Vast");
const chart7 = createStackedChart(dataAantalJarenWerk, "0 tot 1 jaar");
const chart8 = createStackedChart(databeroepsgroep, "Groep1")

// Inputs koppelen met 'input' event
const select1 = Inputs.select(["Man", "Vrouw"], {label: "Geslacht:"});
select1.addEventListener("input", () => chart1.update(select1.value));

const select2 = Inputs.select(["Laaggeschoold", "Middengeschoold", "Hooggeschoold"], {label: "Niveau:"});
select2.addEventListener("input", () => chart2.update(select2.value));

const select3 = Inputs.select(["Vlaams", "Waals", "Brussel"], {label: "Gewest:"});
select3.addEventListener("input", () => chart3.update(select3.value));

const select4 = Inputs.select(["Belgie", "EU27", "niet-EU27"], {label: "Herkomst nationaliteit:"});
select4.addEventListener("input", () => chart4.update(select4.value));

const select5 = Inputs.select(["IAB-werkloze", "Werkende IAB-actieve", "IAB-niet-beroepsactieve"], {label: "Arbeidsmarktstatuut :"});
select5.addEventListener("input", () => chart5.update(select5.value));

const select6 = Inputs.select(["Vast", "Tijdelijk"], {label: "Vast/Tijdelijk contract:"});
select6.addEventListener("input", () => chart6.update(select6.value));

const select7 = Inputs.select(["0 tot 1 jaar", "Meer dan 1 tot 2 jaar", "Meer dan 2 tot 5 jaar", "Meer dan 5 jaar"], {label: "Aantal jaar aan het werk:"});
select7.addEventListener("input", () => chart7.update(select7.value));

const select8 = Inputs.select(["Groep1", "Groep2", "Groep3", "Groep4"], {label: "Beroepsgroep:"});
select8.addEventListener("input", () => chart8.update(select8.value));
```

<div class="grid grid-cols-4">
  <div class="card">
    <h2>Totaal</h2>
    <span class="big">${schoneDataDetail[5].niveau3 + schoneDataDetail[5].niveau6}</span>
  </div>
  <div class="card">
    <h2>Totaal aantal respondenten</h2>
    <span class="big">${schoneDataDetail[5].niveau5 + schoneDataDetail[5].niveau8}</span>
  </div>
</div>

<div class="card">
    <h2>Totaal</h2>
  ${chart0.legend}
  ${chart0.node}

</div>



<div class="card">
  <div id="button-area">
    ${select1}
  </div>
  <div id="chart", style="margin-top: 10px;">
    <!--${chart1.legend}--!>
    ${chart1.node}

  </div>
</div>
<div class="card">
  <div id="button-area">
    ${select2}
  </div>
  <div id="chart", style="margin-top: 10px;">
    ${chart2.node}

  </div>
</div>
<div class="card">
  <div id="button-area">
    ${select3}
  </div>
  <div id="chart", style="margin-top: 10px;">
    ${chart3.node}

  </div>
</div>
</div>

<div class="card">
  <div id="button-area">
    ${select4}
  </div>
  <div id="chart", style="margin-top: 10px;">
    ${chart4.node}

  </div>
</div>

<div class="card">
  <div id="button-area">
    ${select5}
  </div>
  <div id="chart", style="margin-top: 10px;">
    ${chart5.node}

  </div>
</div>

<div class="card">
  <div id="button-area">
    ${select6}
  </div>
  <div id="chart", style="margin-top: 10px;">
    ${chart6.node}

  </div>
</div>

<div class="card">
  <div id="button-area">
    ${select7}
  </div>
  <div id="chart", style="margin-top: 10px;">
    ${chart7.node}

  </div>
</div>

<div class="card">
  <div id="button-area">
    ${select8}

  </div>
  <div id="chart", style="margin-top: 10px;">
    <p> Groep 1: Managers; Intellectuele,wetenschappelijke en artistieke beroepen; Technici en verwante beroepen, </p>
    <p>Groep 2: Administratief personeel; Dienstverlenend personeel en verkopers, </p>
    <p>Groep 3: Geschoolde landbouwers, bosbouwers en vissers; Ambachtslieden; Bedieners van machines en installaties, assembleurs,</p>
    <p>Groep 4: Elementaire beroepen.</p>
    ${chart8.node}

  </div>
</div>