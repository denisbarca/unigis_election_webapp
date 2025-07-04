import ImageLayer from "ol/layer/Image";
import { ImageWMS } from "ol/source";

export const wmsLayerHighestNeigh = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { LAYERS: 'highest_neighbourhood' },
      serverType: 'geoserver'
  })
});

export const wmsLayerCombinedNeigh = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { LAYERS: 'combined_neighbourhoods' },
      serverType: 'geoserver'
  })
});

export const wmsLayerHighestNeighPerParty = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { LAYERS: 'neighborhoods_percentage_per_party' },
      serverType: 'geoserver'
  })
});

export const wmsLayerHighestNeighPVV = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { LAYERS: 'neighbourhood_perc_pvv' },
      serverType: 'geoserver'
  })
});

export const wmsLayerHighestNeighGL = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { LAYERS: 'neighbourhood_perc_gl_pvda' },
      serverType: 'geoserver'
  })
});

export const wmsLayerHighestNeighNSC = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { LAYERS: 'neighbourhood_perc_nsc' },
      serverType: 'geoserver'
  })
});