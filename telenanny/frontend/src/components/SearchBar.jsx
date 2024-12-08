function SearchBar({ onSearch }) {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search by name or location..."
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    )
}

export default SearchBar