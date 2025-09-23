import { Sidebar } from "@/components/layout/sidebar";
import Dashboard from "./Dashboard";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="sticky top-0 h-screen w-64 shrink-0 z-20">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Dashboard />
        </div>
      </main>
    </div>
  );
};

export default Index;
