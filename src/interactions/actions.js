import { wmsLayerHighestMunicipality, wmsLayerCombinedMunicipality } from '../assets/data/gemeente.js';
import { wmsLayerCombinedNeigh, wmsLayerHighestNeigh } from '../assets/data/neigh.js';
import { wmsLayerCombinedProvince, wmsLayerHighestProvince } from '../assets/data/province.js';
import { wmsLayerSimCity } from '../assets/data/similiraties.js';
import { CENTER_COORDS, setProxyForUrl, ZOOM_LEVEL } from '../utils/helper.js';


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
    'EPSG:28992',
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

export async function showSimilarCities(selectedCity) {
  const cql = `city='${selectedCity}'`; // Replace 'city' with the correct attribute name
  const wfsUrl = `http://geoictacademy.nl/geoserver/grp1/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=grp1%3ASimCity&outputFormat=application%2Fjson&maxFeatures=400&CQL_FILTER=${encodeURIComponent(cql)}`;
  if (wfsUrl) {
    try {
      const response = await fetch(wfsUrl);
      const data = await response.json();
      if (data.features.length > 0) {
        return data.features[0].properties.Top5_Sim;
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

export async function showFeaturesProps(map, evt, dataLevel) {
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