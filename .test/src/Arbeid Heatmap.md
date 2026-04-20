---
theme: dashboard
title: Vaardigheden die verband houden met onze (toekomstige) job
toc: false
---

# Vaardigheden die verband houden met onze (toekomstige) job

<p style="max-width:1000px"> 
  Als studenten in de Master wiskunde, leek het ons interessant om een uitgebreid onderzoek over de arbeidsmarkt te bestuderen. Meer specifiek werd er in deze enquête gepeild naar welke vaardigheden het vaakst gebruikt worden naast ‘calculate’, dat is de tijd die iemand in zijn/haar/hun job besteedt aan het maken van relatief complexe berekeningen (met of zonder computer). Je zou zeker kunnen zeggen dat dit een belangrijke component zal zijn in de job van een wiskundige. We bekeken zelf welke vaardigheden het meest gecombineerd worden met ‘calculate’, en ook welke vaardigheid we waarschijnlijk niet zullen moeten beheersen.
</p>

<p>Bron; EAK - Enquête naar de Arbeidskrachten 2022 - Ad hoc module "Vaardigheden die verband houden met de job"</p>

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
    { groep: "Totaal", categorie: niveaus.get(4), waarde: Number(data[119].C), number:0 },
    { groep: "Totaal", categorie: niveaus.get(3), waarde: Number(data[118].C), number:1 },
    { groep: "Totaal", categorie: niveaus.get(2), waarde: Number(data[117].C), number:2 },
    { groep: "Totaal", categorie: niveaus.get(1), waarde: Number(data[116].C), number:3 },
    { groep: "Totaal", categorie: niveaus.get(0), waarde: Number(data[115].C), number:4 }
];

const range0 = 0.3;
const range1=0.95;

const som = data[120].B;

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
        range: [range0, range1],
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


const textColor = new Map();
{
  textColor.set(0, "white");
  textColor.set(1, "white");
  textColor.set(2, "white");
  textColor.set(3, "black");
  textColor.set(4, "black");
}

function WiskundeData(row, groep="Totaal"){
  const tot = data[row].B;
  return [
    { groep: groep, categorie: niveaus.get(4), waarde: Number(data[row].L/tot), number:0 },
    { groep: groep, categorie: niveaus.get(3), waarde: Number(data[row].J/tot), number:1 },
    { groep: groep, categorie: niveaus.get(2), waarde: Number(data[row].H/tot), number:2 },
    { groep: groep, categorie: niveaus.get(1), waarde: Number(data[row].F/tot), number:3 },
    { groep: groep, categorie: niveaus.get(0), waarde: Number(data[row].D/tot), number:4 }
];
}


