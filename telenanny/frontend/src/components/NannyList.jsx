import React from 'react';

const NannyList = ({ nannies }) => {
    if (!nannies || nannies.length === 0) {
        return (
            <div className="text-center text-gray-600 py-8">
                No nannies found
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {nannies.map((nanny) => (
                    <div key={nanny.id} className="mb-6">
                        <div className="relative">
                            {/* Offset background */}
                            <span className="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-indigo-500 rounded-lg"></span>

                            {/* Main card content */}
                            <div className="relative bg-white border-2 border-indigo-500 rounded-lg p-5">
                                {/* Image container with FIXED 256px height */}
                                <div className="relative w-full h-64 mb-4">
                                    {nanny.profile_image_url ? (
                                        <img
                                            src={nanny.profile_image_url}
                                            alt={nanny.name}
                                            className="w-full h-64 object-cover rounded-lg"
                                            style={{ maxHeight: '256px' }}
                                        />
                                    ) : (
                                        <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
                                            <span className="text-gray-400">No Image Available</span>
                                        </div>
                                    )}
                                </div>

                                {/* Title */}
                                <div className="flex items-center -mt-1">
                                    <h3 className="my-2 ml-3 text-lg font-bold text-gray-800">
                                        {nanny.name || 'Unknown'}
                                    </h3>
                                </div>

                                {/* Divider */}
                                <p className="mt-3 mb-1 text-xs font-medium text-indigo-500 uppercase">------------</p>

                                {/* Details */}
                                <div className="text-gray-600">
                                    <p className="mb-2">
                                        <strong>Rate:</strong> {nanny.hourly_rate ? `${nanny.hourly_rate} AED/hour` : 'Not specified'}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Location:</strong> {nanny.location || 'Not specified'}
                                    </p>
                                    <p className="mb-2">
                                        <strong>Languages:</strong> {Array.isArray(nanny.languages)
                                        ? nanny.languages.join(', ')
                                        : nanny.languages || 'Not specified'}
                                    </p>

                                    {nanny.phone && (
                                        <a
                                            href={`https://wa.me/${nanny.phone}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-indigo-500 hover:text-indigo-700"
                                        >
                                            Contact via WhatsApp
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NannyList;