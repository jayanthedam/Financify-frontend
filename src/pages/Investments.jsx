import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

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
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/assets`, {
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
        setEditingAsset({...asset});
    };

    const handleDelete = async (assetId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/assets/${assetId}`, {
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
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/assets/${updatedAsset._id}`, {
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

    const renderQuantity = (asset) => {
        return asset.details?.quantity || 
               asset.details?.shares || 
               asset.details?.cryptoQuantity || 
               asset.details?.area || 
               asset.details?.principalAmount;
    };

    const renderPrice = (asset) => {
        return asset.details?.pricePerGram || 
               asset.details?.pricePerShare || 
               asset.details?.cryptoPrice || 
               asset.details?.purchasePrice;
    };

    const renderDetails = (asset) => {
        switch(asset.assetType) {
            case 'stocks': return `Stock Name: ${asset.details?.ticker}`;
            case 'gold': return `24K Gold`;
            case 'crypto': return `Coin: ${asset.details?.cryptocurrency}`;
            case 'realestate': return `Land Type: ${asset.details?.propertyType}`;
            default: return '';
        }
    };

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-4">Error: {error}</div>;
    }

    return (
        <div className="w-full">
                        {editingAsset && (
                <div className="bg-white p-4 rounded-lg shadow-md mt-6">
                    <h3 className="text-sm font-semibold mb-4">Edit Investment</h3>
                    <form onSubmit={(e) => { e.preventDefault(); handleSave(editingAsset); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type="number"
                                value={renderQuantity(editingAsset)}
                                onChange={(e) => setEditingAsset({ 
                                    ...editingAsset, 
                                    details: { 
                                        ...editingAsset.details, 
                                        quantity: e.target.value,
                                        shares: e.target.value,
                                        cryptoQuantity: e.target.value,
                                        area: e.target.value,
                                        principalAmount: e.target.value
                                    } 
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
                            <input
                                type="number"
                                value={renderPrice(editingAsset)}
                                onChange={(e) => setEditingAsset({
                                    ...editingAsset,
                                    details: {
                                        ...editingAsset.details,
                                        pricePerGram: editingAsset.assetType === 'gold' ? e.target.value : undefined,
                                        pricePerShare: editingAsset.assetType === 'stocks' ? e.target.value : undefined,
                                        cryptoPrice: editingAsset.assetType === 'crypto' ? e.target.value : undefined,
                                        purchasePrice: editingAsset.assetType === 'realestate' ? e.target.value : undefined
                                    }
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Save
                        </button>
                    </form>
                </div>
            )}
            <div className="bg-white p-4 rounded-lg shadow-md mt-6">
                <h3 className="text-sm font-semibold mb-4">Latest Investments</h3>
                
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left">Investment</th>
                                <th className="px-4 py-2 text-left">Amount</th>
                                <th className="px-4 py-2 text-left">Purchase Price</th>
                                <th className="px-4 py-2 text-left">Date</th>
                                <th className="px-4 py-2 text-left">Details</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2">{assetLabels[asset.assetType]}</td>
                                    <td className="border px-4 py-2">{renderQuantity(asset)}</td>
                                    <td className="border px-4 py-2">₹{renderPrice(asset)}</td>
                                    <td className="border px-4 py-2">{new Date(asset.createdAt).toLocaleDateString()}</td>
                                    <td className="border px-4 py-2">{renderDetails(asset)}</td>
                                    <td className="border px-4 py-2">
                                        <button 
                                            onClick={() => handleEdit(asset)} 
                                            className="text-blue-500 hover:text-blue-700 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(asset._id)} 
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-4">
                    {assets.map((asset, index) => (
                        <div 
                            key={index} 
                            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-semibold text-lg">
                                    {assetLabels[asset.assetType]}
                                </span>
                                <div>
                                    <button 
                                        onClick={() => handleEdit(asset)} 
                                        className="text-blue-500 hover:text-blue-700 mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(asset._id)} 
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Amount:</span>
                                    <span>{renderQuantity(asset)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Purchase Price:</span>
                                    <span>₹{renderPrice(asset)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date:</span>
                                    <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Details:</span>
                                    <span>{renderDetails(asset)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
};

export default Investments;
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import Form from '../pages/Form';

// const Investments = () => {
//     const { user } = useAuth();
//     const [assets, setAssets] = useState([]);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [totalStockValue, setTotalStockValue] = useState(0);
//     const [editingAsset, setEditingAsset] = useState(null);

//     const assetLabels = {
//         stocks: 'Stocks',
//         crypto: 'Cryptocurrency',
//         realestate: 'Real Estate',
//         fd: 'Fixed Deposits',
//         gold: 'Gold Investment',
//     };

//     useEffect(() => {
//         const fetchAssets = async () => {
//             try {
//                 const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/assets`, {
//                     headers: {
//                         Authorization: `Bearer ${user.token}`,
//                     },
//                 });
//                 const data = await response.json();
//                 if (!response.ok) {
//                     throw new Error(data.message || 'Failed to fetch assets');
//                 }
//                 setAssets(data);
//                 fetchStockPrices(data);
//             } catch (error) {
//                 setError(error.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAssets();
//     }, [user.token]);

//     const fetchStockPrices = async (assets) => {
//         try {
//             const stockAssets = assets.filter(asset => asset.assetType === 'stocks');
//             let totalValue = 0;

//             for (const asset of stockAssets) {
//                 if (!asset.details) continue;
//                 const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${asset.details.ticker}&token=${import.meta.env.VITE_FINNHUB_API_KEY}`);
//                 const data = await response.json();
//                 const closePrice = data.c; // Current price
//                 totalValue += closePrice * asset.details.shares;
//             }

//             setTotalStockValue(totalValue);
//         } catch (error) {
//             console.error('Error fetching stock prices:', error);
//         }
//     };

//     const handleEdit = (asset) => {
//         setEditingAsset(asset);
//     };

//     const handleDelete = async (assetId) => {
//         try {
//             const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/assets/${assetId}`, {
//                 method: 'DELETE',
//                 headers: {
//                     Authorization: `Bearer ${user.token}`,
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to delete asset');
//             }

//             setAssets(assets.filter(asset => asset._id !== assetId));
//         } catch (error) {
//             setError(error.message);
//         }
//     };

//     const handleSave = async (updatedAsset) => {
//         try {
//             const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/assets/${updatedAsset._id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${user.token}`,
//                 },
//                 body: JSON.stringify(updatedAsset),
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to update asset');
//             }

//             const data = await response.json();
//             const updatedAssets = assets.map(asset => asset._id === data._id ? data : asset);
//             setAssets(updatedAssets);
//             setEditingAsset(null);
//         } catch (error) {
//             setError(error.message);
//         }
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     return (
//         <div>
//             <div className="bg-white p-4 rounded-lg shadow-md mt-6">
//                 <h3 className="text-sm font-semibold mb-4">Latest Investments</h3>
//                 <table className="min-w-full table-auto">
//                     <thead>
//                         <tr>
//                             <th className="px-4 py-2 text-left">Investment</th>
//                             <th className="px-4 py-2 text-left">Amount</th>
//                             <th className="px-4 py-2 text-left">Date</th>
//                             <th className="px-4 py-2 text-left">Details</th>
//                             <th className="px-4 py-2 text-left">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {assets.map((asset, index) => (
//                             <tr key={index}>
//                                 <td className="border px-4 py-2">{assetLabels[asset.assetType]}</td>
//                                 <td className="border px-4 py-2">₹{asset.details?.quantity || asset.details?.shares || asset.details?.cryptoQuantity || asset.details?.area || asset.details?.principalAmount}</td>
//                                 <td className="border px-4 py-2">{new Date(asset.createdAt).toLocaleDateString()}</td>
//                                 <td className="border px-4 py-2">
//                                     {asset.assetType === 'stocks' && `Stock Name: ${asset.details?.ticker}`}
//                                     {asset.assetType === 'realestate' && `Land Type: ${asset.details?.propertyType}`}
//                                 </td>
//                                 <td className="border px-4 py-2">
//                                     <button onClick={() => handleEdit(asset)} className="text-blue-500 hover:text-blue-700">Edit</button>
//                                     <button onClick={() => handleDelete(asset._id)} className="ml-3 text-red-500 hover:text-red-700">Delete</button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {editingAsset && (
//                 <div className="bg-white p-4 rounded-lg shadow-md mt-6">
//                     <h3 className="text-sm font-semibold mb-4">Edit Investment</h3>
//                     <form onSubmit={(e) => { e.preventDefault(); handleSave(editingAsset); }}>
//                         <div className="mb-4">
//                             <label className="block text-sm font-medium text-gray-700">Amount</label>
//                             <input
//                                 type="number"
//                                 value={editingAsset.details?.quantity || editingAsset.details?.shares || editingAsset.details?.cryptoQuantity || editingAsset.details?.area || editingAsset.details?.principalAmount}
//                                 onChange={(e) => setEditingAsset({ ...editingAsset, details: { ...editingAsset.details, quantity: e.target.value } })}
//                                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                             />
//                         </div>
//                         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
//                     </form>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Investments;
