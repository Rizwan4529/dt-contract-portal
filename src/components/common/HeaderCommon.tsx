import { Link } from "react-router-dom";
import { Bell, ChevronDown, LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from "@/app/hooks";
import { useAuthLogout } from "@/hooks/useAuthLogout";
import { GLOBAL_ROUTES, ROLE_LABELS } from "@/utils/Constants";
import AvatarCommon from "./AvatarCommon";
import ThemeToggle from "./ThemeToggle";

const HeaderCommon = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { handleLogout, isLoading } = useAuthLogout();
  const displayName = user?.name || user?.email;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-card px-4 md:px-6">
      <SidebarTrigger className="text-muted-foreground" />

      <div className="flex items-center gap-1 md:gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" aria-label="Notifications" className="text-muted-foreground">
          <Bell />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <AvatarCommon name={displayName} src={user?.profileImage} />
              <span className="hidden min-w-0 flex-col leading-tight sm:flex">
                <span className="max-w-40 truncate text-sm font-semibold">{displayName}</span>
                <span className="text-xs text-muted-foreground">{user ? ROLE_LABELS[user.role] : ""}</span>
              </span>
              <ChevronDown className="hidden size-4 text-muted-foreground sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="flex flex-col">
              <span className="truncate">{displayName}</span>
              <span className="truncate text-xs font-normal text-muted-foreground">{user?.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={GLOBAL_ROUTES.PROFILE}>
                <UserRound />
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" disabled={isLoading} onSelect={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default HeaderCommon;
