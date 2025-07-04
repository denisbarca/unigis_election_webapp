import ImageLayer from "ol/layer/Image";
import VectorLayer from "ol/layer/Vector";
import { ImageWMS } from "ol/source";
import VectorSource from "ol/source/Vector";
import GeoJSON from 'ol/format/GeoJSON';

const proxy = 'https://corsproxy.io/?';

// export const wmsLayerHighestProvince = new VectorLayer({
//   source: new VectorSource({
//       url: proxy + encodeURIComponent(
//         'http://geoictacademy.nl/geoserver/grp1/ows?service=WFS&' +
//         'version=1.0.0&request=GetFeature&typeName=grp1%3Ahighest_province&' +
//         'outputFormat=application%2Fjson&maxFeatures=50' + 
//         'bbox=' + 
//         extent.join(',') +
//         ',EPSG:28992'
//       ),
//       strategy: bboxStrategy,
//       // url: 'http://geoictacademy.nl/geoserver/grp1/wms',
//       // params: { LAYERS: 'highest_province' },
//       // serverType: 'geoserver',
//       // format: new GeoJSON()
//       format: new GeoJSON()
//   })
// });

export const wmsLayerCombinedProvince = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { LAYERS: 'combined_provinces' },
      serverType: 'geoserver',
      
  })
});

export const wmsLayerHighestProvince = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { LAYERS: 'highest_province',
        // STYLES: 
       },
      serverType: 'geoserver',
      
  })
});

export const wmsLayerHighestProvincePerParty = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { LAYERS: 'provinces_percentage_per_party' },
      serverType: 'geoserver'
  })
});

export const wmsLayerHighestProvincePVV = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { LAYERS: 'provinces_perc_pvv' },
      serverType: 'geoserver'
  })
});

export const wmsLayerHighestProvinceGL = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { LAYERS: 'province_perc_gl_pvda' },
      serverType: 'geoserver'
  })
});

export const wmsLayerHighestProvinceNSC = new ImageLayer({
  source: new ImageWMS({
      url: 'http://geoictacademy.nl/geoserver/grp1/wms',
      params: { LAYERS: 'provinces_perc_nsc' },
      serverType: 'geoserver'
  })
});

// add legend of the wms layer
export const legendProvincePVV = 'http://geoictacademy.nl/geoserver/grp1/wms?' +
    'REQUEST=GetLegendGraphic&' +
    'VERSION=1.0.0&' +
    'FORMAT=image/png&' +
    'LAYER=provinces_perc_pvv';

// add legend of the wms layer
export const legendProvinceGL = 'http://geoictacademy.nl/geoserver/grp1/wms?' +
    'REQUEST=GetLegendGraphic&' +
    'VERSION=1.0.0&' +
    'FORMAT=image/png&' +
    'LAYER=province_perc_gl_pvda';

  // add legend of the wms layer
export const legendProvinceNSC = 'http://geoictacademy.nl/geoserver/grp1/wms?' +
    'REQUEST=GetLegendGraphic&' +
    'VERSION=1.0.0&' +
    'FORMAT=image/png&' +
    'LAYER=provinces_perc_nsc';

// export const urlProvince = function(evt, viewResolution) {
//   console.log(
//   ));
  
//   wmsLayerHighestProvince.getSource().getFeatureInfoUrl(
//   evt.coordinate,
//   viewResolution,
//   'EPSG:28992',
//   // {
//   //   'INFO_FORMAT': 'application/json', // Or 'text/html' for simple popup
//   //   'QUERY_LAYERS': 'grp1:highest_province'
//   // }
// )};