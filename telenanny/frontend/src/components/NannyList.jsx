// NannyList.jsx
import React from 'react';

function NannyList({ nannies }) {
    if (nannies.length === 0) {
        return <div className="text-center text-gray-600 py-8">No nannies found</div>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nannies.map(nanny => (
                <div key={nanny.id} className="bg-white shadow-md rounded-lg overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg duration-300">
                    <div className="w-full h-64 overflow-hidden">
                        {nanny.profile_image_url ? (
                            <img
                                src={nanny.profile_image_url}
                                alt={nanny.name}
                                className="w-full h-full object-cover"
                                width="256"
                                height="256"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-sm">No Image</span>
                            </div>
                        )}
                    </div>
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800">{nanny.name || 'Unknown'}</h3>
                        <p className="text-sm text-gray-600 mb-2">{nanny.nationality || 'Not specified'}</p>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-start">
                                <span className="font-medium text-gray-700 min-w-24">Location:</span>
                                <span className="text-gray-600">{nanny.location || 'Not specified'}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-medium text-gray-700 min-w-24">Phone:</span>
                                <span className="text-gray-600">{nanny.phone || 'Not specified'}</span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-medium text-gray-700 min-w-24">Languages:</span>
                                <span className="text-gray-600">
                                    {Array.isArray(nanny.languages) ? nanny.languages.join(', ') : (nanny.languages || 'Not specified')}
                                </span>
                            </div>
                            <div className="flex items-start">
                                <span className="font-medium text-gray-700 min-w-24">Status:</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    nanny.status && nanny.status.toLowerCase() === 'available'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {nanny.status || 'Unknown'}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => window.location.href = `/nannies/${nanny.id}`}
                            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
                        >
                            View Profile
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default NannyList;