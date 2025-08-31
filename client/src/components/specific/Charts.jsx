import { Line, Doughnut } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
} from "chart.js";
import { orange, orangeLight, purple, purpleLight } from "../../constants/color";
import { getLast7Days } from "../../lib/features";

ChartJS.register(
  CategoryScale,
  Tooltip,
  Filler,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend
);

const labels = getLast7Days();
const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

function LineChart({ value = [] }) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Messages",
        backgroundColor: purpleLight,
        borderColor: purple,
        fill: true,
        data: value,
      },
    ],
  };
  return <Line data={data} options={lineChartOptions} />;
}

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 120,
};

function DoughnutChart({ value = [], labels = [] }) {
  const data = {
    labels: labels,
    datasets: [
      {
        backgroundColor: [purpleLight, orangeLight],
        borderColor: [purple, orange],
        data: value,
        offset:40,
        hoverBackgroundColor: [purple, orange],
      },
    ],
  };
  return <Doughnut style={{zIndex:10}} data={data} options={doughnutChartOptions} />;
}

export { LineChart, DoughnutChart };
