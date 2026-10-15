import { useGetUsersQuery } from "@/app/features/users/usersApi";
import { filterBySearch } from "@/utils/Helpers";
import { useListFilters } from "./useListFilters";

// GET /users returns everyone the caller can manage (excluding the caller).
// role / status / departmentId are exact-match filters on the backend; search is client-side.
export function useUserList() {
  const list = useListFilters({ role: "", status: "", departmentId: "" });
  const { data = [], isLoading, isFetching } = useGetUsersQuery(list.filters);

  const users = filterBySearch(data, list.debouncedSearch, (user) => [user.name, user.email]);

  return { ...list, users, isLoading: isLoading || isFetching };
}
