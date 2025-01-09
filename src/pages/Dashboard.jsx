import React from 'react';
import { useAuth } from '../context/AuthContext';
import ReactApexChart from 'react-apexcharts';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
        <p className="text-gray-600">Please log in to view your dashboard.</p>
      </div>
    );
  }
  const assetAllocationOptions = {
    labels: ['Stocks', 'Gold', 'Liquid Assets'],
    colors: ['#36A2EB', '#FFCE56', '#FF6384'],
    legend: { position: 'bottom' }
  };
  const assetAllocationSeries = [10000, 30000, 10000];

  // Data and config for the Line chart
  const stockValueOptions = {
    chart: { type: 'line' },
    stroke: { curve: 'smooth' },
    colors: ['#36A2EB'],
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
  };
  const stockValueSeries = [
    {
      name: 'Stock Value Over Time',
      data: [8000, 9000, 12000, 15000, 13000, 14000],
    },
  ];

  // Data and config for the Bar chart
  const assetGrowthOptions = {
    chart: { type: 'bar' },
    colors: ['#36A2EB', '#FFCE56', '#FF6384'],
    xaxis: { categories: ['Stocks', 'Gold', 'Liquid Assets'] },
  };
  const assetGrowthSeries = [
    {
      name: 'Asset Growth Comparison',
      data: [10000, 30000, 10000],
    },
  ];

  // Data and config for the Radar chart
  const riskProfileOptions = {
    chart: { type: 'radar' },
    colors: ['rgba(54, 162, 235, 0.5)'],
    xaxis: { categories: ['Liquidity', 'Risk', 'Stability', 'Growth'] },
  };
  const riskProfileSeries = [
    {
      name: 'Risk Profile',
      data: [3, 2, 4, 5],
    },
  ];

  // Data and config for additional charts (Area and Scatter)
  const areaChartOptions = {
    chart: { type: 'area' },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    colors: ['#FF6347'],
  };
  const areaChartSeries = [
    {
      name: 'Investment Over Time',
      data: [5000, 7000, 8000, 10000, 12000, 15000],
    },
  ];

  const scatterChartOptions = {
    chart: { type: 'scatter' },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    colors: ['#32CD32'],
  };
  const scatterChartSeries = [
    {
      name: 'Investment Volatility',
      data: [3000, 5000, 7000, 8000, 10000, 13000],
    },
  ];

  const bubbleChartOptions = {
    chart: { type: 'bubble' },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    colors: ['#FFD700'],
  };
  const bubbleChartSeries = [
    {
      name: 'Risk vs Return',
      data: [
        [1, 8000, 10],
        [2, 10000, 15],
        [3, 12000, 25],
        [4, 15000, 35],
        [5, 13000, 30],
        [6, 14000, 40],
      ],
    },
  ];

  return (
    <div className="p-2 space-y-6">
      {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold">Total Assets</h3>
          <p className="text-2xl mt-2">₹50,000</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold">Stocks</h3>
          <p className="text-2xl mt-2">₹10,000</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold">Gold</h3>
          <p className="text-2xl mt-2">₹300,000</p>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold">Liquid Assets</h3>
          <p className="text-2xl mt-2">₹10,000</p>
        </div>
      </div> */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Assets', value: '₹50,000', bg: 'bg-blue-500' },
          { label: 'Stocks', value: '₹10,000', bg: 'bg-green-500' },
          { label: 'Gold', value: '₹30,000', bg: 'bg-yellow-500' },
          { label: 'Liquid Assets', value: '₹10,000', bg: 'bg-purple-500' },
        ].map((item, index) => (
          <div
            key={index}
            className={`${item.bg} text-white p-6 rounded-xl shadow-lg hover:scale-105 transform transition-all`}
          >
            <h3 className="text-lg font-semibold">{item.label}</h3>
            <p className="text-2xl font-bold mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Doughnut Chart - Asset Allocation */}
        <div className="bg-white p-2 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold mb-4">Asset Allocation</h3>
          <ReactApexChart
            options={assetAllocationOptions}
            series={assetAllocationSeries}
            type="pie"
            height={250}
          />
        </div>

        {/* Line Chart - Stock Value Over Time */}
        <div className="bg-white p-2 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold mb-4">Stock Value Over Time</h3>
          <ReactApexChart
            options={stockValueOptions}
            series={stockValueSeries}
            type="line"
            height={250}
          />
        </div>

        {/* Bar Chart - Asset Growth Comparison */}
        <div className="bg-white p-2 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold mb-4">Asset Growth Comparison</h3>
          <ReactApexChart
            options={assetGrowthOptions}
            series={assetGrowthSeries}
            type="bar"
            height={250}
          />
        </div>

        {/* Radar Chart - Risk Profile */}
        <div className="bg-white p-2 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold mb-4">Risk Profile</h3>
          <ReactApexChart
            options={riskProfileOptions}
            series={riskProfileSeries}
            type="radar"
            height={250}
          />
        </div>

        {/* Area Chart - Investment Over Time */}
        <div className="bg-white p-2 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold mb-4">Investment Over Time</h3>
          <ReactApexChart
            options={areaChartOptions}
            series={areaChartSeries}
            type="area"
            height={250}
          />
        </div>

        {/* Scatter Chart - Investment Volatility */}
        <div className="bg-white p-2 rounded-lg shadow-md">
          <h3 className="text-sm font-semibold mb-4">Investment Volatility</h3>
          <ReactApexChart
            options={scatterChartOptions}
            series={scatterChartSeries}
            type="scatter"
            height={250}
          />
        </div>
      </div>

      {/* Latest Investments Table */}
      <div className="bg-white p-4 rounded-lg shadow-md mt-6">
        <h3 className="text-sm font-semibold mb-4">Latest Investments</h3>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Investment</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Stocks</td>
              <td className="border px-4 py-2">₹10,000</td>
              <td className="border px-4 py-2">01/10/2024</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Gold</td>
              <td className="border px-4 py-2">₹30,000</td>
              <td className="border px-4 py-2">01/10/2024</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Liquid Assets</td>
              <td className="border px-4 py-2">₹10,000</td>
              <td className="border px-4 py-2">01/10/2024</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;