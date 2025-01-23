import React, { useState, useEffect, useCallback } from 'react';
import { Formik, Form, Field } from 'formik';
import { useAuth } from '../context/AuthContext';
import debounce from 'lodash.debounce';

const assetTypes = [
  { value: 'gold', label: 'Gold Investment' },
  { value: 'stocks', label: 'Stock Market' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'realestate', label: 'Real Estate' },
  { value: 'fd', label: 'Fixed Deposits' }
];

const CustomInput = ({ field, form, label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      {...field}
      {...props}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
    />
  </div>
);

const CustomSelect = ({ field, form, label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      {...field}
      {...props}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const AssetForm = () => {
  const { user } = useAuth();
  const [selectedAsset, setSelectedAsset] = useState('');
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTickers = async (query) => {
    try {
      const response = await fetch(`https://finnhub.io/api/v1/search?q=${query}&token=cu2j6i1r01qh0l7hcn00cu2j6i1r01qh0l7hcn0g`);
      const data = await response.json();
      setTickers(data.result || []);
    } catch (error) {
      console.error('Error fetching tickers:', error);
    }
  };

  const debouncedFetchTickers = useCallback(debounce(fetchTickers, 300), []);

  useEffect(() => {
    if (searchQuery) {
      debouncedFetchTickers(searchQuery);
    } else {
      setTickers([]);
    }
  }, [searchQuery, debouncedFetchTickers]);

  const getInitialValues = () => {
    switch (selectedAsset) {
      case 'gold':
        return {
          quantity: '',
          purchaseDate: '',
          pricePerGram: ''
        };
      case 'stocks':
        return {
          ticker: '',
          shares: '',
          pricePerShare: ''
        };
      case 'crypto':
        return {
          cryptocurrency: '',
          cryptoQuantity: '',
          cryptoPrice: ''
        };
      case 'realestate':
        return {
          propertyType: '',
          area: '',
          purchasePrice: ''
        };
      case 'fd':
        return {
          principalAmount: '',
          interestRate: '',
          maturityPeriod: ''
        };
      default:
        return {};
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(import.meta.env.RENDER_URL+'/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          assetType: selectedAsset,
          details: values
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save asset');
      }

      await response.json();
      resetForm();
      setSelectedAsset('');
      alert('Asset saved successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderFields = () => {
    switch (selectedAsset) {
      case 'gold':
        return (
          <div className="space-y-4">
            <Field
              name="quantity"
              type="number"
              label="Quantity (grams)"
              component={CustomInput}
              placeholder="Enter quantity in grams" 
              required
            />
            <Field
              name="purchaseDate"
              type="date"
              label="Purchase Date"
              component={CustomInput}

            />
            {/* <Field
              name="pricePerGram"
              type="number"
              label="Purchase Price (per gram)"
              component={CustomInput}
              placeholder="Enter price per gram"
            /> */}
          </div>
        );

      case 'stocks':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Search Company</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                placeholder="Type to search..."
              />
            </div>
            <Field
              name="ticker"
              label="Company Name"
              component={CustomSelect}
              options={tickers.map(ticker => ({
                value: ticker.symbol,
                label: `${ticker.description} (${ticker.symbol})`
              }))}
              required
            />
            <Field
              name="shares"
              type="number"
              label="Number of Shares"
              component={CustomInput}
              placeholder="Enter number of shares"
              required
            />
            <Field
              name="pricePerShare"
              type="number"
              label="Purchase Price (per share)"
              component={CustomInput}
              placeholder="Enter price per share"
            />
          </div>
        );

      case 'crypto':
        return (
          <div className="space-y-4">
            <Field
              name="cryptocurrency"
              label="Cryptocurrency"
              component={CustomSelect}
              options={[
                { value: 'BTC', label: 'Bitcoin (BTC)' },
                { value: 'ETH', label: 'Ethereum (ETH)' },
                { value: 'USDT', label: 'Tether (USDT)' },
                { value: 'BNB', label: 'Binance Coin (BNB)' }
              ]} required
            />
            <Field
              name="cryptoQuantity"
              type="number"
              label="Quantity"
              component={CustomInput}
              placeholder="Enter quantity"
              step="0.000001"required
            />
            <Field
              name="cryptoPrice"
              type="number"
              label="Purchase Price"
              component={CustomInput}
              placeholder="Enter purchase price" 
            />
          </div>
        );

      case 'realestate':
        return (
          <div className="space-y-4">
            <Field
              name="propertyType"
              label="Property Type"
              component={CustomSelect}
              options={[
                { value: 'residential', label: 'Residential' },
                { value: 'commercial', label: 'Commercial' },
                { value: 'land', label: 'Land' }
              ]} required
            />
            <Field
              name="area"
              type="number"
              label="Area (sq. ft)"
              component={CustomInput}
              placeholder="Enter area in square feet" required
            />
            <Field
              name="purchasePrice"
              type="number"
              label="Purchase Price"
              component={CustomInput}
              placeholder="Enter purchase price" required
            />
          </div>
        );

      case 'fd':
        return (
          <div className="space-y-4">
            <Field
              name="principalAmount"
              type="number"
              label="Principal Amount"
              component={CustomInput}
              placeholder="Enter principal amount"
            />
            <Field
              name="interestRate"
              type="number"
              label="Interest Rate (%)"
              component={CustomInput}
              placeholder="Enter interest rate"
              step="0.01"
            />
            <Field
              name="maturityPeriod"
              type="number"
              label="Maturity Period (Years)"
              component={CustomInput}
              placeholder="Enter maturity period"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Asset Type</label>
        <select
          value={selectedAsset}
          onChange={(e) => setSelectedAsset(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
        >
          <option value="">Select an asset type</option>
          {assetTypes.map((asset) => (
            <option key={asset.value} value={asset.value}>
              {asset.label}
            </option>
          ))}
        </select>
      </div>

      {selectedAsset && (
        <Formik
          initialValues={getInitialValues()}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          <Form className="space-y-4">
            {renderFields()}

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
            >
              {loading ? 'Saving...' : 'Submit'}
            </button>
          </Form>
        </Formik>
      )}
    </div>
  );
};

export default AssetForm;