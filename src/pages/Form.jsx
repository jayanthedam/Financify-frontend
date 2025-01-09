import React, { useState, useEffect } from 'react';

const assetTypes = [
  { value: 'gold', label: 'Gold Investment' },
  { value: 'stocks', label: 'Stock Market' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'realestate', label: 'Real Estate' },
  { value: 'fd', label: 'Fixed Deposits' }
];

const Form = () => {
  const [selectedAsset, setSelectedAsset] = useState('');
  const [tickers, setTickers] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState('');

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const response = await fetch('https://api.polygon.io/v3/reference/tickers?active=true&limit=100&apiKey=nZQbO3Mc2QJoMAEyVZLwO8_w7tdx_h6H');
        const data = await response.json();
        console.log(data); // Check the data structure
        setTickers(data.results || []); // Make sure 'results' is available
      } catch (error) {
        console.error('Error fetching tickers:', error);
      }
    };

    fetchTickers();
  }, []);

  const GoldForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity (grams)</label>
        <input
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          placeholder="Enter quantity in grams"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
        <input
          type="date"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Purchase Price (per gram)</label>
        <input
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          placeholder="Enter price per gram"
        />
      </div>
    </div>
  );

  const StocksForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Company Name</label>
        <select
          id="stock-select"
          value={selectedTicker}
          onChange={(e) => setSelectedTicker(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        >
          <option value="">Select a company</option>
          {tickers.map((ticker) => (
            <option key={ticker.ticker} value={ticker.ticker}>
              {ticker.name} ({ticker.ticker})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Number of Shares</label>
        <input
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          placeholder="Enter number of shares"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Purchase Price (per share)</label>
        <input
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          placeholder="Enter price per share"
        />
      </div>
    </div>
  );

  const CryptoForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Cryptocurrency</label>
        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
          <option value="">Select cryptocurrency</option>
          <option value="BTC">Bitcoin (BTC)</option>
          <option value="ETH">Ethereum (ETH)</option>
          <option value="USDT">Tether (USDT)</option>
          <option value="BNB">Binance Coin (BNB)</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          step="0.000001"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          placeholder="Enter quantity"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
        <input
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          placeholder="Enter purchase price"
        />
      </div>
    </div>
  );

  const RealEstateForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Property Type</label>
        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
          <option value="">Select property type</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="land">Land</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Area (sq. ft)</label>
        <input
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          placeholder="Enter area in square feet"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
        <input
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          placeholder="Enter purchase price"
        />
      </div>
    </div>
  );

  const FDForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Principal Amount</label>
        <input
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          placeholder="Enter principal amount"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
        <input
          type="number"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          placeholder="Enter interest rate"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Maturity Period (Years)</label>
        <input
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          placeholder="Enter maturity period"
        />
      </div>
    </div>
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted:', selectedAsset, selectedTicker);
  };

  const renderForm = () => {
    switch (selectedAsset) {
      case 'gold':
        return <GoldForm />;
      case 'stocks':
        return <StocksForm />;
      case 'crypto':
        return <CryptoForm />;
      case 'realestate':
        return <RealEstateForm />;
      case 'fd':
        return <FDForm />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="asset-type" className="block text-sm font-medium text-gray-700">Asset Type</label>
          <select
            id="asset-type"
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="mt-1 mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          >
            <option value="">Select an asset type</option>
            {assetTypes.map((asset) => (
              <option key={asset.value} value={asset.value}>
                {asset.label}
              </option>
            ))}
          </select>
        </div>

        {renderForm()}

        <div className="mt-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
