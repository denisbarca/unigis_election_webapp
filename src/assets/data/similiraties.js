import ImageLayer from "ol/layer/Image";
import { ImageWMS } from "ol/source";

export const wmsLayerSimCity = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { 
        LAYERS: 'SimCity',
        // CQL_FILTER: "attribute_name='value1'"
      },
      ratio: 1,
      serverType: 'geoserver'
  })
});