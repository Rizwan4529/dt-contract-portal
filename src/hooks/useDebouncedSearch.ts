import { useEffect, useState } from "react";
import { APP_CONSTANTS } from "@/utils/Constants";

export function useDebouncedSearch({ initialValue = "", delay = APP_CONSTANTS.SEARCH_DEBOUNCE_MS } = {}) {
  const [search, setSearch] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(search), delay);
    return () => clearTimeout(timer);
  }, [search, delay]);

  return { search, setSearch, debouncedValue };
}
