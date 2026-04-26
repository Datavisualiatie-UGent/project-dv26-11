---
theme: dashboard
title: test
toc: false
---

# test

<style>
  .tooltip {
    background-color: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 13px;
    display: none;
    z-index: 1000; /* Zorg dat hij bovenop alles ligt */
  }

  .tooltip[data-show] {
    display: block;
  }
</style>

<div class="card">
  <p class="tip-button" data-target="tooltip1">I'm a button</p>
  <div id="tooltip1" role="tooltip" class="tooltip">I'm a tooltip</div>
  <button class="tip-button" data-target="tooltip2">I'm a button too</button>
  <div id="tooltip2" role="tooltip" class="tooltip">Opnieuw</div>
  <button class="tip-button" data-target="tooltip3">I'm a button too</button>
  <div id="tooltip3" role="tooltip" class="tooltip">Opnieuw</div>
</div>

<div class="card">

</div>

```js
import * as Popper from "https://cdn.skypack.dev/@popperjs/core@2";

// Selecteer alle knoppen die een tooltip nodig hebben
const buttons = document.querySelectorAll('.tip-button');

buttons.forEach(button => {
  // Zoek de bijbehorende tooltip via het ID in 'data-target'
  const tooltipId = button.getAttribute('data-target');
  const tooltip = document.querySelector(`#${tooltipId}`);

  if (!button || !tooltip) return;

  // Maak voor ELKE knop een eigen popper instance
  const popperInstance = Popper.createPopper(button, tooltip, {
    placement: 'right',
    modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
  });

  // Functies specifiek voor deze knop/tooltip combinatie
  function show() {
    tooltip.setAttribute('data-show', '');
    popperInstance.update();
  }

  function hide() {
    tooltip.removeAttribute('data-show');
  }

  // Event listeners koppelen aan deze specifieke knop
  const showEvents = ['mouseenter', 'focus'];
  const hideEvents = ['mouseleave', 'blur'];

  showEvents.forEach(event => button.addEventListener(event, show));
  hideEvents.forEach(event => button.addEventListener(event, hide));
});