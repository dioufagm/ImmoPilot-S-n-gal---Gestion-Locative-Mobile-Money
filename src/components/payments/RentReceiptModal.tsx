import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, QrCode, Building2, Download } from 'lucide-react';
import { Payment } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatFCFA, formatShortDate } from '../../utils/formatters';

interface RentReceiptModalProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RentReceiptModal: React.FC<RentReceiptModalProps> = ({
  payment,
  isOpen,
  onClose,
}) => {
  const { settings } = useApp();

  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'wave':
        return 'Mobile Money Wave Sénégal';
      case 'orange_money':
        return 'Orange Money Sénégal';
      case 'free_money':
        return 'Free Money Sénégal';
      case 'especes':
        return 'Espèces (Contre reçu)';
      case 'virement':
        return 'Virement Bancaire';
      default:
        return method;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Controls */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-sm text-slate-800">
              Quittance de Loyer Numérique — {payment.receiptNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer la quittance</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-8 sm:p-10 overflow-y-auto flex-1 text-slate-800 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-5 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  AB
                </div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {settings.agencyName}
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Gestion immobilière & Administration de biens
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {settings.address} • {settings.city}
              </p>
              <p className="text-[11px] text-slate-400">
                NINEA : {settings.ninea} • RC : {settings.rcNumber} • Tel : {settings.phone}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black uppercase tracking-wider mb-2">
                QUITTANCE DE LOYER
              </span>
              <p className="text-xs font-mono font-bold text-slate-800">{payment.receiptNumber}</p>
              <p className="text-[11px] text-slate-400">
                Délivrée le {formatShortDate(payment.paymentDate || new Date().toISOString())}
              </p>
            </div>
          </div>

          {/* Tenant & Property Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                LOCATAIRE (DÉBITEUR)
              </span>
              <p className="font-extrabold text-sm text-slate-900">{payment.tenantName}</p>
              <p className="text-slate-600 mt-1">Téléphone : {payment.tenantPhone}</p>
              <p className="text-slate-500 text-[11px]">Dakar, Sénégal</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                BIEN LOUÉ & AFFECTATION
              </span>
              <p className="font-extrabold text-sm text-slate-900">{payment.unitNumber}</p>
              <p className="text-slate-600 mt-1">
                Immeuble : <strong>{payment.buildingName}</strong>
              </p>
              <p className="text-slate-500 text-[11px]">Usage d'habitation / professionnel</p>
            </div>
          </div>

          {/* Payment Statement Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Désignation</th>
                  <th className="p-3">Période</th>
                  <th className="p-3 text-right">Montant réglé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-semibold text-slate-800">
                    Loyer principal et provisions pour charges
                  </td>
                  <td className="p-3 text-slate-600">{payment.periodMonth}</td>
                  <td className="p-3 text-right font-black text-slate-900 text-sm">
                    {formatFCFA(payment.amount)}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200 font-bold">
                <tr>
                  <td colSpan={2} className="p-3 text-slate-700">
                    TOTAL ACQUITTÉ
                  </td>
                  <td className="p-3 text-right text-base font-black text-emerald-700">
                    {formatFCFA(payment.amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Details & Stamp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-semibold">Mode de règlement :</span>
                <span className="font-bold text-slate-800">{getMethodLabel(payment.method)}</span>
                {payment.transactionRef && (
                  <p className="text-[11px] font-mono text-blue-600 mt-0.5">
                    Réf. Txn : {payment.transactionRef}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-[11px] text-emerald-800 font-medium">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>
                  Cette quittance atteste du paiement intégral du terme mentionné. Elle annule tous reçus antérieurs pour cette même période.
                </span>
              </div>
            </div>

            {/* Official Digital Stamp */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/20 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-1 shadow-sm">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="font-black text-xs text-emerald-800 tracking-wider uppercase">
                ACQUITTÉ - AB SERVICES
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                Signature : {settings.managerName}
              </span>
              <span className="text-[9px] font-mono text-slate-400 mt-1">
                Certifié conforme • Dakar Sénégal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
