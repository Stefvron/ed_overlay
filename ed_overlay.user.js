// ==UserScript==
//@name        EveryoneOverlay - Everyonedraw.com-Overlay
//@namespace   stefvron
//@copyright   2024, Stefvron (https://github.com/Stefvron)
//@version     1.5.1
//@description This script provides the option to add an overlay to the EveryoneDraw website to simplify placing pixels for larger artworks
//@icon        https://stefvron.github.io/ed_overlay/icon.webp
//@author      Stefvron
//@website     https://github.com/Stefvron/ed_overlay
//@match       https://everyonedraw.com/*
//@run-at      document-idle
//@updateURL https://github.com/Stefvron/ed_overlay/raw/master/ed_overlay.user.js
//@downloadURL https://github.com/Stefvron/ed_overlay/raw/master/ed_overlay.user.js
// ==/UserScript==

function GM_addStyle (cssStr) {
    var D = document;
    var newNode = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild(newNode);
}

if(localStorage.getItem("overlayToggle") == null) localStorage.setItem("overlayToggle","true")
if(localStorage.getItem("archiveLink") == null) localStorage.setItem("archiveLink","")
else getArchiveContents(localStorage.getItem("archiveLink"))

var enabled = localStorage.getItem("overlayToggle") == "true"

var toggle = document.createElement("input");
toggle.type = "checkbox";
toggle.checked = enabled;
toggle.id = "overlayToggle";
toggle.addEventListener("change", () => {
    enabled = !enabled
    localStorage.setItem("overlayToggle",String(enabled))
    let oIms = document.getElementsByClassName("overlayImage")
    for(i = 0; i < oIms.length; i++) oIms[i].style.setProperty("display", enabled ? "block" : "none")
    updateZoom()
})
document.getElementsByClassName("topBar")[0].appendChild(toggle);
var tL = document.createElement("label");
tL.id = "oTL";
tL.htmlFor = "overlayToggle";
tL.innerHTML = "Toggle Overlay";
document.getElementsByClassName("topBar")[0].appendChild(tL);
GM_addStyle("#oTL {display: inline-flex; flex-basis: auto; font-family: sans-serif; font-size: 13px; font-weight: 400; justify-content: center; line-height: 24px; text-align: center; vertical-align: middle; word-spacing: 0; border-radius: 16px; height: 32px; width: auto; background-color: #008751; color: rgb(255, 241, 232); border: none; margin: 0; margin-right: 5px; padding: 4px; -webkit-appearance: none; cursor: pointer; padding-left: 16px; padding-right: 16px;} #overlayToggle:not(:checked) + #oTL {background-color: #FF004D;} #overlayToggle {width: 0px; height: 0px; -webkit-appearance: none; opacity: 0;");

var asel = document.createElement("input");
asel.type = "url";
asel.value = localStorage.getItem("archiveLink")
asel.id = "overlayASel";
asel.placeholder = "Overlay archive url"
asel.addEventListener("change", (e) => {getArchiveContents(e.target.value)})
document.getElementsByClassName("topBar")[0].appendChild(asel);
GM_addStyle("#overlayASel {display: inline-flex; flex-basis: auto; font-family: sans-serif; font-size: 13px; font-weight: 400; justify-content: center; line-height: 24px; text-align: left; vertical-align: middle; word-spacing: 0; border-radius: 16px; height: 32px; width: auto; background-color: #FF77A8; color: rgb(255, 241, 232); border: none; margin: 0; margin-right: 5px; padding: 4px; -webkit-appearance: none; cursor: text; padding-left: 16px; padding-right: 16px;}");

var overlayGroup = document.createElement("div");
overlayGroup.id = "overlayGroup";
document.getElementsByClassName("oldPage")[0].prepend(overlayGroup);
GM_addStyle("#overlayGroup>* {image-rendering: pixelated;-moz-transform: scale(var(--zoom));-ms-transform: scale(var(--zoom));-o-transform: scale(var(--zoom));-webkit-transform: scale(var(--zoom));transform: scale(var(--zoom));position: absolute;left: calc(var(--width)/2 - var(--x-off) * var(--zoom) + var(--x) * var(--zoom) + 0.5px * (var(--zoom) - 1 + (min(2,var(--zoom) - 1))));top: calc(var(--height)/2 + var(--y-off) * var(--zoom) - var(--y) * var(--zoom) - 2px - 0.5px * (var(--zoom) - 1 + (min(2,var(--zoom) - 1)))); transform-origin: top left;} #overlayGroup {position: absolute; left:0; top: 0;width: 100vw; height:100vh;pointer-events: none; opacity: 0.7}");

let coords = () => {
    let share = document.getElementsByClassName("css-9iedg7")[1]
    return [Number(share.innerHTML.split("(")[1].split(",")[0]), Number(share.innerHTML.split("(")[1].split(", ")[1].replace(")", ""))]
}

