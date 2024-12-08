function NannyList({ nannies }) {
    if (nannies.length === 0) {
        return <div className="no-results">No nannies found</div>
    }

    return (
        <div className="nanny-grid">
            {nannies.map(nanny => (
                <div key={nanny.id} className="nanny-card">
                    <h3>{nanny.name}</h3>
                    <p>Location: {nanny.location}</p>
                    <p>Experience: {nanny.experience}</p>
                    <p>Languages: {nanny.languages.join(', ')}</p>
                    <p>Rate: {nanny.rate} AED/hour</p>
                    <button
                        onClick={() => window.location.href = `mailto:${nanny.email}`}
                        className="submit-button"
                    >
                        Contact
                    </button>
                </div>
            ))}
        </div>
    )
}

export default NannyList