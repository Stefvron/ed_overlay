// ==UserScript==
// @name        EveryoneOverlay - Everyonedraw.com-Overlay
// @namespace   stefvron
// @copyright   2024, Stefvron (https://github.com/Stefvron)
// @version     1.0
// @description This script provides the option to add an overlay to the everyonedraw website to simplify placing pixels for larger artworks
// @icon        https://github.com/Stefvron/ed_overlay/icon.webp
// @author      Stefvron
// @website     https://github.com/Stefvron/ed_overlay
// @match       https://everyonedraw.com/*/*/*
// @run-at      document-idle
// @updateURL   https://github.com/Stefvron/ed_overlay/ed_overlay.js
// @downloadURL https://github.com/Stefvron/ed_overlay/ed_overlay.js
// ==/UserScript==

function GM_addStyle (cssStr) {
    var D = document;
    var newNode = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild(newNode);
}

var toggle = document.createElement("input");
toggle.type = "checkbox";
toggle.checked = true;
toggle.id = "overlayToggle";
document.getElementsByClassName("topBar")[0].appendChild(toggle);
var tL = document.createElement("label");
tL.id = "oTL";
tL.htmlFor = "overlayToggle";
tL.innerHTML = "Toggle Overlay";
document.getElementsByClassName("topBar")[0].appendChild(tL);
GM_addStyle("#oTL {display: inline-flex; flex-basis: auto; font-family: sans-serif; font-size: 13px; font-weight: 400; justify-content: center; line-height: 24px; text-align: center; vertical-align: middle; word-spacing: 0; border-radius: 16px; height: 32px; width: auto; background-color: #008751; color: rgb(255, 241, 232); border: none; margin: 0; margin-right: 5px; padding: 4px; -webkit-appearance: none; cursor: pointer; padding-left: 16px; padding-right: 16px;} #overlayToggle:not(:checked) + #oTL {background-color: #FF004D;} #overlayToggle {width: 0px; height: 0px; -webkit-appearance: none; opacity: 0;");

var asel = document.createElement("input");
asel.type = "url";
asel.id = "overlayASel";
asel.placeholder = "Overlay archive url"
document.getElementsByClassName("topBar")[0].appendChild(asel);
GM_addStyle("#overlayASel {display: inline-flex; flex-basis: auto; font-family: sans-serif; font-size: 13px; font-weight: 400; justify-content: center; line-height: 24px; text-align: left; vertical-align: middle; word-spacing: 0; border-radius: 16px; height: 32px; width: auto; background-color: #FF77A8; color: rgb(255, 241, 232); border: none; margin: 0; margin-right: 5px; padding: 4px; -webkit-appearance: none; cursor: text; padding-left: 16px; padding-right: 16px;}");

var overlayGroup = document.createElement("div");
overlayGroup.id = "overlayGroup";
document.getElementsByClassName("oldPage")[0].appendChild(overlayGroup);
GM_addStyle("#overlayGroup {pointer-events: none;}");

let coords = () => {
    let share = document.getElementsByClassName("css-9iedg7")[1]
    return [Number(share.innerHTML.split("(")[1].split(",")[0]), Number(share.innerHTML.split("(")[1].split(", ")[1].replace(")", ""))]
}

function updateCoords() {
    console.log(coords())
}

var mousechecker = null
function enableUpdateCoords() {
    if(mousechecker == null) mousechecker = setInterval(updateCoords, 100)
}
function disableUpdateCoords() {
    clearInterval(mousechecker)
    mousechecker = null
}

let canvasList = document.getElementsByClassName("css-1kt7xp8")
for(i = 0; i < canvasList.length; i++) {
    canvasList[i].addEventListener("mousedown", enableUpdateCoords)
    canvasList[i].addEventListener("mouseup", disableUpdateCoords)
    canvasList[i].addEventListener("mouseout", disableUpdateCoords)
}