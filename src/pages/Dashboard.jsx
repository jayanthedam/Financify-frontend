import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ReactApexChart from 'react-apexcharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalStockValue, setTotalStockValue] = useState(0);
  const [totalCryptoValue, setTotalCryptoValue] = useState(0);
  const [goldPrice, setGoldPrice] = useState(0);
  const [historicalStockPrices, setHistoricalStockPrices] = useState({});

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch(`${import.meta.env.RENDER_URL}/api/assets`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch assets');
        }
        setAssets(data);
        fetchStockPrices();
        fetchCryptoPrices(data);
        fetchHistoricalStockPrices();
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchStockPrices = async () => {
      try {
        const response = await fetch(import.meta.env.RENDER_URL+'/assets/stock-prices', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        setTotalStockValue(data.totalStockValue);
      } catch (error) {
        console.error('Error fetching stock prices:', error);
      }
    };

    const fetchCryptoPrices = async (assets) => {
      try {
        const cryptoAssets = assets.filter(asset => asset.assetType === 'crypto');
        let totalValue = 0;

        for (const asset of cryptoAssets) {
          if (!asset.details) continue;
          const response = await fetch(`${import.meta.env.RENDER_URL}/api/assets/crypto-prices`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          const data = await response.json();
          totalValue += data.totalCryptoValue;
        }

        setTotalCryptoValue(totalValue);
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
      }
    };

    const fetchHistoricalStockPrices = async () => {
      try {
        const response = await fetch(import.meta.env.RENDER_URL+'/api/assets/historical-stock-prices', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        setHistoricalStockPrices(data);
      } catch (error) {
        console.error('Error fetching historical stock prices:', error);
      }
    };

    const fetchGoldPrice = async () => {
      try {
        const response = await fetch(import.meta.env.RENDER_URL+'/api/gold-price');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data) {
          throw new Error('No data received');
        }
        setGoldPrice(data.price_gram_24k);
      } catch (error) {
        console.error('Error fetching gold price:', error);
      }
    };

    fetchAssets();
    fetchGoldPrice();
  }, [user.token]);

  if (!user) {
    return (
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
        <p className="text-gray-600">Please log in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  const assetTypes = ['gold', 'stocks', 'crypto', 'realestate', 'fd'];
  const assetLabels = {
    gold: 'Gold',
    stocks: 'Stocks',
    crypto: 'Cryptocurrency',
    realestate: 'Real Estate',
    fd: 'Fixed Deposits',
  };

  const assetAllocation = assetTypes.map((type) => {
    if (type === 'stocks') {
      return { type, total: totalStockValue };
    }
    if (type === 'crypto') {
      return { type, total: totalCryptoValue };
    }
    if (type === 'gold') {
      const goldAssets = assets.filter(asset => asset.assetType === 'gold');
      const totalGoldGrams = goldAssets.reduce((sum, asset) => sum + asset.details.quantity, 0);
      return { type, total: totalGoldGrams * goldPrice };
    }
    
    const total = assets
      .filter((asset) => asset.assetType === type)
      .reduce(
        (sum, asset) =>
          sum +
          (asset.details.quantity ||
            asset.details.cryptoQuantity ||
            asset.details.area ||
            asset.details.principalAmount),
        0,
      );
    return { type, total };
  });

  const totalAssets = assetAllocation.reduce((sum, asset) => sum + (asset.total || 0), 0);

  const assetAllocationOptions = {
    labels: assetAllocation.map((a) => assetLabels[a.type]),
    colors: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0', '#9966FF'],
    legend: { position: 'bottom' },
  };
  const assetAllocationSeries = assetAllocation.map((a) => a.total);

  const barChartOptions = {
    chart: { type: 'bar' },
    xaxis: { categories: assetAllocation.map((a) => assetLabels[a.type]) },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "₹ " + val.toLocaleString();
        }
      }
    }
  };

  const barChartSeries = [{
    name: 'Asset Value',
    data: assetAllocation.map((a) => a.total)
  }];

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 justify-center items-center">
        {/* Total Assets Card */}
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg flex flex-col items-center">
          <h3 className="text-lg font-semibold">Total Assets</h3>
          <p className="text-2xl font-bold mt-2">₹ {Math.floor(totalAssets).toLocaleString()}.0</p>
        </div>

        {/* Dynamically Rendered Asset Allocation Cards */}
        {assetAllocation.map((asset, index) => (
          <div key={index} className="bg-white text-black p-4 rounded-lg shadow-lg flex flex-col items-center">
            <h3 className="text-lg font-semibold">{assetLabels[asset.type]}</h3>
            <p className="text-2xl font-bold mt-2">₹ {Math.floor(asset.total).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
          <ReactApexChart
            options={assetAllocationOptions}
            series={assetAllocationSeries}
            type="pie"
            height={350}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Value of Each Asset</h3>
          <ReactApexChart
            options={barChartOptions}
            series={barChartSeries}
            type="bar"
            height={350}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Historical Stock Prices</h3>
          <ReactApexChart
            options={{
              chart: { type: 'line' },
              stroke: { curve: 'smooth' },
              xaxis: { type: 'datetime' },
            }}
            series={Object.keys(historicalStockPrices).map(ticker => ({
              name: ticker,
              data: historicalStockPrices[ticker].map(entry => ({
                x: new Date(entry.t),
                y: entry.c,
              })),
            }))}
            type="line"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;