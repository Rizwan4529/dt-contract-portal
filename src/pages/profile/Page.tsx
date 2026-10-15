import { useState } from "react";
import { KeyRound, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeaderCommon from "@/components/common/PageHeaderCommon";
import SectionCardCommon from "@/components/common/SectionCardCommon";
import AvatarCommon from "@/components/common/AvatarCommon";
import StatusBadge from "@/components/common/StatusBadge";
import DetailFieldCommon from "@/components/common/DetailFieldCommon";
import { TypographyH3, TypographyMuted } from "@/components/common/Typography";
import { PAGE_STACK } from "@/components/layout/adminPageLayout";
import EditProfile from "@/components/profile/EditProfile";
import ChangePassword from "@/components/profile/ChangePassword";
import { useAppSelector } from "@/app/hooks";
import { useGetUserQuery } from "@/app/features/users/usersApi";
import { useLookupOptions } from "@/hooks/useLookupOptions";
import { ROLE_LABELS } from "@/utils/Constants";
import { formatDate } from "@/utils/Helpers";

const Page = () => {
  const storedUser = useAppSelector((state) => state.auth.user);
  // Refresh from the server (GET /users/:id also syncs the auth slice)
  const { data } = useGetUserQuery(storedUser?._id ?? "", { skip: !storedUser?._id });
  const user = data ?? storedUser;
  const { getDepartmentName } = useLookupOptions({ vendors: false, departments: Boolean(user?.departmentId) });

  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  if (!user) return null;
  const displayName = user.name || user.email;

  return (
    <div className={PAGE_STACK}>
      <PageHeaderCommon title="My Profile" description="Your account details and security settings" />

      <SectionCardCommon contentClassName="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <AvatarCommon name={displayName} src={user.profileImage} className="size-20" fallbackClassName="text-2xl" />
          <div className="flex flex-col gap-1">
            <TypographyH3>{displayName}</TypographyH3>
            <TypographyMuted>{ROLE_LABELS[user.role]}</TypographyMuted>
            <TypographyMuted>{user.email}</TypographyMuted>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="soft" onClick={() => setOpenEdit(true)}>
            <Pencil />
            Edit Profile
          </Button>
          <Button variant="soft" onClick={() => setOpenPassword(true)}>
            <KeyRound />
            Change Password
          </Button>
        </div>
      </SectionCardCommon>

      <SectionCardCommon title="Account Details">
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <DetailFieldCommon label="Full Name" value={user.name} />
          <DetailFieldCommon label="Email" value={user.email} />
          <DetailFieldCommon label="Role" value={ROLE_LABELS[user.role]} />
          <DetailFieldCommon label="Department" value={user.departmentId ? getDepartmentName(user.departmentId) : "All departments"} />
          <DetailFieldCommon label="Status" value={<StatusBadge status={user.status} />} />
          <DetailFieldCommon label="Member Since" value={formatDate(user.createdAt)} />
        </div>
      </SectionCardCommon>

      <EditProfile open={openEdit} onOpenChange={setOpenEdit} user={user} />
      <ChangePassword open={openPassword} onOpenChange={setOpenPassword} userId={user._id} />
    </div>
  );
};

export default Page;
