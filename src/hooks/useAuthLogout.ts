import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { api } from "@/app/services/baseApi";
import { logout } from "@/app/features/auth/authSlice";
import { useLogoutMutation } from "@/app/features/auth/authApi";
import { GLOBAL_ROUTES } from "@/utils/Constants";

export function useAuthLogout(redirectTo: string = GLOBAL_ROUTES.LOGIN) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutRequest, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutRequest().unwrap();
    } catch {
      // session may already be expired — clear locally regardless
    }
    dispatch(logout());
    dispatch(api.util.resetApiState());
    navigate(redirectTo, { replace: true });
  };

  return { handleLogout, isLoading };
}
