import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { protectedRoutes, type AppRoute } from "@/routes";
import { usePermission } from "@/hooks/usePermission";
import { useCurrentRoute } from "@/hooks/useCurrentRoute";
import { LABEL_TO_GROUP_TITLE } from "@/utils/Constants";
import BrandLogo, { BrandMark } from "./BrandLogo";

// Group sidebar routes by `label`, preserving route order
const groupRoutes = (routes: AppRoute[]) =>
  routes.reduce<Record<string, AppRoute[]>>((groups, route) => {
    const key = route.label ?? "";
    (groups[key] ??= []).push(route);
    return groups;
  }, {});

const SidebarCommon = () => {
  const { can } = usePermission();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const currentRoute = useCurrentRoute();
  const isCollapsed = state === "collapsed" && !isMobile;

  const groups = groupRoutes(protectedRoutes.filter((route) => route.includeInSidebar && can(route.permission)));
  const isActive = (route: AppRoute) =>
    currentRoute?.path === route.path || currentRoute?.parentPath === route.path;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="px-4 pt-6 pb-4 group-data-[collapsible=icon]:px-2">
        {isCollapsed ? (
          <BrandMark className="mx-auto size-8" />
        ) : (
          <BrandLogo variant="light" size="sm" />
        )}
      </SidebarHeader>

      <SidebarContent className="gap-0 px-2">
        {Object.entries(groups).map(([label, routes]) => (
          <SidebarGroup key={label}>
            {LABEL_TO_GROUP_TITLE[label] && (
              <SidebarGroupLabel className="text-[11px] tracking-wider text-sidebar-foreground/50 uppercase">
                {LABEL_TO_GROUP_TITLE[label]}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {routes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <SidebarMenuItem key={route.path}>
                      <SidebarMenuButton
                        asChild
                        tooltip={route.name}
                        isActive={isActive(route)}
                        className="h-10 px-3 text-sidebar-foreground data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                      >
                        <Link to={route.path} onClick={() => setOpenMobile(false)}>
                          {Icon && <Icon />}
                          <span>{route.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default SidebarCommon;
