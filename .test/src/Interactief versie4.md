---
theme: dashboard
title: Interactief versie4
toc: false
---

# Interactief Versie 4

<!-- Load and transform the data -->

```js
const launches = FileAttachment("data/launches.csv").csv({typed: true});
const workbook = await FileAttachment("data/AHM 2024 YNG_NL.xlsx").xlsx();
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

const data1 = [0,0,0];
data1[0] = schoneData[3].niveau4;
data1[1] = schoneData[4].niveau4;
data1[2] = schoneData[5].niveau4;

const dataM = [0,0,0];
dataM[0] = schoneDataDetail[5].niveau4;
dataM[1] = schoneDataDetail[6].niveau4;
dataM[2] = schoneDataDetail[7].niveau4;
const dataV = [0,0,0];
dataV[0] = schoneDataDetail[5].niveau7;
dataV[1] = schoneDataDetail[6].niveau7;
dataV[2] = schoneDataDetail[7].niveau7;

```


<!-- Cards with big numbers -->

<div class="grid grid-cols-4">
  <div class="card">
    <h2>Totaal</h2>
    <span class="big">${schoneDataDetail[5].niveau3 + schoneDataDetail[5].niveau6}</span>
  </div>
</div>

<!-- Plot of launch history -->

```js
const gestapeldeData = [
  { groep: "Totaal", categorie: labels1.get(0), waarde: Number(data1[0]) },
  { groep: "Totaal", categorie: labels1.get(1), waarde: Number(data1[1]) },
  { groep: "Totaal", categorie: labels1.get(2), waarde: Number(data1[2]) }
];

function launchTimeline() {
  return Plot.plot({
        marginLeft: 10,
        height: 60,
        x: { domain: [0, 100], axis: null }, // Geen as voor een compactere look
        color: { legend: true, domain: Array.from(labels1.values())},
        marks: [
          Plot.barX(gestapeldeData, Plot.stackX({ x: "waarde", fill: "categorie", inset: 0.5 })),
          Plot.textX(gestapeldeData, Plot.stackX({ x: "waarde", text: d => `${d.waarde}%`, fill: "white", fontSize: 12, fontWeight: "bold" }))
        ]
      });
}
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => launchTimeline())}

  </div>
</div>

<!-- interactieknoppen -->

```js

const gestapeldeDataGeslacht = [
    { groep: "Man", categorie: labels1.get(0), waarde: Number(dataM[0]) },
    { groep: "Man", categorie: labels1.get(1), waarde: Number(dataM[1]) },
    { groep: "Man", categorie: labels1.get(2), waarde: Number(dataM[2]) },
    { groep: "Vrouw", categorie: labels1.get(0), waarde: Number(dataV[0]) },
    { groep: "Vrouw", categorie: labels1.get(1), waarde: Number(dataV[1]) },
    { groep: "Vrouw", categorie: labels1.get(2), waarde: Number(dataV[2]) }
];

const type = view(Inputs.select(["Man", "Vrouw"], {label: "Kies type mismatch"}));

function geslachtPlot(width){
  return Plot.plot({
        key: "geslacht-plot",
        width: width,
        marginLeft: 30,
        height: 60,
        x: { domain: [0, 100], label: "Percentage (%)" },
        color: { 
          //scheme: clicks % 2 === 0 ? "pubugn" : "purd",
          domain: Array.from(labels1.values()),
          legend: true
        },
        y:{axis:null},
        marks: [
          Plot.barX(gestapeldeDataGeslacht, Plot.stackX({ 
            x: "waarde", 
            y: "groep",
            fill: "categorie", 
            inset: 0.5,
            filter: d => d.groep === type,
            transition: { duration: 1000, easing: "cubic-in-out" }
          })),
          Plot.textX(gestapeldeDataGeslacht, Plot.stackX({
            x: "waarde", 
            fill: "white", 
            fontSize: 12, 
            fontWeight: "bold",
            text: d => `${d.waarde}%`,
            filter: d => d.groep === type,
            transition: { duration: 1000 }
          }))
        ]
      })
}


```

<div class="grid grid-cols-1">
  <div class="card">
    ${Plot.plot({
      key: "geslacht-plot",
      width: width,
      marginLeft: 30,
      height: 60,
      x: { domain: [0, 100], label: "Percentage (%)" },
      color: { 
        domain: Array.from(labels1.values()),
        legend: true
      },
      y:{axis:null},
      marks: [
        Plot.barX(gestapeldeDataGeslacht, Plot.stackX({ 
          x: "waarde", 
          fill: "categorie", 
          inset: 0.5,
          filter: d => d.groep === type,
          transition: { duration: 1000, easing: "cubic-in-out" }
        })),
        Plot.textX(gestapeldeDataGeslacht, Plot.stackX({
          x: "waarde", 
          text: d => `${d.waarde}%`,
          filter: d => d.groep === type,
          transition: { duration: 1000 },
          fill: "white", 
          fontSize: 12, 
          fontWeight: "bold" 
        }))
      ]
    })}

  </div>
</div>