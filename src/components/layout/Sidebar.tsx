import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Home,
  Users,
  CreditCard,
  CalendarCheck,
  BarChart3,
  Bell,
  Settings,
  Sparkles,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  onOpenPortalModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenPortalModal }) => {
  const { activeTab, setActiveTab, notifications } = useApp();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems = [
    { id: 'dashboard', label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: 'buildings', label: 'Immeubles', icon: Building2 },
    { id: 'units', label: 'Logements', icon: Home },
    { id: 'tenants', label: 'Locataires', icon: Users },
    { id: 'payments', label: 'Paiements', icon: CreditCard },
    { id: 'rents', label: 'Loyers', icon: CalendarCheck },
    { id: 'reports', label: 'Rapports', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0e172a] text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo */}
        <div className="h-18 px-5 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Building2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight">IMMO</span>
                <span className="font-black text-lg text-blue-500 tracking-tight">PILOT</span>
              </div>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
                Sénégal • Immobilier
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onClose) onClose();
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${
                      isActive ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Money Quick Simulation Banner */}
        <div className="p-3 mx-3 mb-4 rounded-xl bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700/60 text-slate-200">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-300">Paiement Mobile Money</span>
          </div>
          <p className="text-xs text-slate-400 mb-2.5">
            Lien Wave & Orange Money personnalisé pour vos locataires.
          </p>
          <button
            onClick={() => {
              onOpenPortalModal();
              if (onClose) onClose();
            }}
            className="w-full py-2 px-2.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-semibold flex items-center justify-between border border-blue-500/30 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" />
              Tester le portail locataire
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Agency Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-300">Formule Pro</span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
              Actif
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Dakar, Sénégal (FCFA)</p>
        </div>
      </aside>
    </>
  );
};
