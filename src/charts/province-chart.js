import { Chart, plugins, scales } from 'chart.js';
import { partyVariableObjects } from '../utils/helper.js';
import { showFeaturesProps } from '../interactions/actions.js';

export async function getDetailChartProvinceConfig() {
    console.log('detail');
    
  const partiesInfo = await partyVariableObjects();
  const featuresInfo = await showFeaturesProps();
  console.log(featuresInfo);
  
  return {
    type: 'bar',
    data: {
      labels: partiesInfo.abbreviation,
      datasets: [{
        label: '',
        data: partiesInfo.nationalResult,
        backgroundColor: partiesInfo.hex,
        borderColor: 'rgb(0, 0, 0)',
        borderWidth: 0.5,
        barThickness: 10,
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false,
        }        
      },
      scales: {
        x: {
          grid: {
            color: "lightgray"
          }
        },
        y: {
          grid: {
            color: "lightgray"
          }
        }
      }
    },
  };
}