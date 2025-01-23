import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Form from '../pages/Form';

const Investments = () => {
    const { user } = useAuth();
    const [assets, setAssets] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalStockValue, setTotalStockValue] = useState(0);
    const [editingAsset, setEditingAsset] = useState(null);

    const assetLabels = {
        stocks: 'Stocks',
        crypto: 'Cryptocurrency',
        realestate: 'Real Estate',
        fd: 'Fixed Deposits',
        gold: 'Gold Investment',
    };

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await fetch(`${import.meta.VITE_API_BASE_URL}/assets`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch assets');
                }
                setAssets(data);
                fetchStockPrices(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssets();
    }, [user.token]);

    const fetchStockPrices = async (assets) => {
        try {
            const stockAssets = assets.filter(asset => asset.assetType === 'stocks');
            let totalValue = 0;

            for (const asset of stockAssets) {
                if (!asset.details) continue;
                const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${asset.details.ticker}&token=${import.meta.env.VITE_FINNHUB_API_KEY}`);
                const data = await response.json();
                const closePrice = data.c; // Current price
                totalValue += closePrice * asset.details.shares;
            }

            setTotalStockValue(totalValue);
        } catch (error) {
            console.error('Error fetching stock prices:', error);
        }
    };

    const handleEdit = (asset) => {
        setEditingAsset(asset);
    };

    const handleDelete = async (assetId) => {
        try {
            const response = await fetch(`${import.meta.VITE_API_BASE_URL}/assets/${assetId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete asset');
            }

            setAssets(assets.filter(asset => asset._id !== assetId));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSave = async (updatedAsset) => {
        try {
            const response = await fetch(`${import.meta.VITE_API_BASE_URL}/assets/${updatedAsset._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(updatedAsset),
            });

            if (!response.ok) {
                throw new Error('Failed to update asset');
            }

            const data = await response.json();
            const updatedAssets = assets.map(asset => asset._id === data._id ? data : asset);
            setAssets(updatedAssets);
            setEditingAsset(null);
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <div className="bg-white p-4 rounded-lg shadow-md mt-6">
                <h3 className="text-sm font-semibold mb-4">Latest Investments</h3>
                <table className="min-w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Investment</th>
                            <th className="px-4 py-2 text-left">Amount</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Details</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map((asset, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{assetLabels[asset.assetType]}</td>
                                <td className="border px-4 py-2">₹{asset.details?.quantity || asset.details?.shares || asset.details?.cryptoQuantity || asset.details?.area || asset.details?.principalAmount}</td>
                                <td className="border px-4 py-2">{new Date(asset.createdAt).toLocaleDateString()}</td>
                                <td className="border px-4 py-2">
                                    {asset.assetType === 'stocks' && `Stock Name: ${asset.details?.ticker}`}
                                    {asset.assetType === 'realestate' && `Land Type: ${asset.details?.propertyType}`}
                                </td>
                                <td className="border px-4 py-2">
                                    <button onClick={() => handleEdit(asset)} className="text-blue-500 hover:text-blue-700">Edit</button>
                                    <button onClick={() => handleDelete(asset._id)} className="ml-3 text-red-500 hover:text-red-700">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingAsset && (
                <div className="bg-white p-4 rounded-lg shadow-md mt-6">
                    <h3 className="text-sm font-semibold mb-4">Edit Investment</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(editingAsset); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type="number"
                                value={editingAsset.details?.quantity || editingAsset.details?.shares || editingAsset.details?.cryptoQuantity || editingAsset.details?.area || editingAsset.details?.principalAmount}
                                onChange={(e) => setEditingAsset({ ...editingAsset, details: { ...editingAsset.details, quantity: e.target.value } })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Investments;