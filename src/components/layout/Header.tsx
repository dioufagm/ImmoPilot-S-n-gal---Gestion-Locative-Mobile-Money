import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Home,
  CheckCheck,
  Smartphone,
  Send,
  AlertTriangle,
  Receipt,
  Clock,
  Sparkles,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatShortDate } from '../../utils/formatters';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenPortalModal: () => void;
  onOpenNewBuildingModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  onOpenPortalModal,
  onOpenNewBuildingModal,
}) => {
  const {
    activeTab,
    setActiveTab,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    triggerBatchReminders,
    settings,
    setViewMode,
    setSettingsSubTab,
    setIsLogoutConfirmOpen,
  } = useApp();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return "Vue d'ensemble";
      case 'buildings':
        return 'Mes immeubles';
      case 'units':
        return 'Gestion des logements';
      case 'tenants':
        return 'Gestion des locataires';
      case 'payments':
        return 'Paiements & Mobile Money';
      case 'rents':
        return 'Suivi des loyers & Échéancier';
      case 'reports':
        return 'Rapports & Statistiques';
      case 'notifications':
        return 'Notifications & Alertes';
      case 'settings':
        return 'Paramètres du compte';
      default:
        return "Vue d'ensemble";
    }
  };

  const handleTriggerReminders = () => {
    const res = triggerBatchReminders();
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <header className="sticky top-0 z-20 h-18 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">{getTitle()}</h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Quick Trigger Relances */}
        <button
          onClick={handleTriggerReminders}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition-colors"
          title="Envoyer les rappels automatiques aux loyers en retard"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Relance automatique</span>
        </button>

        {/* Lien portail locataire */}
        <button
          onClick={onOpenPortalModal}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Portail Locataire</span>
        </button>

        {/* Accueil du site (Exact replica of screenshots 2 & 3) */}
        <button
          onClick={() => setViewMode('landing')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
          title="Retourner à la page d'accueil du site"
        >
          <Home className="w-4 h-4" />
          <span>Accueil du site</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-800">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[11px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} non lues
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Tout marquer comme lu
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-6">Aucune notification pour le moment.</p>
                ) : (
                  notifications.slice(0, 6).map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer border ${
                        n.isRead
                          ? 'bg-slate-50 border-slate-100 text-slate-600'
                          : 'bg-blue-50/60 border-blue-100 text-slate-800 font-medium'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="font-semibold text-slate-900 flex items-center gap-1">
                          {n.type === 'retard' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                          {n.type === 'loyer_recu' && <Receipt className="w-3.5 h-3.5 text-emerald-500" />}
                          {n.type === 'bail' && <Clock className="w-3.5 h-3.5 text-purple-500" />}
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {formatShortDate(n.date)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge & Menu (Abdoulaye DIOUF - AB Services) */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200 hover:opacity-85 transition-opacity text-left cursor-pointer"
            title="Menu utilisateur"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
              {settings.managerName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">{settings.managerName}</p>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">{settings.agencyName}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900">{settings.managerName}</p>
                <p className="text-[11px] text-slate-500 truncate">{settings.email}</p>
              </div>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setSettingsSubTab('profil');
                  setShowUserMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Mon profil & Agence</span>
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  setIsLogoutConfirmOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
