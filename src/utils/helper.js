import { Chart, plugins, scales } from 'chart.js';

export const ZOOM_LEVEL = 7.25;
export const CENTER_COORDS = [5.3872, 52.1561]

// Set global chart properties
Chart.defaults.color = 'white';
Chart.defaults.borderColor = 'rgb(0, 0, 0)';
Chart.defaults.borderWidth = 0.5;
Chart.defaults.barThickness = 10;

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


export function setProxyForUrl(url) {
    const proxy = 'https://corsproxy.io/?';
    return proxy + encodeURIComponent(url);
}

export function removeAllLayers(map) {
    const layers = map.getAllLayers();
    layers.forEach(layer => {
        map.removeLayer(layer);
    });
}

export async function partyVariable() {
  const response = await fetch('src/assets/data/parties.json');
  const parties = await response.json();
  return{
    abbreviation: parties.map(p => p.abbreviation),
    nationalResult: parties.map(p => p.nationalResult),
    hex: parties.map(p => p.hex),
  }
}
