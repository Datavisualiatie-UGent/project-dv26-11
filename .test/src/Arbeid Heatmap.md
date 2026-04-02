---
theme: dashboard
title: Arbeid Heatmap
toc: false
---

# Arbeid Heatmap

Hieronder zie je de heatmap op basis van de array data.


```js
const niveaus = new Map();
{
  niveaus.set(0, "volledige of het grootste deel");
  niveaus.set(1, "De helft of meer");
  niveaus.set(2, "minder dan de helft");
  niveaus.set(3, "Weinig");
  niveaus.set(4, "Geen");
}

const workbook = await FileAttachment("data/Ad hoc module 2022 tabellen.xlsx").xlsx();
const data = workbook.sheet(4, {headers: true});

const gestapeldeData = [
    { groep: "Totaal", categorie: niveaus.get(0), waarde: Number(data[115].C) },
    { groep: "Totaal", categorie: niveaus.get(1), waarde: Number(data[116].C) },
    { groep: "Totaal", categorie: niveaus.get(2), waarde: Number(data[117].C) },
    { groep: "Totaal", categorie: niveaus.get(3), waarde: Number(data[118].C) },
    { groep: "Totaal", categorie: niveaus.get(4), waarde: Number(data[119].C) }
];

function makedata(beginrij){
    const array = [[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0],[0,0,0,0,0]];
    {
      for (let i = 0; i < 5; i++) {
        array[i][0] = data[beginrij+i].E
      }
      for (let i = 0; i < 5; i++) {
        array[i][1] = data[beginrij+i].G
      }
      for (let i = 0; i < 5; i++) {
        array[i][2] = data[beginrij+i].I
      }
      for (let i = 0; i < 5; i++) {
        array[i][3] = data[beginrij+i].K
      }
      for (let i = 0; i < 5; i++) {
        array[i][4] = data[beginrij+i].M
      }
    }
    // 2. Data vlakmaken voor Plot
    const dataplat = array.flatMap((row, i) => 
      row.map((value, j) => ({ 
        rij: niveaus.get(i), 
        kolom: niveaus.get(j), 
        waarde: value 
      }))
    );
  return dataplat;
}

function makeplot(dataplot, title){
  return Plot.plot({
      marginLeft: 180, // Ruime marge voor je lange labels
      marginBottom: 110,
      height: 400,
      width: 750,
      padding: 0.05,
      x: {
        domain: Array.from(niveaus.values()), // Gebruikt de volgorde van je Map (0 t/m 4)
        tickRotate: -45,
        label: title
      },
      y: {
        domain: Array.from(niveaus.values()), // Zelfde volgorde voor de rijen
        label: "Calculate"
      },
      color: {
        type: "log", 
        scheme: "Magma",
        //legend: true,
        label: "Waarde"
      },
      marks: [
        Plot.cell(dataplot, {
          x: "kolom",
          y: "rij",
          fill: "waarde",
          inset: 0.5
        }),
        Plot.text(dataplot, {
          x: "kolom",
          y: "rij",
          text: d => ((d.waarde)*100).toFixed(1) + '%' ,
          fill: d => d.waarde > 0.3 ? "black" : "white"
        })
      ]
    })

}

const chart1 = makeplot(makedata(115), "Digital");
const chart2 = makeplot(makedata(127), "Reading");
const chart3 = makeplot(makedata(139), "Physical");
const chart4 = makeplot(makedata(151), "Dexterity");
const chart5 = makeplot(makedata(163), "CommInt");
const chart6 = makeplot(makedata(175), "CommExt");
const chart7 = makeplot(makedata(187), "Guidance");
const chart8 = makeplot(makedata(211), "Repetitive");
const chart9 = makeplot(makedata(223), "Procedure");
```
<div class="card">
  <h1> Calculate = 
  <h4 class="explanation" style="max-width=1000px"> Tijd besteed aan relatief complexe berekeningen (eventueel met rekenmachine of computerprogramma)</h4>
  ${Plot.plot({
        marginLeft: 60,
        width:1000,
        x: { axis: "top", percent: true },
        color: { scheme: "Magma", legend:true },
        //y: {axis: null},
        marks: [
          Plot.barX(gestapeldeData, {
            offset: "normalize",
            y: "groep",
            x: "waarde",
            fill: "categorie",
            sort: { color: null, y: { value: "-x", reduce: "first" } }
          }),
          Plot.text(gestapeldeData, {
            y: "groep",
            x: d => (d.waarde -0.01),
            text: d => d.waarde > 0.05 ? ((d.waarde)*100).toFixed(1) + "%" : ((d.waarde)*100).toFixed(0) + "%" ,
            fill: d => d.waarde > 0.3 ? "black" : "white"
          }
          )
        ]
      })
    }

</div>


<div class="grid grid-cols-1">
  <div class="card">
  <h1> Calculate-Digital 
  <h4 class="explanation" style="max-width=1000px"> Tijd besteed aan werk met een computer, een tablet of een smartphone, telefoongesprekken niet inbegrepen</h4>
    ${chart1}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    <h1> Calculate-Reading 
  <h4 class="explanation" style="max-width=1000px">Tijd besteed aan het lezen van werkgerelateerde handleidingen of technische documenten, exclusief brieven of e-mails</h4>
    ${chart2}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    <h1> Calculate-Physical 
    <h4 class="explanation" style="max-width=1000px">Tijd besteed aan zwaar lichamelijk werk</h4>
    ${chart3}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    <h1> Calculate-Dexterity 
    <h4 class="explanation" style="max-width=1000px">Tijd besteed aan taken waarbij precieze handelingen moeten uitgevoerd worden met de vingers zoals bij chirurgie of tekenen</h4>
    ${chart4}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    <h1> Calculate-CommInt
    <h4 class="explanation" style="max-width=1000px">Tijd besteed aan het mondeling communiceren met mensen binnen het bedrijf of de organisatie</h4>
    ${chart5}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    <h1> Calculate-CommExt
    <h4 class="explanation" style="max-width=1000px">Tijd besteed aan het mondeling communiceren met mensen van buiten het bedrijf of de organisatie</h4>
    ${chart6}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    <h1> Calculate-Guidance
    <h4 class="explanation" style="max-width=1000px">Tijd besteed aan adviseren, opleiden en onderwijzen van andere mensen zoals klanten, studenten of collega's</h4>
    ${chart7}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    <h1> Calculate-Repetitive
    <h4 class="explanation" style="max-width=1000px">Mate waarin de job repetitieve taken omvat </h4>
    ${chart8}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    <h1> Calculate-Procedure
    <h4 class="explanation" style="max-width=1000px">Mate waarin de taken nauwkeurig omschreven zijn door strikte procedures zoals kookrecepten, medische protocollen of bouwplannen</h4>
    ${chart9}
  </div>
</div>