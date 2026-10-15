import type { ReactNode } from "react";
import BrandLogo from "@/components/common/BrandLogo";
import { TypographyDisplay, TypographyH2, TypographyMuted } from "@/components/common/Typography";
import { APP_CONSTANTS } from "@/utils/Constants";

interface AuthLayoutProps {
  title: ReactNode;
  description?: ReactNode;
  // Hero image for the left panel; falls back to a brand gradient
  image?: string;
  children: ReactNode;
}

const AuthLayout = ({ title, description, image, children }: AuthLayoutProps) => (
  <div className="grid min-h-svh bg-background lg:grid-cols-[1.05fr_1fr]">
    <aside className="relative hidden overflow-hidden bg-sidebar lg:block">
      {image ? (
        <img src={image} alt="" className="absolute inset-0 size-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_10%,var(--primary)_0%,transparent_55%),linear-gradient(160deg,#3b3122_0%,#1d1b17_70%)] opacity-90" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <TypographyDisplay className="absolute bottom-12 left-12 max-w-xs text-white">
        {APP_CONSTANTS.APP_TAGLINE}
      </TypographyDisplay>
    </aside>

    <main className="flex items-center justify-center px-6 py-10">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <BrandLogo size="lg" className="justify-center" />
        <div className="flex flex-col gap-1.5 text-center">
          <TypographyH2>{title}</TypographyH2>
          {description && <TypographyMuted>{description}</TypographyMuted>}
        </div>
        {children}
      </div>
    </main>
  </div>
);

export default AuthLayout;
