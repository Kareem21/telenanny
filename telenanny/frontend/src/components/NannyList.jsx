import React from 'react';

function NannyList({ nannies }) {
    if (nannies.length === 0) {
        return <div className="no-results">No nannies found</div>
    }

    return (
        <div className="flex justify-center space-x-4">
            {nannies.map(nanny => (
                <div key={nanny.id} className="nanny-profile-pic">
                    <div className="w-12 h-12 overflow-hidden rounded-full">
                        {nanny.profile_image_url ? (
                            <img src={nanny.profile_image_url} alt={nanny.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-xs">No Image</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default NannyList;
