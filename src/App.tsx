import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { FocusBCMModal } from './components/FocusBCMModal';
import { AiBreakdownModal } from './components/AiBreakdownModal';
import { AterrizarModal } from './components/AterrizarModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { DarModal } from './components/DarModal';
import { EnergySettingsModal } from './components/EnergySettingsModal';
import { DashboardView } from './views/DashboardView';
import { PlanView } from './views/PlanView';
import { HabitosView } from './views/HabitosView';
import { CalendarioView } from './views/CalendarioView';
import { SabiduriaView } from './views/SabiduriaView';
import { ClaridadView } from './views/ClaridadView';
import { BalanceView } from './views/BalanceView';
import { TutorialMetodologiaView } from './views/TutorialMetodologiaView';
import { X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDarModalOpen, setIsDarModalOpen] = useState(false);
  const [isEnergyModalOpen, setIsEnergyModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'inicio':
        return <DashboardView />;
      case 'plan':
        return <PlanView />;
      case 'habitos':
        return <HabitosView />;
      case 'calendario':
        return <CalendarioView />;
      case 'sabiduria':
        return <SabiduriaView />;
      case 'claridad':
        return <ClaridadView />;
      case 'balance':
        return <BalanceView />;
      case 'tutorial':
        return <TutorialMetodologiaView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#18181B] font-sans antialiased selection:bg-red-500/20 selection:text-red-700 flex flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          onOpenDarModal={() => setIsDarModalOpen(true)}
          onOpenEnergyModal={() => setIsEnergyModalOpen(true)}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[85%] bg-[#0B0C10] text-zinc-300 z-10 shadow-2xl h-full">
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar
              isCollapsed={false}
              setIsCollapsed={() => {}}
              onOpenDarModal={() => {
                setIsDarModalOpen(true);
                setIsMobileSidebarOpen(false);
              }}
              onOpenEnergyModal={() => {
                setIsEnergyModalOpen(true);
                setIsMobileSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopHeader onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        {/* Content Area - Clean & Fully Responsive */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto w-full">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <FocusBCMModal />
      <AiBreakdownModal />
      <AterrizarModal />
      <TaskDetailModal />
      <DarModal isOpen={isDarModalOpen} onClose={() => setIsDarModalOpen(false)} />
      <EnergySettingsModal isOpen={isEnergyModalOpen} onClose={() => setIsEnergyModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
