import React from "react";

const SearchBar = ({ placeholder, onSearch }) => {
  const handleSearch = (event) => {
    if (onSearch) {
      onSearch(event.target.value); 
    }
  };

  return (
    <div className="flex items-center w-full max-w-lg p-2 bg-gray-100 rounded-lg shadow-md">
      <input
        type="text"
        placeholder={placeholder || "Search..."}
        onChange={handleSearch}
        className="flex-1 px-4 py-2 text-gray-700 bg-transparent outline-none"
      />
      <button className="px-4 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600">
        🔍
      </button>
    </div>
  );
};

export default SearchBar;
