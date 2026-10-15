import { useState } from "react";
import { useDebouncedSearch } from "./useDebouncedSearch";

// Search + filter state shared by every list page.
// `filters` hold exact-match values (sent to the backend), search is applied client-side.
// Filters are edited as a draft inside FilterDrawerCommon and applied with `setFilters`.
export function useListFilters<F extends Record<string, string>>(initialFilters: F) {
  const { search, setSearch, debouncedValue } = useDebouncedSearch();
  const [filters, setFilters] = useState<F>(initialFilters);

  const resetFilters = () => {
    setFilters(initialFilters);
    setSearch("");
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  // Includes search: used for "no results match" empty states
  const activeCount = activeFilterCount + (search.trim() ? 1 : 0);

  return {
    search,
    setSearch,
    debouncedSearch: debouncedValue,
    filters,
    setFilters,
    initialFilters,
    resetFilters,
    activeFilterCount,
    activeCount,
  };
}
