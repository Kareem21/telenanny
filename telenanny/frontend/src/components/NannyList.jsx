import React from 'react';

function NannyList({ nannies }) {
    if (nannies.length === 0) {
        return <div className="no-results">No nannies found</div>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {nannies.map(nanny => (
                <div key={nanny.id} className="nanny-card bg-white shadow-md rounded-lg p-4">
                    {nanny.profile_image_url && (
                        <img src={nanny.profile_image_url} alt={nanny.name} className="w-full h-48 object-cover mb-4 rounded" />
                    )}
                    <h3 className="text-xl font-semibold mb-2">{nanny.name}</h3>
                    <p className="mb-1">Location: {nanny.location}</p>
                    <p className="mb-1">Experience: {nanny.experience} years</p>
                    <p className="mb-1">Languages: {nanny.languages.join(', ')}</p>
                    <p className="mb-3">Rate: {nanny.rate} AED/month</p>
                    <button
                        onClick={() => window.location.href = `mailto:${nanny.email}`}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Contact
                    </button>
                </div>
            ))}
        </div>
    )
}

export default NannyList;
