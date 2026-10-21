import React, { useState } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Send,
  Sparkles,
  ArrowRight,
  Receipt,
  Building2,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Tenant, PaymentMethod } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatFCFA, generateWhatsAppLink } from '../../utils/formatters';

interface TenantPaymentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTenant?: Tenant | null;
}

export const TenantPaymentPortalModal: React.FC<TenantPaymentPortalModalProps> = ({
  isOpen,
  onClose,
  initialTenant,
}) => {
  const { tenants, settings, addPayment, setViewingReceiptPayment } = useApp();

  const [selectedTenantId, setSelectedTenantId] = useState<string>(
    initialTenant?.id || tenants[0]?.id || ''
  );
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('wave');
  const [tenantPayerPhone, setTenantPayerPhone] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successPayment, setSuccessPayment] = useState<any | null>(null);

  if (!isOpen) return null;

  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];
  const dueAmount = currentTenant ? currentTenant.rentAmount : 250000;

  const handlePayNow = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newPay = addPayment({
        tenantId: currentTenant.id,
        tenantName: currentTenant.fullName,
        tenantPhone: tenantPayerPhone || currentTenant.phone,
        unitId: currentTenant.unitId,
        unitNumber: currentTenant.unitNumber,
        buildingId: currentTenant.buildingId,
        buildingName: currentTenant.buildingName,
        periodMonth: 'Octobre 2026',
        periodYear: 2026,
        amount: dueAmount,
        expectedAmount: dueAmount,
        method: selectedMethod,
        transactionRef:
          selectedMethod === 'wave'
            ? `WV-SN-${Math.floor(100000 + Math.random() * 900000)}`
            : `OM-DKR-${Math.floor(1000000 + Math.random() * 9000000)}`,
        status: 'paye',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: `Paiement en ligne via portail mobile ${selectedMethod.toUpperCase()}.`,
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore if canvas not supported
      }

      setSuccessPayment(newPay);
    }, 1200);
  };

  const handleClose = () => {
    setSuccessPayment(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 pb-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider">
              Portail Sécurisé Sénégal
            </span>
          </div>
          <h3 className="text-xl font-black tracking-tight">Règlement de loyer en ligne</h3>
          <p className="text-xs text-blue-100">
            {settings.agencyName} • Paiement instantané Mobile Money
          </p>
        </div>

        {/* Success View */}
        {successPayment ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900">Paiement Réussi !</h4>
              <p className="text-xs text-slate-500 mt-1">
                Votre loyer d'un montant de{' '}
                <strong className="text-slate-900">{formatFCFA(successPayment.amount)}</strong> a bien été encaissé.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-left space-y-1.5 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-400">Réf. Transaction :</span>
                <span className="font-mono font-bold text-blue-600">{successPayment.transactionRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">N° Quittance :</span>
                <span className="font-bold text-slate-800">{successPayment.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Moyen de paiement :</span>
                <span className="font-bold text-slate-800 capitalize">
                  {successPayment.method.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setViewingReceiptPayment(successPayment);
                  handleClose();
                }}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Receipt className="w-4 h-4" />
                <span>Voir ma quittance officielle</span>
              </button>

              <button
                onClick={handleClose}
                className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs"
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Select tenant if not locked */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Sélectionnez le locataire :
              </label>
              <select
                value={selectedTenantId}
                onChange={e => setSelectedTenantId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 bg-white"
              >
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.fullName} — {t.unitNumber} ({t.buildingName})
                  </option>
                ))}
              </select>
            </div>

            {/* Rent Summary Box */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                  Loyer du mois d'octobre 2026
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  {currentTenant?.unitNumber} • {currentTenant?.buildingName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-blue-700">{formatFCFA(dueAmount)}</span>
              </div>
            </div>

            {/* Choose Mobile Money Provider */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Choisissez votre moyen de paiement Mobile Money :
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* WAVE */}
                <div
                  onClick={() => setSelectedMethod('wave')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedMethod === 'wave'
                      ? 'border-cyan-500 bg-cyan-50/40 shadow-sm ring-2 ring-cyan-200'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500 text-white font-black text-[11px]">
                      WAVE
                    </span>
                    <span className="text-[10px] text-cyan-700 font-bold">1% de frais</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">Wave Sénégal</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Marchand : {settings.waveMerchantPhone}
                  </p>
                </div>

                {/* ORANGE MONEY */}
                <div
                  onClick={() => setSelectedMethod('orange_money')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedMethod === 'orange_money'
                      ? 'border-amber-500 bg-amber-50/40 shadow-sm ring-2 ring-amber-200'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-white font-black text-[11px]">
                      ORANGE MONEY
                    </span>
                    <span className="text-[10px] text-amber-700 font-bold">Direct OM</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">Orange Money</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Code Marchand : #{settings.orangeMerchantNumber}
                  </p>
                </div>

                {/* FREE MONEY */}
                <div
                  onClick={() => setSelectedMethod('free_money')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedMethod === 'free_money'
                      ? 'border-red-500 bg-red-50/40 shadow-sm ring-2 ring-red-200'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[11px]">
                      FREE MONEY
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">Free Money</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">#150# direct</p>
                </div>

                {/* VIREMENT */}
                <div
                  onClick={() => setSelectedMethod('virement')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedMethod === 'virement'
                      ? 'border-slate-700 bg-slate-50 shadow-sm ring-2 ring-slate-300'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-slate-700 text-white font-black text-[11px]">
                      VIREMENT
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">Banque Sénégal</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{settings.bankName}</p>
                </div>
              </div>
            </div>

            {/* Phone input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Numéro Mobile Money du payeur (+221) :
              </label>
              <input
                type="text"
                placeholder={currentTenant?.phone || '+221 77 000 00 00'}
                value={tenantPayerPhone}
                onChange={e => setTenantPayerPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800"
              />
            </div>

            {/* QR Code / Visual Trust */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-xs text-slate-600">
              <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                Paiement direct sécurisé et crypté. La quittance officielle est générée et envoyée automatiquement dès confirmation.
              </span>
            </div>

            {/* Button */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
                selectedMethod === 'wave'
                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-cyan-500/25'
                  : selectedMethod === 'orange_money'
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25'
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Validation Mobile Money en cours...</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4" />
                  <span>Payer {formatFCFA(dueAmount)} via {selectedMethod.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