function updateCoords() {
    if(enabled) {
        var width = document.getElementsByClassName("css-1kt7xp8")[0].getAttribute("width")
        var height = document.getElementsByClassName("css-1kt7xp8")[0].getAttribute("height")
        document.getElementById("overlayGroup").style.setProperty("--x-off", coords()[0] + "px")
        document.getElementById("overlayGroup").style.setProperty("--y-off", coords()[1] + "px")
        document.getElementById("overlayGroup").style.setProperty("--width", width + "px")
        document.getElementById("overlayGroup").style.setProperty("--height", height + "px")
    }
}
function updateZoom() {
    if(enabled) {
        document.getElementById("overlayGroup").style.setProperty("--zoom", window.location.pathname.split("/")[1])
        updateCoords()
    }
}
let oldLink = window.location.pathname.split("/")[1]
function checkLink() {
    if(enabled && window.location.pathname.split("/")[1] != oldLink) {
        oldLink = window.location.pathname.split("/")[1]
        updateZoom()
    }
}
let linkInterval = setInterval(checkLink, 10)

const passiveCoordUpdater = setInterval(updateCoords, 100)

var mousechecker = null
function enableUpdateCoords() {
    if(enabled && mousechecker == null) mousechecker = setInterval(updateCoords, 10)
}
function disableUpdateCoords() {
    clearInterval(mousechecker)
    mousechecker = null
}

GM_addStyle(".css-1kt7xp8 {cursor: none !important;}")
let canvasList = document.getElementsByClassName("css-1kt7xp8")
for(i = 0; i < canvasList.length; i++) {
    canvasList[i].addEventListener("mousedown", enableUpdateCoords)
    canvasList[i].addEventListener("touchstart", enableUpdateCoords)
    canvasList[i].addEventListener("mouseup", disableUpdateCoords)
    canvasList[i].addEventListener("mouseout", disableUpdateCoords)
    canvasList[i].addEventListener("touchend", disableUpdateCoords)
}


updateZoom()

// [x,y]: link////HTML src Base64
var images = {}
async function getArchiveContents(link) {
    // Example links (input -> output)
    // https://github.com/Stefvron/ed_overlay/tree/master/ExampleArchive
    // https://api.github.com/repos/Stefvron/ed_overlay/git/trees/master?recursive=1

    localStorage.setItem("archiveLink",link)

    images = {}

    var directory = link.replace(/https:\/\/github\.com\/[^\/]*\/[^\/]*\/tree\/[^\/]*\//, "")
    if(directory != "") directory += "/"
    let username = link.split("/")[3]
    let repo = link.split("/")[4]
    let branch = link.split("/")[6]
    /*link = link.replace("https://github.com/", "https://api.github.com/repos/")
    link = link.replace("/tree/","/git/trees/")
    link = link.split("/")
    link.splice(-1)
    link = link.join("/") + "?recursive=1"*/
    const response = await fetch("https://api.github.com/repos/" + username + "/" + repo + "/git/trees/" + branch + "?recursive=1");
    const fileList = await response.json();
    const filesInDir = fileList["tree"].filter((el) => el["path"].startsWith(directory))
    for(i = 0; i < filesInDir.length; i++) {
        const fileName = filesInDir[i]["path"].split("/").slice(-1)[0]
        /*const imresponse = await fetch(filesInDir[i]["url"]);
        const imjson = await imresponse.json()
        const b64 = imjson["content"]*/
        images[fileName] = "https://" + username + ".github.io/" + repo + "/" + directory + fileName //b64 //"data:image/" + type + ";base64, " + b64
    }
    addImagesToOverlay()
}

var width = document.getElementsByClassName("css-1kt7xp8")[0].getAttribute("width")
var height = document.getElementsByClassName("css-1kt7xp8")[0].getAttribute("height")
var curCoords = coords()
function addImagesToOverlay() {
    document.getElementById("overlayGroup").innerHTML = ""
    width = document.getElementsByClassName("css-1kt7xp8")[0].getAttribute("width")
    height = document.getElementsByClassName("css-1kt7xp8")[0].getAttribute("height")
    curCoords = coords()
    for(i = 0; i < Object.keys(images).length; i++) {
        var im = new Image()
        const x = Object.keys(images)[i].split("_")[0]
        const y = Object.keys(images)[i].split("_")[1].split(".")[0]
        const type = Object.keys(images)[i].split(".")[1]
        im.dataset.x = x
        im.dataset.y = y
        im.style = "--x:" + x + "px;--y:" + y + "px;display:" + (enabled ? "inherit" : "none") + ";"
        im.classList.add("overlayImage")
        im.addEventListener("load", (e) => {
            /*if(inBounds(e.target))*/ document.getElementById("overlayGroup").appendChild(e.target)
        })
        im.src = images[Object.keys(images)[i]] //"data:image/" + type + ";base64, " + images[Object.keys(images)[i]]
    }
    updateZoom()
}

function inBounds(el) {
    const x = el.dataset.x
    const y = el.dataset.y
    var inBoundC = 0
    if(coordInBounds(x,y)) inBoundC++
    if(coordInBounds(x,y+el.height)) inBoundC++
    if(coordInBounds(x+el.width,y+el.height)) inBoundC++
    if(coordInBounds(x+el.width,y)) inBoundC++
    return inBoundC > 0
}
function coordInBounds(x,y) {
    const xoff = Math.abs(x - curCoords[0])
    const yoff = Math.abs(y - curCoords[1])
    return xoff <= width/2 && yoff <= height/2
}