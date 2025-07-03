// import { wmsLayerHighestProvince } from './src/assets/data/province.js';
// import { wmsLayerHighestMunicipality } from './src/assets/data/gemeente.js';
// import { wmsLayerHighestNeigh } from './src/assets/data/neigh.js';
import { centroid } from 'ol/interaction/Pointer.js';
import { wmsLayerHighestMunicipality, wmsLayerCombinedMunicipality } from '../assets/data/gemeente.js';
import { wmsLayerCombinedNeigh, wmsLayerHighestNeigh } from '../assets/data/neigh.js';
import { wmsLayerCombinedProvince, wmsLayerHighestProvince } from '../assets/data/province.js';
import { CENTER_COORDS, setProxyForUrl, ZOOM_LEVEL } from '../utils/helper.js';


// export function showProvince() {
//   map.removeLayer(wmsLayerHighestMunicipality);
//   map.removeLayer(wmsLayerHighestNeigh);
//   map.addLayer(wmsLayerHighestProvince);
// }

// export function showMunicipality() {
//   map.removeLayer(wmsLayerHighestProvince);
//   map.removeLayer(wmsLayerHighestNeigh);
//   map.addLayer(wmsLayerHighestMunicipality);
// }

// export function showNeigh() {
//   map.removeLayer(wmsLayerHighestProvince);
//   map.removeLayer(wmsLayerHighestMunicipality);
//   map.addLayer(wmsLayerHighestNeigh);
// }

export function resetMap(map) {
  console.log(ZOOM_LEVEL, CENTER_COORDS);
  
  map.getView().setZoom(ZOOM_LEVEL);
  map.getView().setCenter(CENTER_COORDS);
}

function setLayer(dataLevel) {
  switch (dataLevel) {
    case 'Municipality':
      return {
        layerName: 'grp1:highest_municipality',
        layer: wmsLayerHighestMunicipality,
        entity: 'city'
      }
    case 'Neigh':
      return {
        layerName: 'grp1:highest_neighbourhood',
        layer: wmsLayerHighestNeigh,
        entity: 'neighbourhood'
      }
    default:
      return {        
        layerName: 'grp1:highest_province',
        layer: wmsLayerHighestProvince,
        entity: 'province'
      }
  }
}

export async function showFeaturesProps(map, evt, dataLevel) {
  let layerInfo = setLayer(dataLevel);

  const view = map.getView();
  const viewResolution = view.getResolution();
  const url = layerInfo.layer.getSource().getFeatureInfoUrl(
    evt.coordinate,
    viewResolution,
    'EPSG:3857',
    {
      'INFO_FORMAT': 'application/json',
      'QUERY_LAYERS': layerInfo.layerName,
    }
  );
  console.log(url);
  

  if (url) {
    try {
      const response = await fetch(setProxyForUrl(url));
      console.log(response);
      
      const data = await response.json();
      console.log(data);
      
      if (data.features.length > 0) {
        const props = data.features[0].properties;
        return {
          toponym: props[layerInfo.entity],
          party: props.party,
          vote: props.percentage_votes,
          // top5_party: Object.fromEntries(
          //   Object.entries(obj).filter(([key]) => !excludedKeys.includes(key))
          // )
        };
      } else {
        alert('No feature found at clicked location.');
        return null;
      }
    } catch (error) {
      console.error('GetFeatureInfo error:', error);
      return null;
    }
  }

  return null;
}

export async function hoverFeaturesProps(map, evt, dataLevel) {
  let layerInfo = setLayer(dataLevel);

  const view = map.getView();
  const viewResolution = view.getResolution();
  const url = layerInfo.layer.getSource().getFeatureInfoUrl(
    evt.coordinate,
    viewResolution,
    'EPSG:28992',
    {
      'INFO_FORMAT': 'application/json',
      'QUERY_LAYERS': layerInfo.layerName,
    }
  );
  console.log(url);
  

  const tooltip = document.getElementById("hover-tooltip");

  if (url) {
    try {
      const response = await fetch(setProxyForUrl(url));
      const data = await response.json();

      if (data.features.length > 0) {
        const props = data.features[0].properties;
        const province = props.province;

        // Position tooltip near mouse
        tooltip.style.left = `${evt.originalEvent.pageX + 10}px`;
        tooltip.style.top = `${evt.originalEvent.pageY + 10}px`;
        tooltip.style.display = 'block';
        tooltip.textContent = province;
      } else {
        tooltip.style.display = 'none';
      }
    } catch (e) {
      tooltip.style.display = 'none';
    }
  } else {
    tooltip.style.display = 'none';
  }
}
