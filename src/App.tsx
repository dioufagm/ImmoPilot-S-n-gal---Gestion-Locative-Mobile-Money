import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { BuildingsView } from './components/buildings/BuildingsView';
import { AddBuildingModal } from './components/buildings/AddBuildingModal';
import { UnitsView } from './components/units/UnitsView';
import { AddUnitModal } from './components/units/AddUnitModal';
import { TenantsView } from './components/tenants/TenantsView';
import { PaymentsView } from './components/payments/PaymentsView';
import { NewPaymentModal } from './components/payments/NewPaymentModal';
import { RentReceiptModal } from './components/payments/RentReceiptModal';
import { TenantPaymentPortalModal } from './components/payments/TenantPaymentPortalModal';
import { RentsScheduleView } from './components/rents/RentsScheduleView';
import { ReportsView } from './components/reports/ReportsView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { SettingsView } from './components/settings/SettingsView';
import { LandingPage } from './components/landing/LandingPage';
import { LogoutConfirmModal } from './components/auth/LogoutConfirmModal';
import { LoginModal } from './components/auth/LoginModal';
import { Tenant } from './types';

function MainApp() {
  const {
    activeTab,
    viewMode,
    addBuilding,
    viewingReceiptPayment,
    setViewingReceiptPayment,
  } = useApp();

  // Mobile menu
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isAddBuildingOpen, setIsAddBuildingOpen] = useState(false);
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);

  // Quick contextual targets
  const [targetTenantForPayment, setTargetTenantForPayment] = useState<Tenant | null>(null);
  const [targetBuildingForUnits, setTargetBuildingForUnits] = useState<string>('all');
  const [targetUnitForTenant, setTargetUnitForTenant] = useState<string | undefined>();

  const handleOpenAddPayment = (tenant?: Tenant) => {
    setTargetTenantForPayment(tenant || null);
    setIsAddPaymentOpen(true);
  };

  const handleOpenPortal = (tenant?: Tenant) => {
    setTargetTenantForPayment(tenant || null);
    setIsPortalModalOpen(true);
  };

  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage />
        {/* Modals available if triggered */}
        <TenantPaymentPortalModal
          isOpen={isPortalModalOpen}
          onClose={() => {
            setIsPortalModalOpen(false);
            setTargetTenantForPayment(null);
          }}
          initialTenant={targetTenantForPayment}
        />
        <RentReceiptModal
          payment={viewingReceiptPayment}
          isOpen={!!viewingReceiptPayment}
          onClose={() => setViewingReceiptPayment(null)}
        />
        <LogoutConfirmModal />
        <LoginModal />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onOpenPortalModal={() => handleOpenPortal()}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenPortalModal={() => handleOpenPortal()}
          onOpenNewBuildingModal={() => setIsAddBuildingOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              onOpenAddBuilding={() => setIsAddBuildingOpen(true)}
              onOpenAddPayment={() => handleOpenAddPayment()}
              onOpenPortalModal={() => handleOpenPortal()}
            />
          )}

          {activeTab === 'buildings' && (
            <BuildingsView
              onOpenAddBuilding={() => setIsAddBuildingOpen(true)}
              onSelectBuildingForUnits={(buildingId: string) =>
                setTargetBuildingForUnits(buildingId)
              }
            />
          )}

          {activeTab === 'units' && (
            <UnitsView
              onOpenAddUnit={() => setIsAddUnitOpen(true)}
              selectedBuildingFilter={targetBuildingForUnits}
            />
          )}

          {activeTab === 'tenants' && (
            <TenantsView
              onOpenAddPaymentForTenant={(tenant: Tenant) => handleOpenAddPayment(tenant)}
              onOpenPortalForTenant={(tenant: Tenant) => handleOpenPortal(tenant)}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsView
              onOpenAddPayment={() => handleOpenAddPayment()}
              onOpenPortalModal={() => handleOpenPortal()}
            />
          )}

          {activeTab === 'rents' && (
            <RentsScheduleView
              onOpenAddPaymentForTenant={(tenant: Tenant) => handleOpenAddPayment(tenant)}
            />
          )}

          {activeTab === 'reports' && <ReportsView />}

          {activeTab === 'notifications' && <NotificationsView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modals */}
      <AddBuildingModal
        isOpen={isAddBuildingOpen}
        onClose={() => setIsAddBuildingOpen(false)}
        onSave={data => addBuilding(data)}
      />

      <AddUnitModal
        isOpen={isAddUnitOpen}
        onClose={() => setIsAddUnitOpen(false)}
        preselectedBuildingId={
          targetBuildingForUnits !== 'all' ? targetBuildingForUnits : undefined
        }
      />

      <NewPaymentModal
        isOpen={isAddPaymentOpen}
        onClose={() => {
          setIsAddPaymentOpen(false);
          setTargetTenantForPayment(null);
        }}
        targetTenant={targetTenantForPayment}
      />

      <RentReceiptModal
        payment={viewingReceiptPayment}
        isOpen={!!viewingReceiptPayment}
        onClose={() => setViewingReceiptPayment(null)}
      />

      <TenantPaymentPortalModal
        isOpen={isPortalModalOpen}
        onClose={() => {
          setIsPortalModalOpen(false);
          setTargetTenantForPayment(null);
        }}
        initialTenant={targetTenantForPayment}
      />

      <LogoutConfirmModal />
      <LoginModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
