import {
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  Chart
} from 'chart.js';
import './style.css';
import {Map, Tile, View} from 'ol';
import { fromLonLat, Projection } from 'ol/proj';
import {defaults as defaultControls} from 'ol/control/defaults.js';
import { defaults as defaultInteractions, DragPan } from 'ol/interaction';
import { wmsLayerCombinedProvince, wmsLayerHighestProvince } from './src/assets/data/province.js';
import { wmsLayerHighestMunicipality, wmsLayerCombinedMunicipality } from './src/assets/data/gemeente.js';
import { wmsLayerSimCity } from './src/assets/data/similiraties.js';
import { wmsLayerCombinedNeigh, wmsLayerHighestNeigh } from './src/assets/data/neigh.js';
import { showFeaturesProps, showSimilarCities } from './src/interactions/actions.js';
import { CENTER_COORDS, removeAllLayers, ZOOM_LEVEL, partyVariableObjects, partyVariableJSON, getMunicipalities, clearDropdown, downloadGeoJSON, downloadCSV } from './src/utils/helper.js';
import { getNationalChartConfig } from './src/charts/national-chart.js';

//#region Variables
var dataLevel = 'Province';
var objDataLevel = {};
const provinceBtn = document.getElementById("province-btn");
const municipalityBtn = document.getElementById("municipality-btn");
const neighBtn = document.getElementById("neigh-btn");
//#endregion

//#region Map config
const projection = new Projection({
  code: 'EPSG:28992',
  units: 'metric'
});
//#endregion

//#region Map
const map = new Map({
  // controls: defaultControls({ zoom: false }).extend([scaleControl]),
  target: 'map',
  controls: defaultControls({ zoom: false }),
  interactions: defaultInteractions({ dragPan: false }),
  projection: projection,
  layers: [],
  view: new View({
    center: fromLonLat(CENTER_COORDS),
    zoom: ZOOM_LEVEL,
    minZoom: ZOOM_LEVEL,
  })
});
//#endregion

//#region Startup of application
// Province button is selected
function updateButtonState() {
  if (window.location.hash === "#/pro") {
    provinceBtn.disabled = true;
    municipalityBtn.disabled = true;
    neighBtn.disabled = true;
  } else {
    provinceBtn.disabled = false;
    municipalityBtn.disabled = false;
    neighBtn.disabled = false;
  }
}

// Run on initial load
updateButtonState();
document.getElementById("province-btn").addEventListener("click", () => {
  showProvince();
  dataLevel = 'Province';
  if (window.location.hash == '#/stats') clearDropdown('partyDropdown', 'Select a political party');
});
document.getElementById("province-btn").click();
// #endregion

//#region Data level button interactions
document.getElementById("municipality-btn").addEventListener("click", () => {
  showMunicipality();
  dataLevel = 'Municipality';
  if (window.location.hash == '#/stats') clearDropdown('partyDropdown', 'Select a political party');
});

document.getElementById("neigh-btn").addEventListener("click", () => {
  showNeigh();
  dataLevel = 'Neigh';
  if (window.location.hash == '#/stats') clearDropdown('partyDropdown', 'Select a political party');
});

function showProvince() {
  removeAllLayers(map);
  map.addLayer(wmsLayerHighestProvince);
  dataLevel = 'Province';
  // document.querySelectorAll('#data-single-content-prov, #data-single-content-mun, #data-single-content-neigh')
  //     .forEach(el => el.style.display = 'none');
  // resetMap(map);
}

function showMunicipality() {
  removeAllLayers(map);
  map.addLayer(wmsLayerHighestMunicipality);  
  dataLevel = 'Municipality';
  // document.querySelectorAll('#data-single-content-prov, #data-single-content-mun, #data-single-content-neigh')
  //     .forEach(el => el.style.display = 'none');
  // resetMap(map);
}

function showNeigh() {
  removeAllLayers(map);
  map.addLayer(wmsLayerHighestNeigh);
  dataLevel = 'Neigh';
  // document.querySelectorAll('#data-single-content-prov, #data-single-content-mun, #data-single-content-neigh')
  //     .forEach(el => el.style.display = 'none');
  // resetMap(map); 
}
//#endregion

