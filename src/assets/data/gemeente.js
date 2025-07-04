import ImageLayer from "ol/layer/Image";
import VectorLayer from "ol/layer/Vector";
import { ImageWMS, Vector } from "ol/source";
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON';

export const wmsLayerHighestMunicipality = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { LAYERS: 'highest_municipality' },
      serverType: 'geoserver'
  })
});

export const wmsLayerCombinedMunicipality = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { LAYERS: 'combined_municipality' },
      serverType: 'geoserver'
  })
});

export const wmsLayerHighestMunicipalityPerParty = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { LAYERS: 'gemeente_percentage_per_party' },
      serverType: 'geoserver'
  })
});

export const wmsLayerHighestMunicipalityPVV = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { LAYERS: 'gemeente_percentage_pvv' },
      serverType: 'geoserver'
  })
});

export const wmsLayerHighestMunicipalityGL = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { LAYERS: 'gemeente_percentage_per_party' },
      serverType: 'geoserver'
  })
});

export const wmsLayerHighestMunicipalityNSC = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { LAYERS: 'gemeente_percentage_nsc' },
      serverType: 'geoserver'
  })
});

export const wmsLayerListMunicipalitiesUrl = 'http://geoictacademy.nl/geoserver/grp1/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=grp1%3Ahighest_municipality&outputFormat=application%2Fjson&maxFeatures=400';

// add legend of the wms layer
export const legendMunicipalityPVV = 'http://geoictacademy.nl/geoserver/grp1/wms?' +
    'REQUEST=GetLegendGraphic&' +
    'VERSION=1.0.0&' +
    'FORMAT=image/png&' +
    'LAYER=gemeente_percentage_pvv';

// add legend of the wms layer
export const legendMunicipalityGL = 'http://geoictacademy.nl/geoserver/grp1/wms?' +
    'REQUEST=GetLegendGraphic&' +
    'VERSION=1.0.0&' +
    'FORMAT=image/png&' +
    'LAYER=gemeente_percentage_per_party';

  // add legend of the wms layer
export const legendMunicipalityNSC = 'http://geoictacademy.nl/geoserver/grp1/wms?' +
    'REQUEST=GetLegendGraphic&' +
    'VERSION=1.0.0&' +
    'FORMAT=image/png&' +
    'LAYER=gemeente_percentage_nsc';