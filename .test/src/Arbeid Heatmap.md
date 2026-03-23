---
theme: dashboard
title: Arbeid Heatmap
toc: false
---

# Arbeid Heatmap

Hieronder zie je de heatmap op basis van de array data.

```js
// 1. Je ruwe data
const workbook = await FileAttachment("data/Ad hoc module 2022 tabellen.xlsx").xlsx();
const data = workbook.sheet(2, {headers: true});
const heatmapDataDigitalReading = [[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0],[0,0,0,0,0]];
{
  for (let i = 0; i < 5; i++) {
    heatmapDataDigitalReading[i][0] = data[115+i].E
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataDigitalReading[i][1] = data[115+i].G
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataDigitalReading[i][2] = data[115+i].I
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataDigitalReading[i][3] = data[115+i].K
  }
  for (let i = 0; i < 5; i++) {
    heatmapDataDigitalReading[i][4] = data[115+i].M
  }
}

// 2. Data vlakmaken voor Plot
const dataDR = heatmapDataDigitalReading.flatMap((row, i) => 
  row.map((value, j) => ({ 
    rij: `Digital ${i}`, 
    kolom: `Reading ${j}`, 
    waarde: value 
  }))
);
```

<div class="grid grid-cols-1">
  <div class="card">
    ${Plot.plot({
      height: 400,
      padding: 0.05,
      color: {
        type: "log", 
        scheme: "Magma",
        legend: true,
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
        text: d => d3.format(".2s")(d.waarde),
        fill: d => d.waarde > 400000 ? "black" : "white"
        })
    ]
    })}
  </div>
</div>