//#region Lifecycle actions
document.addEventListener("DOMContentLoaded", async () => {
  const statsBtn = document.getElementById("stats-btn");
  const proBtn = document.getElementById("pro-btn");
  const backBtn = document.getElementById("back-btn");
  const downloadBtn = document.getElementById("download-btn");
  downloadBtn.style.display = "none";

  // Button events
  statsBtn.addEventListener("click", async () => {
    window.location.hash = "#/stats";
    downloadBtn.style.display = "block";
    document.getElementById("data-single-content").style.display = "none";
    removeAllLayers(map);
    map.addLayer(wmsLayerHighestProvince);
    await setPartiesForm();
    clearDropdown('cityDropdown', 'Select a municipality in the list');
    clearDropdown('partyDropdown', 'Select a political party');
    // document.getElementById('topsCities').style.display = 'none';
    // showSection("stats-content");
    // showSection("data-single-content-prov");
    // resetMap(map);
  });

  proBtn.addEventListener("click", async () => {
    window.location.hash = "#/pro";
    downloadBtn.style.display = "block";
    removeAllLayers(map);
    wmsLayerSimCity.getSource().updateParams({
      'CQL_FILTER': ''
    });
    map.addLayer(wmsLayerSimCity);
    clearDropdown('cityDropdown', 'Select a municipality in the list');
    clearDropdown('partyDropdown', 'Select a political party');
    document.getElementById("legend").style.display = "none";
    await setMunicipalitiesForm();
    // showSection("stats-content");
    // resetMap(map);
  });

  backBtn.addEventListener("click", () => {
    window.location.hash = "#/";
    downloadBtn.style.display = "none";
    showSection("main-content");
    removeAllLayers(map);
    map.addLayer(wmsLayerHighestProvince);
    document.getElementById("legend").style.display = 'block';
    clearDropdown('cityDropdown', 'Select a municipality in the list');
    clearDropdown('partyDropdown', 'Select a political party');
    // document.getElementById('topsCities').style.display = 'none';
    // resetMap(map);
  });

  // Initial load
  function loadPageFromRoute() {
    // document.querySelectorAll('#data-single-content-prov, #data-single-content-mun, #data-single-content-neigh')
    //   .forEach(el => el.style.display = 'none');
    switch (window.location.hash) {
      case '#/stats':
        return showSection("stats-content");
      case '#/pro':
        return showSection("pro-content");
      default:
        return showSection("main-content");
    }
  }

  // Handle route change
  window.addEventListener("hashchange", loadPageFromRoute);
  loadPageFromRoute(); // Initial
});

// Run on every hash change
window.addEventListener("hashchange", updateButtonState);
//#endregion

//#region Interactions with single click on map
map.on('singleclick', async function (evt) {
  objDataLevel = await showFeaturesProps(map, evt, dataLevel);
  // Hide all `.jolly-content` sections first
  document.querySelectorAll('.jolly-content').forEach(el => {
    el.style.display = 'none';
  });
  showSection("data-single-content");
  // // Show relevant sections based on hash and dataLevel
  // if (window.location.hash === '#/stats') {
  //   showSection("stats-content");
  //   // if (dataLevel === 'Province') {
  //   // } else if (dataLevel === 'Municipality') {
  //   //   showSection("stats-content", "data-single-content-mun");
  //   // } else if (dataLevel === 'Neigh') {
  //   //   showSection("stats-content", "data-single-content-neigh");
  //   // }
  // } else {
  //   console.log('ddddd');
    
  //    // fallback
  // }

  // Only update the DOM after relevant section is shown
  if (objDataLevel) {
    await setWinningPartyInfo();
    const nameEl = document.getElementById("name");
    // const nameProvEl = document.getElementById("name-prov");
    // const nameMunEl = document.getElementById("name-mun");
    // const nameNeighEl = document.getElementById("name-neigh");
    const voteTextEl = document.getElementById("textVotePercentage");
    const voteEl = document.getElementById("votePercentage");

    if (nameEl && voteEl) {
      nameEl.textContent = `${objDataLevel.toponym}`;
      console.log(nameEl.textContent);
      
      // nameMunEl.textContent = `${objDataLevel.toponym}`;
      // nameProvEl.textContent = `${objDataLevel.toponym}`;
      // nameNeighEl.textContent = `${objDataLevel.toponym}`;
      // partyEl.textContent = `Party: ${objDataLevel.party}`;
      voteTextEl.textContent = `is the winning party with:`;
      voteEl.textContent = `${objDataLevel.vote.toFixed(2)}%`;
    }
 }
});
//#endregion

