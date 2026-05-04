import { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { DeadlineBanner } from "./DeadlineBanner";
import { Footer } from "./Footer";

interface AppShellProps {
  children: ReactNode;
  /** When true, hero pushes underneath the nav (transparent header overlap) */
  fullBleedHero?: boolean;
}

export const AppShell = ({ children, fullBleedHero = false }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />
      <DeadlineBanner />
      <main className={`flex-1 ${fullBleedHero ? "" : "pt-16"}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
