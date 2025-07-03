import { Chart, plugins, scales } from 'chart.js';
import { partyVariableObjects } from '../utils/helper.js';

Chart.defaults.color = "white";
export async function getNationalChartConfig() {
  const partiesInfo = await partyVariableObjects();
  return {
    type: 'bar',
    data: {
      labels: partiesInfo.abbreviation,
      datasets: [{
        label: '',
        data: partiesInfo.nationalResult,
        backgroundColor: partiesInfo.hex,
        // borderColor: 'rgb(0, 0, 0)',
        borderWidth: 0.5,
        // barThickness: 15,
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
