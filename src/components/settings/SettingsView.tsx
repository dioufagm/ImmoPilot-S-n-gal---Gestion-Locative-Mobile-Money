import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Smartphone,
  Save,
  RotateCcw,
  Check,
  Shield,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetToDefaults } = useApp();

  const [form, setForm] = useState(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast */}
      {saveSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Paramètres enregistrés avec succès !</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Paramètres du compte & Agence
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Personnalisez les coordonnées d'AB Services, vos comptes Wave / Orange Money et les quittances.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identité de l'agence */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Profil de l'agence & Bailleur
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nom de l'agence / Société
              </label>
              <input
                type="text"
                value={form.agencyName}
                onChange={e => setForm({ ...form, agencyName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Gestionnaire / Propriétaire
              </label>
              <input
                type="text"
                value={form.managerName}
                onChange={e => setForm({ ...form, managerName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Téléphone officiel (WhatsApp)
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email de contact
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Adresse du siège à Dakar
              </label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ville & Pays
              </label>
              <input
                type="text"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Numéro NINEA (Fiscal Sénégal)
              </label>
              <input
                type="text"
                value={form.ninea}
                onChange={e => setForm({ ...form, ninea: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Registre de Commerce (RC)
              </label>
              <input
                type="text"
                value={form.rcNumber}
                onChange={e => setForm({ ...form, rcNumber: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Coordonnées Mobile Money */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Smartphone className="w-5 h-5 text-cyan-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Comptes Récepteurs Mobile Money (Sénégal)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-cyan-700 mb-1.5">
                Numéro Marchand WAVE
              </label>
              <input
                type="text"
                value={form.waveMerchantPhone}
                onChange={e => setForm({ ...form, waveMerchantPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-cyan-300 focus:ring-cyan-500 text-xs font-mono font-bold text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Utilisé pour générer les liens de paiement
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-700 mb-1.5">
                Code Marchand ORANGE MONEY
              </label>
              <input
                type="text"
                value={form.orangeMerchantNumber}
                onChange={e => setForm({ ...form, orangeMerchantNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 focus:ring-amber-500 text-xs font-mono font-bold text-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Code USSD #144#391# ou numéro
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                FREE MONEY (Marchand)
              </label>
              <input
                type="text"
                value={form.freeMerchantNumber}
                onChange={e => setForm({ ...form, freeMerchantNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              RIB Bancaire (Virements locataires)
            </label>
            <input
              type="text"
              value={form.ribIban}
              onChange={e => setForm({ ...form, ribIban: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-800"
            />
          </div>
        </div>

        {/* Submit & Reset actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => {
              if (confirm('Voulez-vous réinitialiser toutes les données de démonstration ?')) {
                resetToDefaults();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 font-bold hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser les données de démonstration</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer les paramètres</span>
          </button>
        </div>
      </form>
    </div>
  );
};
