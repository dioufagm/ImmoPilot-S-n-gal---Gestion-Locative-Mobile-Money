import React, { useState } from 'react';
import { X, CreditCard, User, Building2, Check, Smartphone } from 'lucide-react';
import { PaymentMethod, PaymentStatus, Tenant } from '../../types';
import { useApp } from '../../context/AppContext';

interface NewPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTenant?: Tenant | null;
}

export const NewPaymentModal: React.FC<NewPaymentModalProps> = ({
  isOpen,
  onClose,
  targetTenant,
}) => {
  const { tenants, addPayment } = useApp();

  const [tenantId, setTenantId] = useState<string>(
    targetTenant?.id || tenants[0]?.id || ''
  );
  const [periodMonth, setPeriodMonth] = useState('Octobre 2026');
  const [amount, setAmount] = useState<number>(
    targetTenant ? targetTenant.rentAmount : (tenants[0]?.rentAmount ?? 250000)
  );
  const [method, setMethod] = useState<PaymentMethod>('wave');
  const [status, setStatus] = useState<PaymentStatus>('paye');
  const [transactionRef, setTransactionRef] = useState(`WV-${Date.now().toString().slice(-6)}`);
  const [notes, setNotes] = useState('Paiement reçu avec succès.');

  if (!isOpen) return null;

  const selectedTenant = tenants.find(t => t.id === tenantId) || tenants[0];

  const handleTenantChange = (newId: string) => {
    setTenantId(newId);
    const t = tenants.find(item => item.id === newId);
    if (t) setAmount(t.rentAmount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;

    addPayment({
      tenantId: selectedTenant.id,
      tenantName: selectedTenant.fullName,
      tenantPhone: selectedTenant.phone,
      unitId: selectedTenant.unitId,
      unitNumber: selectedTenant.unitNumber,
      buildingId: selectedTenant.buildingId,
      buildingName: selectedTenant.buildingName,
      periodMonth,
      periodYear: 2026,
      amount: Number(amount),
      expectedAmount: selectedTenant.rentAmount,
      method,
      transactionRef: transactionRef || `TXN-${Date.now().toString().slice(-6)}`,
      status,
      paymentDate: new Date().toISOString().split('T')[0],
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Encaisser un loyer
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Génération immédiate de la quittance numérique officielle.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Locataire concerné <span className="text-red-500">*</span>
            </label>
            <select
              value={tenantId}
              onChange={e => handleTenantChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white"
            >
              {tenants.map(t => (
                <option key={t.id} value={t.id}>
                  {t.fullName} — {t.unitNumber} ({t.buildingName})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mois de loyer <span className="text-red-500">*</span>
              </label>
              <select
                value={periodMonth}
                onChange={e => setPeriodMonth(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
              >
                <option value="Octobre 2026">Octobre 2026</option>
                <option value="Septembre 2026">Septembre 2026</option>
                <option value="Novembre 2026">Novembre 2026</option>
                <option value="Août 2026">Août 2026</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Montant encaissé (FCFA) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step={5000}
                required
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-black text-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Moyen de paiement
              </label>
              <select
                value={method}
                onChange={e => setMethod(e.target.value as PaymentMethod)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
              >
                <option value="wave">Wave Sénégal</option>
                <option value="orange_money">Orange Money</option>
                <option value="free_money">Free Money</option>
                <option value="especes">Espèces</option>
                <option value="virement">Virement bancaire</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Statut du loyer
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as PaymentStatus)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
              >
                <option value="paye">Loyer soldé (Payé)</option>
                <option value="partiel">Paiement partiel</option>
                <option value="retard">En retard / Impayé</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Référence de transaction (Wave / OM / Reçu)
            </label>
            <input
              type="text"
              value={transactionRef}
              onChange={e => setTransactionRef(e.target.value)}
              placeholder="ex : WV-SN-891230 ou #OM-190456"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Observations / Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="ex: Reçu sans réserve..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Valider l'encaissement</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
