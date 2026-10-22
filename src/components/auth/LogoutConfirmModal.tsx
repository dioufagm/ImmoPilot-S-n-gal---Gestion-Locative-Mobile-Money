import React from 'react';
import { LogOut, X, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LogoutConfirmModal: React.FC = () => {
  const { isLogoutConfirmOpen, setIsLogoutConfirmOpen, logout, userProfile, settings } = useApp();

  if (!isLogoutConfirmOpen) return null;

  const handleConfirmLogout = () => {
    logout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with red accent */}
        <div className="p-6 pb-4 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center flex-shrink-0 text-rose-600 shadow-xs">
            <LogOut className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">
              Confirmer la déconnexion
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Êtes-vous sûr de vouloir vous déconnecter de votre compte{' '}
              <strong className="text-slate-700 font-semibold">{userProfile.fullName}</strong> ({settings.agencyName}) ?
            </p>
          </div>
          <button
            onClick={() => setIsLogoutConfirmOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info callout */}
        <div className="mx-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>
            Toutes vos données (immeubles, baux, loyers) restent enregistrées en toute sécurité.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-5 flex items-center justify-end gap-3 bg-slate-50/50 border-t border-slate-100 mt-5">
          <button
            type="button"
            onClick={() => setIsLogoutConfirmOpen(false)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirmLogout}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-600/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
