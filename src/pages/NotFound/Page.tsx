import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/common/BrandLogo";
import { TypographyH1, TypographyMuted } from "@/components/common/Typography";
import { GLOBAL_ROUTES } from "@/utils/Constants";

const NotFoundPage = () => (
  <div className="flex min-h-svh flex-col items-center justify-center gap-5 bg-background px-6 text-center">
    <BrandMark className="size-14" />
    <div className="flex flex-col gap-1.5">
      <TypographyH1>Page not found</TypographyH1>
      <TypographyMuted>The page you are looking for does not exist or has been moved.</TypographyMuted>
    </div>
    <Button asChild>
      <Link to={GLOBAL_ROUTES.DASHBOARD}>Back to Dashboard</Link>
    </Button>
  </div>
);

export default NotFoundPage;
