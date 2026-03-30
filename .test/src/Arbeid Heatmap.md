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
const heatmapDataCalculateDigital = [[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0],[0,0,0,0,0]];
{
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculateDigital[i][0] = data[115+i].E
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculateDigital[i][1] = data[115+i].G
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculateDigital[i][2] = data[115+i].I
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculateDigital[i][3] = data[115+i].K
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculateDigital[i][4] = data[115+i].M
  }
}

const heatmapDataCalculateReading = [[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0],[0,0,0,0,0]];
{
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculateReading[i][0] = data[127+i].E
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculateReading[i][1] = data[127+i].G
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculateReading[i][2] = data[127+i].I
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculateReading[i][3] = data[127+i].K
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculateReading[i][4] = data[127+i].M
  }
}

const heatmapDataCalculatePhysical = [[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0],[0,0,0,0,0]];
{
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculatePhysical[i][0] = data[139+i].E
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculatePhysical[i][1] = data[139+i].G
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculatePhysical[i][2] = data[139+i].I
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculatePhysical[i][3] = data[139+i].K
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculatePhysical[i][4] = data[139+i].M
  }
}

const heatmapDataCalculateDexterity = [[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0],[0,0,0,0,0]];
{
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculateDexterity[i][0] = data[151+i].E
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculateDexterity[i][1] = data[151+i].G
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculateDexterity[i][2] = data[151+i].I
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculateDexterity[i][3] = data[151+i].K
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataCalculateDexterity[i][4] = data[151+i].M
  }
}

// 2. Data vlakmaken voor Plot
const dataDR = heatmapDataCalculateDigital.flatMap((row, i) => 
  row.map((value, j) => ({ 
    rij: niveaus.get(i), 
    kolom: niveaus.get(j), 
    waarde: value 
  }))
);

const dataCR = heatmapDataCalculateReading.flatMap((row, i) => 
  row.map((value, j) => ({ 
    rij: niveaus.get(i), 
    kolom: niveaus.get(j), 
    waarde: value
  }))
);

const dataCP = heatmapDataCalculatePhysical.flatMap((row, i) => 
  row.map((value, j) => ({ 
    rij: niveaus.get(i), 
    kolom: niveaus.get(j), 
    waarde: value 
  }))
);

const dataCDEX = heatmapDataCalculateDexterity.flatMap((row, i) => 
  row.map((value, j) => ({ 
    rij: niveaus.get(i), 
    kolom: niveaus.get(j), 
    waarde: value 
  }))
);
```

<div class="grid grid-cols-1">
  <div class="card">
  <h1> Calculate-Digital 
    ${Plot.plot({
      marginLeft: 180, // Ruime marge voor je lange labels
      marginBottom: 100,
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
        Plot.cell(dataDR, {
          x: "kolom",
          y: "rij",
          fill: "waarde",
          inset: 0.5
        }),
        Plot.text(dataDR, {
          x: "kolom",
          y: "rij",
          text: d => ((d.waarde)*100).toFixed(1) + '%' ,
          fill: d => d.waarde > 0.3 ? "black" : "white"
        })
      ]
    })}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    <h1> Calculate-Reading 
    ${Plot.plot({
      marginLeft: 180, // Ruime marge voor je lange labels
      marginBottom: 100,
      height: 400,
      padding: 0.05,
      x: {
        domain: Array.from(niveaus.values()), // Gebruikt de volgorde van je Map (0 t/m 4)
        tickRotate: -45,
        label: "Reading"
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
        Plot.cell(dataCR, {
          x: "kolom",
          y: "rij",
          fill: "waarde",
          inset: 0.5
        }),
        Plot.text(dataCR, {
          x: "kolom",
          y: "rij",
          text: d => ((d.waarde)*100).toFixed(1) + '%' ,
          fill: d => d.waarde > 0.3 ? "black" : "white"
        })
      ]
    })}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    <h1> Calculate-Physical 
    ${Plot.plot({
      marginLeft: 180, // Ruime marge voor je lange labels
      marginBottom: 100,
      height: 400,
      padding: 0.05,
      x: {
        domain: Array.from(niveaus.values()), // Gebruikt de volgorde van je Map (0 t/m 4)
        tickRotate: -45,
        label: "Physical"
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
        Plot.cell(dataCP, {
          x: "kolom",
          y: "rij",
          fill: "waarde",
          inset: 0.5
        }),
        Plot.text(dataCP, {
          x: "kolom",
          y: "rij",
          text: d => ((d.waarde)*100).toFixed(1) + '%' ,
          fill: d => d.waarde > 0.3 ? "black" : "white"
        })
      ]
    })}
  </div>
</div>

<div class="grid grid-cols-1">
  <div class="card">
    <h1> Calculate-Dexterity 
    ${Plot.plot({
      marginLeft: 180, // Ruime marge voor je lange labels
      marginBottom: 100,
      height: 400,
      padding: 0.05,
      x: {
        domain: Array.from(niveaus.values()), // Gebruikt de volgorde van je Map (0 t/m 4)
        tickRotate: -45,
        label: "Dexterity"
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
        Plot.cell(dataCDEX, {
          x: "kolom",
          y: "rij",
          fill: "waarde",
          inset: 0.5
        }),
        Plot.text(dataCDEX, {
          x: "kolom",
          y: "rij",
          text: d => ((d.waarde)*100).toFixed(1) + '%' ,
          fill: d => d.waarde > 0.3 ? "black" : "white"
        })
      ]
    })}
  </div>
</div>