//#region Winning party card 
async function setWinningPartyInfo() {
  const partyLogoContainer = document.getElementById("partyLogoContainer");
  if (objDataLevel && objDataLevel.party) {
    const parties = await partyVariableJSON();
    const partyKey = objDataLevel.party.toUpperCase();
    const winningParty = parties.find(p => p.abbreviation == partyKey);
    if (winningParty) {
      partyLogoContainer.innerHTML = `
          <div class="d-flex flex-column align-items-center">
            <img src="${winningParty.logo}"
                alt="${winningParty.abbreviation}_LOGO"
                class="mx-auto d-block"
                style="width: 150px; height: 90px; object-fit: scale-down; margin-bottom: 1px;">
            <span style="font-size: 20px; font-weight: bold;">${winningParty.partyName_eng} (${winningParty.abbreviation})</span>
          </div>
        `;
    } else {
      partyLogoContainer.innerHTML = ""; 
    }
  }
}
//#endregion

//#region Dropdown for parties
async function setPartiesForm() {
  const dropdown = document.getElementById("partyDropdownMenu");
  const parties = await partyVariableJSON();
  parties.forEach(party => {
    const partyItem = document.createElement("a");
    partyItem.href = "#";
    partyItem.className = "dropdown-item d-flex align-items-center gap-2";
    partyItem.innerHTML = `
      <img src="${party.logo}" alt="${party.abbreviation + '_LOGO'}" 
           class="rounded-circle" 
           style="width: 40px; height: 40px; object-fit: scale-down;">
      ${party.partyName_eng} (${party.abbreviation})
    `;
    dropdown.appendChild(partyItem);
  });
}

document.getElementById("partyDropdownMenu").addEventListener("click", async function () {
  const dropdownButton = document.getElementById("partyDropdown");
  event.preventDefault(); // prevent default link behavior
  const clickedItem = event.target.closest("a");
  if (!clickedItem) return;
  const selectedParty = clickedItem.textContent.trim();
  document.querySelectorAll("#partyDropdownMenu a").forEach(item => {
    item.classList.remove("selected");
  });  
  dropdownButton.textContent = selectedParty;
  // Add "selected" class to clicked item
  clickedItem.classList.add("selected");
  if (selectedParty) {
    removeAllLayers(map);
    document.getElementById("legend").style.display = "none";
    //TODO - Add layer based on dataLevel
    map.addLayer(wmsLayerCombinedMunicipality);
  }
});
//#endregion

//#region Dropdown for Municipalities similarities
async function setMunicipalitiesForm() {
  const dropdown = document.getElementById("cityDropdownMenu");
  const cities = await getMunicipalities();
  cities.forEach(city => {
    const cityItem = document.createElement("a");
    cityItem.href = "#";
    cityItem.className = "dropdown-item d-flex align-items-center gap-2";
    cityItem.innerHTML = `
      ${city.city}
    `;
    dropdown.appendChild(cityItem);
  });
}

