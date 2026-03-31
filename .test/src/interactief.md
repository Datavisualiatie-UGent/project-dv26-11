---
theme: dashboard
title: Interactief
toc: false
---

# Interactief; 

Hieronder zie je de heatmap op basis van de array data.


```js


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

const data1 = [0,0,0];
data1[0] = schoneData[3].niveau4;
data1[1] = schoneData[4].niveau4;
data1[2] = schoneData[5].niveau4;

const labels1 = new Map();
{
  labels1.set(0, "Onderwijsniveau komt overeen met wat nodig is voor mijn job");
  labels1.set(1, "Onderwijsniveau is hoger dan wat nodig is voor mijn job");
  labels1.set(2, "Onderwijsniveau is lager dan wat nodig is voor mijn job");
}

const data1_0 = data1.map((row, i) => ({ 
    rij: labels1.get(i), 
    waarde: data1[i] 
  })
);


const gestapeldeData = [
  { groep: "Totaal", categorie: labels1.get(0), waarde: Number(schoneData[3].niveau4) },
  { groep: "Totaal", categorie: labels1.get(1), waarde: Number(schoneData[4].niveau4) },
  { groep: "Totaal", categorie: labels1.get(2), waarde: Number(schoneData[5].niveau4) }
];

```

<div class="grid grid-cols-1">
  <div class="card">
  <h1> Overeenkomst Job-Onderwijs 
    ${Plot.plot({
        marginLeft: 300,
        x:{
            grid: true,
            label: "Waarde"
        },
        y: {
            grid: true,
            label: "Groep"
        },
        marks: [
            Plot.barX(data1_0, {x: "waarde", y: "rij",fill:"blue"}),
            Plot.ruleX([0])
        ]
    })}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
  <h1> Overeenkomst Job-Onderwijs 
    ${Plot.plot({
        marginLeft:50,
        width:750,
        x: {
            label: "waarde"
        },
        color: {
            //scheme: "Magma",
            legend: true,
            label: "Waarde",
            marginLeft:20,
            width:1000
      },
        marks: [
            Plot.ruleX([0, 1]),
            Plot.barX(gestapeldeData, Plot.stackX({ x: "waarde", fill: "categorie", insetLeft: 1})),
            //Plot.textX(alphabet, Plot.stackX({order: "letter", x: "frequency", text: "letter", insetLeft: 1}))
        ]
    })}
  </div>
</div>






