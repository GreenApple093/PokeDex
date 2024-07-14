import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function Search({ onSearchChange }) {
  const handleInputChange = (e) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className='flex justify-center py-10'>
      <div className='flex justify-center h-11 rounded-xl w-full'>
        <div className='w-80'>
          <input
            type="text"
            placeholder='Search your Pokemon'
            className='h-10 border-spacing-1 focus:border-none rounded-lg bg-white pr-20 pl-2 py-1 outline-none w-full rounded-tr-none rounded-br-none shadow-xl shadow-slate-500'
            onChange={handleInputChange}
          />
        </div>

        <button
          value="submit"
          className="flex justify-center items-center p-2 text-white bg-orange-600 rounded-xl h-10 w-11 shadow-xl shadow-orange-700 focus:outline-none rounded-tl-none rounded-bl-none"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  );
}

export default Search;