document.getElementById("cityDropdownMenu").addEventListener("click", async function () {
  const dropdownButton = document.getElementById("cityDropdown");
  event.preventDefault(); // prevent default link behavior
  const clickedItem = event.target.closest("a");
  if (!clickedItem) return;
  const selectedCity = clickedItem.textContent.trim();
  document.querySelectorAll("#cityDropdownMenu a").forEach(item => {
    item.classList.remove("selected");
  });  
  dropdownButton.textContent = selectedCity;
  // Add "selected" class to clicked item
  clickedItem.classList.add("selected");
  const cql = `city='${selectedCity}'`; // adjust attribute_name
  
  wmsLayerSimCity.getSource().updateParams({
    'CQL_FILTER': cql
  });
  const tops = await showSimilarCities(selectedCity);
  const ulElement = document.getElementById("topsCities");
  ulElement.innerHTML = ""; // Clear previous list
  if (tops.length > 0) {
    const citiesArray = tops
      .replace(/[\[\]]/g, '')        // Remove [ and ]
      .split(/,\s?/)                 // Split by comma
      .map(item => item.trim().replace(/^['"]|['"]$/g, '')); 
    
    citiesArray.forEach(city => {
      const li = document.createElement("li");
      li.textContent = city; // Adjust if city is an object (e.g., city.name)
      ulElement.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "No similar cities found.";
    ulElement.appendChild(li);
  }
});
//#endregion

//#region Download buttons
document.getElementById("download-geojson-btn").addEventListener("click", async function (e) {
  e.preventDefault();
  var layer = '';
  var numFeatures = '';
  if (window.location.hash == '#/pro') {
    layer = 'SimCity';
    numFeatures = '10';
  } else {
    switch (dataLevel) {
      case 'Municipality':
        layer = 'combined_municipality';
        numFeatures = '500';
        break;
      case 'Neigh':
        layer = 'combined_neighbourhoods';
        numFeatures = '500';
        break;
      default:
        layer = 'combined_provinces';
        numFeatures = '50';
        break;
    }
  }
  const geojsonURL =
  "http://geoictacademy.nl/geoserver/grp1/ows?" +
  "service=WFS&" +
  "version=1.0.0&" +
  "request=GetFeature&" +
  "typeName=grp1:" + layer + "&" +
  "outputFormat=application/json&" +
  "maxFeatures=" + numFeatures;
  await downloadGeoJSON(geojsonURL, layer);
});

document.getElementById("download-csv-btn").addEventListener("click", async function (e) {
  e.preventDefault();
  var layer = '';
  var numFeatures = '';
  if (window.location.hash == '#/pro') {
    layer = 'SimCity';
    numFeatures = '10';
  } else {
    switch (dataLevel) {
      case 'Municipality':
        layer = 'combined_municipality';
        numFeatures = '500';
        break;
      case 'Neigh':
        layer = 'combined_neighbourhoods';
        numFeatures = '500';
        break;
      default:
        layer = 'combined_provinces';
        numFeatures = '50';
        break;
    }
  }
  const csvURL =
  "http://geoictacademy.nl/geoserver/grp1/ows?" +
  "service=WFS&" +
  "version=1.0.0&" +
  "request=GetFeature&" +
  "typeName=grp1:" + layer + "&" +
  "outputFormat=csv&" +
  "maxFeatures=" + numFeatures;
  await downloadCSV(csvURL, layer);
});
//#endregion

//#region Utility showSection
// Function to show a section and hide others
function showSection(id, contentBelow) {
  document.querySelectorAll('.jolly-content').forEach(el => {
    el.style.display = 'none';
  });
  const target = document.getElementById(id);
  if (target) {
    target.style.display = 'block';
  }
  document.getElementById('topsCities').innerHTML = '';

  // if (contentBelow) {
  //   document.getElementById(contentBelow).style.display = "block";
  // }
}
//#endregion

// if (dataLevel === 'Province') {
//       showSection("stats-content", "data-single-content-prov");
//     } else if (dataLevel === 'Municipality') {
//       showSection("stats-content", "data-single-content-mun");
//     } else if (dataLevel === 'Neigh') {
//       showSection("stats-content", "data-single-content-neigh");
//     }

//#region Charts
getNationalChartConfig().then(config => {
  const ctx = document.getElementById('myChart');
  new Chart(ctx, config);
});
//#endregion

//#region Chart.js register
// Register required components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  BarController,
  BarElement
);
//#endregion



// const country = new VectorLayer({
//     source: new VectorSource({
//     format: new GeoJSON(),
//     url: './src/assets/data/netherlands.geojson',
//     }),
// });

