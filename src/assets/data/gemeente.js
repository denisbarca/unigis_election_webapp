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

export const wmsLayerListMunicipalitiesUrl = 'http://geoictacademy.nl/geoserver/grp1/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=grp1%3Ahighest_municipality&outputFormat=application%2Fjson&maxFeatures=400';