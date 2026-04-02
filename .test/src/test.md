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

```

<div class="grid grid-cols-1">
  <div class="card">
  <h1> Calculate-Digital 
    ${chart1}
  </div>
</div>
