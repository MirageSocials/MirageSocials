import Navbar from "@/components/Navbar";

interface AppLayoutProps {
  children: React.ReactNode;
  /** Use full width instead of centered column */
  wide?: boolean;
}

const AppLayout = ({ children, wide }: AppLayoutProps) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="md:ml-[68px] xl:ml-[260px]">
      <div className={wide ? "px-4" : "max-w-[600px] mx-auto border-x border-border min-h-screen"}>
        {children}
      </div>
    </main>
  </div>
);

export default AppLayout;
