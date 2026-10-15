import { Link } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import EmptyStateCommon from "@/components/common/EmptyStateCommon";
import { getContractDetailPath } from "@/components/contracts/Contracts";
import type { ContractRow } from "@/components/contracts/contractView";
import { APP_CONSTANTS } from "@/utils/Constants";
import { formatDate } from "@/utils/Helpers";

// Contracts ending within APP_CONSTANTS.EXPIRING_SOON_DAYS, soonest first
const ExpiringContracts = ({ contracts }: { contracts: ContractRow[] }) => {
  if (contracts.length === 0) {
    return (
      <EmptyStateCommon
        icon={CalendarClock}
        title="Nothing expiring soon"
        description={`No contracts end in the next ${APP_CONSTANTS.EXPIRING_SOON_DAYS} days.`}
        className="py-6"
      />
    );
  }

  return (
    <ul className="-mx-2 flex flex-col">
      {contracts.map((contract) => (
        <li key={contract._id}>
          <Link
            to={getContractDetailPath(contract._id)}
            className="flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent"
          >
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">{contract.title}</span>
              <span className="truncate text-xs text-muted-foreground">
                {contract.vendorName} &middot; {formatDate(contract.endDate)}
              </span>
            </div>
            <span className="shrink-0 rounded-md bg-warning-soft px-2 py-0.5 text-xs font-medium text-warning">
              {contract.daysLeft === 0 ? "Today" : `${contract.daysLeft}d left`}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ExpiringContracts;
