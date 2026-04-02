---
theme: dashboard
title: test
toc: false
---

# Arbeid Heatmap test

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

const dataDR = makedata(115);

function makeplot(dataplot){
  return Plot.plot({
      marginLeft: 180, // Ruime marge voor je lange labels
      marginBottom: 110,
      height: 400,
      padding: 0.05,
      x: {
        domain: Array.from(niveaus.values()), // Gebruikt de volgorde van je Map (0 t/m 4)
        tickRotate: -45,
        label: "Digital"
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

const chart1 = makeplot(dataDR);

const gestapeldeData = [
    { groep: "Totaal", categorie: niveaus.get(0), waarde: Number(data[115].C) },
    { groep: "Totaal", categorie: niveaus.get(1), waarde: Number(data[116].C) },
    { groep: "Totaal", categorie: niveaus.get(2), waarde: Number(data[117].C) },
    { groep: "Totaal", categorie: niveaus.get(3), waarde: Number(data[118].C) },
    { groep: "Totaal", categorie: niveaus.get(4), waarde: Number(data[119].C) }
];

```
<div class="grid grid-cols-1">
  <div class="card" style="max-width=1000px">
  <h1 style="max-width=1000px"> Calculate 
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
            offset: "normalize",
            y: "groep",
            x: d => (d.waarde),
            text: d => d.waarde > 0.05 ? ((d.waarde)*100).toFixed(1) + "%" : ((d.waarde)*100).toFixed(0) + "%" ,
            fill: d => d.waarde > 0.3 ? "black" : "white"
          }
          )
        ]
      })
    }
  </div>
</div>


<div class="grid grid-cols-1">
  <div class="card">
  <h1> Calculate-Digital 
    ${chart1}
  </div>
</div>
