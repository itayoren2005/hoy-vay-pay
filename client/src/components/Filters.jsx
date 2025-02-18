import React, { useState } from "react";
import "../styles/Filters.css";
import { Filter } from "lucide-react";
import { FilterModal } from "./FilterModal";

const MIN_BOUND = 0;
const MAX_BOUND = 1000;

export const Filters = ({
  inputSearch,
  setInputSearch,
  selectedFilter,
  setSelectedFilter,
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [rangeValues, setRangeValues] = useState([MIN_BOUND, MAX_BOUND]);

  const handleFilterSelect = (option) => {
    setIsFilterModalOpen(false);
    setSelectedFilter(option);
  };

  const HandleClearFilter = () => {
    setRangeValues([MIN_BOUND, MAX_BOUND]);
    setSelectedFilter(null);
  };

  return (
    <>
      <div className="form-filter-section">
        <input
          type="text"
          placeholder="Search..."
          value={inputSearch}
          onChange={({ target }) => setInputSearch(target.value)}
        />
        <button onClick={() => setIsFilterModalOpen(true)}>
          <Filter />
        </button>
      </div>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onFilterSelect={handleFilterSelect}
        rangeValue={rangeValues}
        setRangeValue={setRangeValues}
        MIN_BOUND={MAX_BOUND}
        MAX_BOUND={MAX_BOUND}
      />
    </>
  );
};