function makeplotDetail(data, legende=true){
  return Plot.plot({
        marginLeft: 60,
        width:1000,
        x: { axis: "top", percent: true },
        color: { scheme: "Magma", legend:legende, range:[range0, range1] },
        //y: {axis: null},
        height:110,
        marks: [
          Plot.barX(data, {
            offset: "normalize",
            y: "groep",
            x: "waarde",
            fill: "categorie",
            sort: { color: null, y: { value: "-x", reduce: "first" } }
          }),
          Plot.text(data, Plot.stackX({
            y: "groep",
            x: "waarde",
            text: d => d.waarde > 0.05 ? ((d.waarde)*100).toFixed(1) + "%" : ((d.waarde)*100).toFixed(0) + "%" ,
            fill: d => textColor.get(d.number)
          })
          )
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

let detailData = WiskundeData(115, "Digital");
detailData = detailData.concat(WiskundeData(127, "Reading"));
detailData = detailData.concat(WiskundeData(139, "Physical"));
detailData = detailData.concat(WiskundeData(151, "Dexterity"));
detailData = detailData.concat(WiskundeData(163, "CommInt"));
detailData = detailData.concat(WiskundeData(175, "CommExt"));
detailData = detailData.concat(WiskundeData(187, "Guidance"));
detailData = detailData.concat(WiskundeData(211, "Repetitive"));
detailData = detailData.concat(WiskundeData(223, "Procedure"));


```
<div class="card">
  <h1> Calculate = 
  <h4 class="explanation" style="max-width=1000px"> Tijd besteed aan relatief complexe berekeningen (eventueel met rekenmachine of computerprogramma)</h4>
  ${makeplotDetail(gestapeldeData)}

  <div style="margin-top: 20px; font-family: var(--sans-serif); font-size: 13px; border: 1px solid #eee; border-radius: 8px; overflow: hidden; background: white; color: #333;">
  
  <div style="display: flex; background: #444; color: white; font-weight: bold; padding: 12px 10px;width:640;">
    <div style="flex: 3; text-align: left;">Frequentie</div>
    <div style="flex: 1; text-align: right;">Aandeel</div>
    <div style="flex: 1.5; text-align: right;">Aantal personen</div>
  </div>

  ${gestapeldeData.map(d => html`
    <div style="display: flex; padding: 10px; border-bottom: 1px solid #eee; align-items: center;width:1000px">
      <div style="flex: 3; text-align: left; display: flex; align-items: center;">
        <span style="min-width: 12px; width: 12px; height: 12px; margin-right: 10px; border-radius: 2px; background: ${
              d.categorie === niveaus.get(4) ? " rgb(100, 26, 128)": 
              d.categorie === niveaus.get(3) ? "rgb(166, 49, 125)" : 
              d.categorie === niveaus.get(2) ? "rgb(231, 82, 99)" : 
              d.categorie === niveaus.get(1) ? "rgb(253, 154, 106)" : "rgb(253, 231, 169)"
        };"></span>
        <span style="white-space: nowrap;">${d.categorie}</span>
      </div> 
      <div style="flex: 1; text-align: right; font-variant-numeric: tabular-nums;">
        ${(d.waarde * 100).toFixed(1)}%
      </div>
      <div style="flex: 1.5; text-align: right; font-weight: bold; font-variant-numeric: tabular-nums;">
        ${Math.round(d.waarde * som).toLocaleString("nl-BE")}
      </div>
    </div>
  `)}

  <div style="display: flex; padding: 12px 10px; background: #f9f9f9; font-weight: bold; border-top: 2px solid #444;">
    <div style="flex: 3; text-align: left;">Totaal</div>
    <div style="flex: 1; text-align: right;">100.0%</div>
    <div style="flex: 1.5; text-align: right;">${Math.round(som).toLocaleString("nl-BE")}</div>
  </div>
</div>

</div>

<p style="max-width:1000px"> 
  Wat ons meteen opvalt is dat zeer weinig mensen aangeven als voornaamste taak bezig te zijn met het maken van complexe berekeningen. Bijna 60% geeft zelfs aan dit nooit te moeten doen.
  We zullen ons hier dus focussen op zij die aangeven het grootste deel van de tijd bezig te zijn met wiskunde, wat maar 2% is, en zij die aangeven meer dan de helft van de tijd te spenderen aan berekeningen, wat toch ruim 5% van de ondervraagden bedraagt. De totale groep bestaat uit 360 personen.
</p>

<div class="grid grid-cols-1">
  <div class="card">
    <h1> Calculate-Digital 
    <h4 class="explanation" style="max-width:1000px"> Tijd besteed aan werk met een computer, een tablet of een smartphone, telefoongesprekken niet inbegrepen</h4>
      ${chart1}
    <h1 class="explanation" style="max-width:1000px; margin-top:20px"> Digital in groep met hoogste Calculate</h1>
    ${makeplotDetail(WiskundeData(115, true))}

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
    <h1 class="explanation" style="max-width:1000px; margin-top:20px"> Phsical in groep met hoogste Calculate</h1>
    ${makeplotDetail(WiskundeData(139, true))}
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
    <h1 class="explanation" style="max-width:1000px; margin-top:20px"> CommInt in groep met hoogste Calculate</h1>
    ${makeplotDetail(WiskundeData(163, true))}
  </div>
</div>

<p style="max-width:1000px"> 
  In onze job later zal het ook erg belangrijk zijn om onze bevindingen te communiceren met onze collega’s in het bedrijf. Dat blijkt ook uit dit onderzoek. 53,3% van zij die veel met wiskunde bezig zijn, moeten ook zeer regelmatig communiceren met anderen binnen hun bedrijf. Ook dit lijkt ons eerder logisch, omdat het interpreteren van resultaten uit complexe berekeningen vaak niet eenvoudig is.
</p>


<div class="grid grid-cols-1">
  <div class="card">
    <h1 style="max-width:1000px"> Vergelijking alle vaardigheden in de groep met de meeste 'calculate'
    <h4 class="explanation" style="max-width=1000px">Tijd besteed aan het mondeling communiceren met mensen binnen het bedrijf of de organisatie</h4>
    ${Plot.plot({
        marginLeft: 70,
        width:1000,
        x: { axis: "top", percent: true },
        color: { scheme: "Magma", legend:true, range: [range0, range1] },
        y: {axis: "left"},
        height:500,
        marks: [
          Plot.barX(detailData, {
            offset: "normalize",
            y: "groep",
            x: "waarde",
            fill: "categorie",
            sort: { color: null, y: { value: "-x", reduce: "first" } }
          }),
          Plot.text(detailData, Plot.stackX({
            y: "groep",
            x: "waarde",
            text: d => d.waarde > 0.05 ? ((d.waarde)*100).toFixed(1) + "%" : ((d.waarde)*100).toFixed(0) + "%" ,
            fill: d => textColor.get(d.number)
          })
          )
        ]
      })}


  </div>
</div>

<p style="max-width:1000px"> 
  tekst enal
</p>

