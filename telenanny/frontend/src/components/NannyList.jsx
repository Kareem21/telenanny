import React from 'react';

function NannyList({ nannies }) {
    if (nannies.length === 0) {
        return <div className="no-results">No nannies found</div>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {nannies.map(nanny => (
                <div key={nanny.id} className="nanny-card bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-4">
                        <div className="flex items-center mb-4">
                            <div className="w-16 h-16 mr-4 overflow-hidden rounded-full">
                                {nanny.profile_image_url ? (
                                    <img 
                                        src={nanny.profile_image_url} 
                                        alt={nanny.name} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500 text-xs">No Image</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">{nanny.name}</h3>
                                <p className="text-sm text-gray-600">{nanny.nationality}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p><strong>Location:</strong> {nanny.location}</p>
                            <p><strong>Phone:</strong> {nanny.phone}</p>
                            <p><strong>Languages:</strong> {Array.isArray(nanny.languages) ? nanny.languages.join(', ') : nanny.languages}</p>
                            <p><strong>Status:</strong> {nanny.status}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default NannyList;
