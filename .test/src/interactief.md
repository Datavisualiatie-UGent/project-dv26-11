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

const data1 = [0,0,0];
data1[0] = data[5].D;
data1[1] = data[6].D;
data1[2] = data[7].D;

```

<div class="grid grid-cols-1">
  <div class="card">
  <h1> Overeenkomst Job-Onderwijs 
    ${Plot.plot({
      marginLeft: 180, 
      marginBottom: 100,
      height: 400,
      padding: 0.05,
      x: {
        tickRotate: -45,
        label: "x-as"
      },
      y: {
        label: "y-as"
      },
      marks: [
        Plot.cell(data1, {
          x: "kolom",
          y: "rij",
          fill: "waarde",
          inset: 0.5
        })
      ]
    })}
  </div>
</div>

