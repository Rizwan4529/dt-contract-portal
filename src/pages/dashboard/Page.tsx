import { Link } from "react-router-dom";
import { AlarmClock, FileCheck2, FileText, FileX2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeaderCommon from "@/components/common/PageHeaderCommon";
import SectionCardCommon from "@/components/common/SectionCardCommon";
import StatCardCommon from "@/components/common/StatCardCommon";
import NoticeCommon from "@/components/common/NoticeCommon";
import BreakdownListCommon from "@/components/common/BreakdownListCommon";
import { PAGE_STACK } from "@/components/layout/adminPageLayout";
import Contracts from "@/components/contracts/Contracts";
import ExpiringContracts from "@/components/dashboard/ExpiringContracts";
import { getContractStats } from "@/components/contracts/contractView";
import { useContractList } from "@/hooks/useContractList";
import { useAppSelector } from "@/app/hooks";
import { APP_CONSTANTS, GLOBAL_ROUTES, PAYMENT_STATUS_LABELS } from "@/utils/Constants";
import { formatCurrency } from "@/utils/Helpers";
import { getStatusTone } from "@/utils/statusStyles";

const TOP_DEPARTMENTS = 5;

const Page = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { allContracts, isLoading, isPreview } = useContractList();
  const stats = getContractStats(allContracts);
  const firstName = user?.name?.split(" ")[0] || user?.email;

  const paymentItems = stats.byPaymentStatus.map((item) => ({
    ...item,
    label: PAYMENT_STATUS_LABELS[item.key],
    tone: getStatusTone(item.key),
  }));

  return (
    <div className={PAGE_STACK}>
      <PageHeaderCommon title="Dashboard" description={`Welcome back, ${firstName}`} />

      {isPreview && <NoticeCommon>Dashboard is showing sample data until the contracts API is connected.</NoticeCommon>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCardCommon
          label="Total Contracts"
          value={stats.total}
          icon={FileText}
          tone="brand"
          hint={`${formatCurrency(stats.totalValue)} total value`}
          isLoading={isLoading}
        />
        <StatCardCommon label="Active Contracts" value={stats.active} icon={FileCheck2} tone="success" isLoading={isLoading} />
        <StatCardCommon
          label="Expiring Soon"
          value={stats.expiringSoon}
          icon={AlarmClock}
          tone="warning"
          hint={`Within ${APP_CONSTANTS.EXPIRING_SOON_DAYS} days`}
          isLoading={isLoading}
        />
        <StatCardCommon label="Expired Contracts" value={stats.expired} icon={FileX2} tone="danger" isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <SectionCardCommon
          title="Recent Contracts"
          className="xl:col-span-2"
          contentClassName="px-0 pb-0"
          action={
            <Button asChild variant="link" size="sm" className="h-auto px-0">
              <Link to={GLOBAL_ROUTES.CONTRACTS}>View All</Link>
            </Button>
          }
        >
          <Contracts contracts={stats.recent} isLoading={isLoading} variant="compact" />
        </SectionCardCommon>

        <SectionCardCommon title="Expiring Soon">
          <ExpiringContracts contracts={stats.expiringNext} />
        </SectionCardCommon>

        <SectionCardCommon title="Payment Status">
          <BreakdownListCommon items={paymentItems} />
        </SectionCardCommon>

        <SectionCardCommon title="Contracts by Department">
          <BreakdownListCommon items={stats.byDepartment.slice(0, TOP_DEPARTMENTS)} total={stats.total} />
        </SectionCardCommon>

        <SectionCardCommon title="Top Vendors">
          <BreakdownListCommon items={stats.byVendor.slice(0, TOP_DEPARTMENTS)} total={stats.total} />
        </SectionCardCommon>
      </div>
    </div>
  );
};

export default Page;
