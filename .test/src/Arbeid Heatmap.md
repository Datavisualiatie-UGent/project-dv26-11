---
theme: dashboard
title: Arbeid Heatmap
toc: false
---

# Arbeid Heatmap

<p style="max-width:1000px"> 
  Als studenten in de Master wiskunde, leek het ons interessant om een uitgebreid onderzoek over de arbeidsmarkt te bestuderen. Meer specifiek werd er in deze enquête gepeild naar welke vaardigheden het vaakst gebruikt worden naast ‘calculate’, dat is de tijd die iemand in zijn/haar/hun job besteedt aan het maken van relatief complexe berekeningen (met of zonder computer). Je zou zeker kunnen zeggen dat dit een belangrijke component zal zijn in de job van een wiskundige. We bekeken zelf welke vaardigheden het meest gecombineerd worden met ‘calculate’, en ook welke vaardigheid we waarschijnlijk niet zullen moeten beheersen.
</p>


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

const som = data[120].B;

function makedata(beginrij){
    const array = [[0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0],[0,0,0,0,0]];
    {
      for (let i = 0; i < 5; i++) {
        array[i][0] = data[beginrij+i].D
      }
      for (let i = 0; i < 5; i++) {
        array[i][1] = data[beginrij+i].F
      }
      for (let i = 0; i < 5; i++) {
        array[i][2] = data[beginrij+i].H
      }
      for (let i = 0; i < 5; i++) {
        array[i][3] = data[beginrij+i].J
      }
      for (let i = 0; i < 5; i++) {
        array[i][4] = data[beginrij+i].L
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
          text: d => d.waarde ,
          fill: d => d.waarde > 100000 ? "black" : "white"
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

  <div style="margin-top: 15px; font-family: sans-serif; font-size: 0.85rem; max-width:1000px">
    <table style="max-width:500px;width: 100%; border-collapse: collapse;">
      <thead style="border-bottom: 1px solid #ccc; color: #666;">
        <tr>
          <th style="text-align: left; padding: 4px;">Categorie</th>
          <th style="text-align: right; padding: 4px;">Percentage</th>
          <th style="text-align: right; padding: 4px;">Aantal personen</th>
        </tr>
      </thead>
      <tbody>
        ${gestapeldeData.map(d => html`
          <tr style="border-bottom: 1px solid #eee;max-width:500px;">
            <td style="padding: 6px 4px;">${d.categorie}</td>
            <td style="text-align: right; padding: 6px 4px;">${(d.waarde * 100).toFixed(1)}%</td>
            <td style="text-align: right; padding: 6px 4px; font-weight: bold;">
              ${(d.waarde * som).toLocaleString("nl-BE", {maximumFractionDigits: 0})}
            </td>
          </tr>
        `)}
      </tbody>
    </table>
  </div>

</div>

<p style="max-width:1000px"> 
  Wat ons meteen opvalt is dat zeer weinig mensen aangeven als voornaamste taak bezig te zijn met het maken van complexe berekeningen. Bijna 60% geeft zelfs aan dit nooit te moeten doen.
  We zullen ons hier dus focussen op zij die aangeven het grootste deel van de tijd bezig te zijn met wiskunde, wat maar 2% is, en zij die aangeven meer dan de helft van de tijd te spenderen aan berekeningen, wat toch ruim 5% van de ondervraagden bedraagt. De totale groep bestaat uit 360 personen.
</p>

<div class="grid grid-cols-1">
  <div class="card">
  <h1> Calculate-Digital 
  <h4 class="explanation" style="max-width=1000px"> Tijd besteed aan werk met een computer, een tablet of een smartphone, telefoongesprekken niet inbegrepen</h4>
    ${chart1}
  </div>
</div>

<p style="max-width:1000px"> 
  Uit het onderzoek blijkt dat we zeer vaak zullen moeten werken met een computer, tablet pf smartphone. Dit is vanzelfsprekend aangezien de meeste complexe berekeningen gedaan worden met een computer en niet meer met de hand. 85,6% van zij die ten minste de helft van de tijd met complexe berekeningen bezig zijn, geven dan ook aan minstens de helft van de tijd digitaal aan het werk te zijn. Slechts 3,8% van de wiskundigen geeft aan nooit digitaal te moeten werken.
</p>


<div class="grid grid-cols-1">
  <div class="card">
    <h1> Calculate-Physical 
    <h4 class="explanation" style="max-width=1000px">Tijd besteed aan zwaar lichamelijk werk</h4>
    ${chart3}
  </div>
</div>

<p style="max-width:1000px"> 
  Zoals duidelijk op de heatmap, zijn mensen die wiskundig bezig zijn, over het algemeen niet fysiek bezig. In het totaal besteedt maar 11% van de wiskundigen ook veel tijd aan fysieke arbeid op het werk, terwijl 72% van onze groep aangeeft zich nooit fysiek te moeten inspannen. De kans lijkt ons dus relatief groot dat ook wij niet met zware benen en stijve arme thuis zullen komen na het werk.
</p>


<div class="grid grid-cols-1">
  <div class="card">
    <h1> Calculate-CommInt
    <h4 class="explanation" style="max-width=1000px">Tijd besteed aan het mondeling communiceren met mensen binnen het bedrijf of de organisatie</h4>
    ${chart5}
  </div>
</div>

<p style="max-width:1000px"> 
  In onze job later zal het ook erg belangrijk zijn om onze bevindingen te communiceren met onze collega’s in het bedrijf. Dat blijkt ook uit dit onderzoek. 53,3% van zij die veel met wiskunde bezig zijn, moeten ook zeer regelmatig communiceren met anderen binnen hun bedrijf. Ook dit lijkt ons eerder logisch, omdat het interpreteren van resultaten uit complexe berekeningen vaak niet eenvoudig is.
</p>

