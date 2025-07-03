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
import TileLayer from 'ol/layer/Tile';
import { fromLonLat, Projection } from 'ol/proj';
import { ImageWMS, XYZ } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {defaults as defaultControls} from 'ol/control/defaults.js';
import { defaults as defaultInteractions, DragPan } from 'ol/interaction';
import {scaleControl} from './src/utils/controls/scale-control.js';
import ImageLayer from 'ol/layer/Image.js';
import { wmsLayerCombinedProvince, wmsLayerHighestProvince } from './src/assets/data/province.js';
import { wmsLayerHighestMunicipality, wmsLayerCombinedMunicipality } from './src/assets/data/gemeente.js';
import { wmsLayerSimCity } from './src/assets/data/similiraties.js';
import { wmsLayerCombinedNeigh, wmsLayerHighestNeigh } from './src/assets/data/neigh.js';
import { hoverFeaturesProps, resetMap, showFeaturesProps } from './src/interactions/actions.js';
import { CENTER_COORDS, removeAllLayers, ZOOM_LEVEL } from './src/utils/helper.js';
import { getNationalChartConfig } from './src/charts/national-chart.js';
import { getDetailChartProvinceConfig } from './src/charts/province-chart.js';
import { getDetailChartMunicipalityConfig } from './src/charts/municipality-chart.js';
import { getDetailChartNeighConfig } from './src/charts/neigh-chart.js';

//#region Map config
const carto = new TileLayer({ 
    source: new XYZ({ 
        url:'http://{1-4}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
    })
});

