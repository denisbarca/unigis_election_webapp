import { Chart, plugins, scales } from 'chart.js';
import { wmsLayerListMunicipalitiesUrl } from '../assets/data/gemeente';

// Settings for Map visualization
export const ZOOM_LEVEL = 7;
export const CENTER_COORDS = [5.3872, 52.1561]

// Setting for Chart.js graph
Chart.defaults.color = 'white';
Chart.defaults.borderColor = 'rgb(0, 0, 0)';
Chart.defaults.borderWidth = 0.5;
Chart.defaults.barThickness = 15;
// Hide all x-axes
Chart.defaults.scales.category = {
  grid: {
    display: false
  }
};
// For all y-axes
Chart.defaults.scales.linear = {
  grid: {
    display: true,
    color: '#d3d3d3'
  },
};

// Proxy for CORS Policy call
export function setProxyForUrl(url) {
  const proxy = 'https://corsproxy.io/?';
  return proxy + encodeURIComponent(url);
}

// Utility for removing all layers on view
export function removeAllLayers(map) {
  const layers = map.getAllLayers();
  layers.forEach(layer => {
    console.log(layer);
    
      map.removeLayer(layer);
  });
}

// Utility for removing all dynamic content on view
export function removeAllDynamicContent() {
  document.querySelectorAll('.jolly-content')
    .forEach(el => el.style.display = 'none');
}

// Utility for loading all data from .JSON file
export async function partyVariableJSON() {
  const response = await fetch('/data/parties.json');
  const parties = await response.json();
  return parties;
}

export async function partyVariableObjects() {
  const response = await fetch('/data/parties.json');
  const parties = await response.json();
  return{
    abbreviation: parties.map(p => p.abbreviation),
    nationalResult: parties.map(p => p.nationalResult),
    hex: parties.map(p => p.hex),
    partyName: parties.map(p => p.partyName),
    partyNameEng: parties.map(p => p.partyName_eng),
    logo: parties.map(p => p.logo),
    altImage: parties.map(p => p.abbreviation + '_LOGO'),
    website: parties.map(p => p.website)
  }
}

// Utility for municipalities list
export async function getMunicipalities() {
  const url = wmsLayerListMunicipalitiesUrl;
  if (url) {
    try {
      const response = await fetch(setProxyForUrl(url));
      const data = await response.json();
      if (!data.features || data.features.length === 0) {
        alert('No features found.');
        return null;
      }
      // Extract only fid and city from each feature
      const result = data.features.map(feature => {
        const { fid, city } = feature.properties;
        return { fid, city };
      });
      return result;
    } catch (error) {
      console.error('Error fetching municipalities:', error);
      return null;
    }
  }
}

// Utility for cleaning dropdown values
export function clearDropdown(id, defaultText) {
  const dropdownButton = document.getElementById(id);
  if (dropdownButton.textContent != defaultText)
    dropdownButton.textContent = defaultText;
}

// Download data
export async function downloadGeoJSON(url, layer) {
  const response = await fetch(url);
  const geojson = await response.json();

  const blob = new Blob([JSON.stringify(geojson)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  const datetime = new Date().toISOString().replace(/[:\-T]/g, '').slice(0, 15);
  link.download = layer + '_' + datetime + 'geojson';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function downloadCSV(url, layer) {
  const response = await fetch(url);
  const csvText = await response.text(); // CSV is plain text

  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  const datetime = new Date().toISOString().replace(/[:\-T]/g, '').slice(0, 15);
  link.download = layer + '_' + datetime + 'csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


