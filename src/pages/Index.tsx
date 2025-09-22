import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import Dashboard from "./Dashboard";
import Landing from "./Landing";

const Index = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  if (!showDashboard) {
    return <Landing onGetStarted={() => setShowDashboard(true)} />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Dashboard />
        </div>
      </main>
    </div>
  );
};

export default Index;