const projection = new Projection({
  code: 'EPSG:28992',
  // units: 'metric'
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
var dataLevel = 'Province';
document.getElementById("province-btn").addEventListener("click", () => {
  showProvince();
  dataLevel = 'Province';
});
document.getElementById("province-btn").click();
document.getElementById("province-btn").setAttribute("aria-pressed", "true");
// #endregion

//#region Interactions
document.getElementById("municipality-btn").addEventListener("click", () => {
  showMunicipality();
  dataLevel = 'Municipality';
});
document.getElementById("neigh-btn").addEventListener("click", () => {
  showNeigh();
  dataLevel = 'NEIGH';
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
  dataLevel = 'NEIGH';
  // document.querySelectorAll('#data-single-content-prov, #data-single-content-mun, #data-single-content-neigh')
  //     .forEach(el => el.style.display = 'none');
  // resetMap(map); 
}

var objDataLevel = {};

// Function to show a section and hide others
function showSection(id, contentBelow) {
  document.querySelectorAll('.jolly-content').forEach(el => {
    el.style.display = 'none';
  });
  const target = document.getElementById(id);
  if (target) {
    target.style.display = 'block';
  }
  // if (contentBelow) {
  //   document.getElementById(contentBelow).style.display = "block";
  // }
}

document.addEventListener("DOMContentLoaded", () => {
  const statsBtn = document.getElementById("stats-btn");
  const proBtn = document.getElementById("pro-btn");
  const backBtn = document.getElementById("back-btn");
  const downloadBtn = document.getElementById("download-btn");
  downloadBtn.style.display = "none";

  // Button events
  statsBtn.addEventListener("click", () => {
    window.location.hash = "#/stats";
    downloadBtn.style.display = "block";
    document.getElementById("data-single-content").style.display = "none";
    removeAllLayers(map);
    map.addLayer(wmsLayerHighestProvince);
    // showSection("stats-content");
    // showSection("data-single-content-prov");
    // resetMap(map);
  });

  proBtn.addEventListener("click", () => {
    window.location.hash = "#/pro";
    downloadBtn.style.display = "block";
    document.getElementById("data-single-content").style.display = "none";
    removeAllLayers(map);
    map.addLayer(wmsLayerSimCity);
    // showSection("stats-content");
    // resetMap(map);
  });

  backBtn.addEventListener("click", () => {
    window.location.hash = "#/";
    downloadBtn.style.display = "none";
    // showSection("main-content");
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

map.on('singleclick', async function (evt) {
  console.log(dataLevel);
  
  objDataLevel = await showFeaturesProps(map, evt, dataLevel);
  console.log(objDataLevel);

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
    console.log('ffff');
    
    const nameEl = document.getElementById("name");
    // const nameProvEl = document.getElementById("name-prov");
    // const nameMunEl = document.getElementById("name-mun");
    // const nameNeighEl = document.getElementById("name-neigh");
    const partyEl = document.getElementById("winningParty");
    const voteEl = document.getElementById("votePercentage");

    if (nameEl && partyEl && voteEl) {
      nameEl.textContent = `${objDataLevel.toponym}`;
      // nameMunEl.textContent = `${objDataLevel.toponym}`;
      // nameProvEl.textContent = `${objDataLevel.toponym}`;
      // nameNeighEl.textContent = `${objDataLevel.toponym}`;
      partyEl.textContent = `Party: ${objDataLevel.party}`;
      voteEl.textContent = `Vote %: ${objDataLevel.vote}`;
    }
 

// Dynamic logos
const partyInfo = {
  pvv: {
    name: "Party for Freedom (PVV)",
    logo: "https://www.houseofrepresentatives.nl/sites/default/files/styles/small/public/2023-09/Logo%20PVV_tcm181-113708.jpg"
  },
  gl_pvda: {
    name: "Green-Left Labour (GL/PvdA)",
    logo: "https://www.houseofrepresentatives.nl/sites/default/files/styles/small/public/2023-12/GL-PvdA-Logo-transparant.png"
  },
  vvd: {
    name: "People’s Party for Freedom and Democracy (VVD)",
    logo: "https://www.houseofrepresentatives.nl/sites/default/files/styles/small/public/2023-09/vvd_standaard_1080x1080_rond.png"
  },
  nsc: {
    name: "New Social Contract (NSC)",
    logo: "https://www.houseofrepresentatives.nl/sites/default/files/styles/small/public/2023-12/NSC_partijlogo.svg_.png"
  },
  d66: {
    name: "Democrats 66 (D66)",
    logo: "https://www.houseofrepresentatives.nl/sites/default/files/styles/small/public/2023-09/d66_logo_rgb.png"
  },
  bbb: {
    name: "Farmer-Citizen Movement (BBB)",
    logo: "https://www.houseofrepresentatives.nl/sites/default/files/styles/small/public/2025-06/Logo_BBB_GROEN.png"
  },
  cda: {
    name: "Christian Democratic Appeal (CDA)",
    logo: "https://www.houseofrepresentatives.nl/sites/default/files/styles/small/public/2023-09/logo_cda.jpg"
  },
  sp: {
    name: "Socialist Party (SP)",
    logo: "https://www.houseofrepresentatives.nl/sites/default/files/styles/small/public/2023-09/logo_sp.png"
  },
  denk: {
    name: "Political Movement Denk (DENK)",
    logo: "https://www.houseofrepresentatives.nl/sites/default/files/styles/small/public/2023-09/denk-tk.jpg"
  },
  pvdd: {
    name: "Party for the Animals (PvdD)",
    logo: "https://www.houseofrepresentatives.nl/sites/default/files/styles/small/public/2023-09/partij_voor_de_dieren.jpg"
  },
  fvd: {
    name: "Forum for Democracy (FvD)",
    logo: "https://www.houseofrepresentatives.nl/sites/default/files/styles/small/public/2023-09/forum_v_democratie.jpg"
  },
  sgp: {
    name: "Calvinist Political Party (SGP)",
    logo: "https://www.houseofrepresentatives.nl/sites/default/files/styles/small/public/2023-09/logo_sgp_2016.jpg"
  },
  cu: {
    name: "Christian Union (CU)",
    logo: "https://www.houseofrepresentatives.nl/sites/default/files/styles/small/public/2023-09/logo_christenunie_tcm181-104419.gif"
  },
  volt: {
    name: "Volt Netherlands (Volt)",
    logo: "https://www.houseofrepresentatives.nl/sites/default/files/styles/small/public/atoms/images/volt_logo_max37mm1.jpg"
  },
  ja21: {
    name: "Conservative Liberals (JA21)",
    logo: "https://www.houseofrepresentatives.nl/sites/default/files/styles/small/public/2023-09/ja21_logo_rgb.png"
  }
};

const partyLogoContainer = document.getElementById("partyLogoContainer"); // Make sure this exists in your HTML

if (objDataLevel && objDataLevel.party) {
  // Normalize party key: lowercase and replace spaces/slashes with underscores if needed
  const partyKey = objDataLevel.party.toLowerCase()
  const info = partyInfo[partyKey];   
  if (info) {
    partyLogoContainer.innerHTML = `
        <div class="d-flex flex-column align-items-center">
          <img src="${info.logo}"
              alt="${info.name} Logo"
              class="mx-auto d-block"
              style="width: 150px; height: 90px; object-fit: scale-down; margin-bottom: 1px;">
          <span style="font-size: 20px; font-weight: bold;">Party for Freedom (PVV)</span>
        </div>
      `;
  } else {
    partyLogoContainer.innerHTML = ""; // Clear logo if not PVV
  }
}
 }
});


// if (dataLevel === 'Province') {
//       showSection("stats-content", "data-single-content-prov");
//     } else if (dataLevel === 'Municipality') {
//       showSection("stats-content", "data-single-content-mun");
//     } else if (dataLevel === 'Neigh') {
//       showSection("stats-content", "data-single-content-neigh");
//     }

getNationalChartConfig().then(config => {
  const ctx = document.getElementById('myChart');
  new Chart(ctx, config);
});

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

