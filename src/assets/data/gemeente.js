import ImageLayer from "ol/layer/Image";
import { ImageWMS } from "ol/source";

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