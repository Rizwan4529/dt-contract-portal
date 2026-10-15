import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import SidebarCommon from "@/components/common/SidebarCommon";
import HeaderCommon from "@/components/common/HeaderCommon";
import GlobalPageLoader from "@/components/common/GlobalPageLoader";
import { ADMIN_PAGE_CONTAINER, ADMIN_SCROLL_AREA } from "./adminPageLayout";

const SidebarLayout = () => (
  <SidebarProvider className="h-svh overflow-hidden">
    <SidebarCommon />
    <SidebarInset className="min-w-0 overflow-hidden">
      <HeaderCommon />
      <div className={ADMIN_SCROLL_AREA}>
        <div className={ADMIN_PAGE_CONTAINER}>
          <Suspense fallback={<GlobalPageLoader compact />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
);

export default SidebarLayout;
