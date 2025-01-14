import React from 'react';

function NannyList({ nannies }) {
    if (nannies.length === 0) {
        return <div className="no-results">No nannies found</div>
    }

    return (
        <div className="flex flex-wrap -mx-2">
            {nannies.map(nanny => (
                <div key={nanny.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2 mb-4">
                    <div className="nanny-card bg-white shadow-md rounded-lg overflow-hidden">
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
                                    <span className="text-gray-500 text-xs">No Image</span>
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{nanny.name}</h3>
                            <p className="text-sm text-gray-600">{nanny.nationality}</p>
                            <div className="mt-2 space-y-1">
                                <p><strong>Location:</strong> {nanny.location}</p>
                                <p><strong>Phone:</strong> {nanny.phone}</p>
                                <p><strong>Languages:</strong> {Array.isArray(nanny.languages) ? nanny.languages.join(', ') : nanny.languages}</p>
                                <p><strong>Status:</strong> {nanny.status}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default NannyList;
