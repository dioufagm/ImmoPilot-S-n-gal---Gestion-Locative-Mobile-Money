import React, { useState } from 'react';
import {
  CalendarCheck,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  DollarSign,
  Download,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatFCFA, generateWhatsAppLink, exportToCSV } from '../../utils/formatters';

interface RentsScheduleViewProps {
  onOpenAddPaymentForTenant?: (tenant: any) => void;
}

export const RentsScheduleView: React.FC<RentsScheduleViewProps> = ({
  onOpenAddPaymentForTenant,
}) => {
  const { tenants, payments, settings, triggerBatchReminders, setViewingReceiptPayment } = useApp();

  const [selectedMonth, setSelectedMonth] = useState('Octobre 2026');
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  const months = ['Octobre 2026', 'Septembre 2026', 'Août 2026', 'Juillet 2026'];
  const buildings = ['all', ...Array.from(new Set(tenants.map(t => t.buildingName)))];

  const monthPayments = payments.filter(
    p => p.periodMonth.toLowerCase() === selectedMonth.toLowerCase()
  );

  const totalExpected = tenants.reduce((sum, t) => sum + t.rentAmount, 0);
  const totalCollected = monthPayments
    .filter(p => p.status === 'paye' || p.status === 'partiel')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalUnpaid = Math.max(0, totalExpected - totalCollected);
  const recoveryRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

  const filteredTenants = tenants.filter(t => {
    if (selectedBuilding !== 'all' && t.buildingName !== selectedBuilding) return false;
    return true;
  });

  const handleBatchRelance = () => {
    const res = triggerBatchReminders();
    setReminderToast(res.message);
    setTimeout(() => setReminderToast(null), 4000);
  };

  const handleExportSchedule = () => {
    const data = filteredTenants.map(t => {
      const pay = monthPayments.find(p => p.tenantId === t.id);
      return {
        Mois: selectedMonth,
        Locataire: t.fullName,
        Telephone: t.phone,
        Immeuble: t.buildingName,
        Lot: t.unitNumber,
        LoyerDu: t.rentAmount,
        MontantRegle: pay ? pay.amount : 0,
        ResteDu: pay ? Math.max(0, t.rentAmount - pay.amount) : t.rentAmount,
        Statut: pay ? pay.status : 'Non payé',
        Mode: pay?.method || '-',
      };
    });
    exportToCSV(`Echeancier_Loyers_${selectedMonth.replace(' ', '_')}`, data);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {reminderToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{reminderToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Suivi des loyers & Échéancier
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Échéancier mensuel, taux de recouvrement et relances automatiques en 1 clic.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportSchedule}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Exporter l'échéancier</span>
          </button>

          <button
            onClick={handleBatchRelance}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/25 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Relancer les impayés (WhatsApp & SMS)</span>
          </button>
        </div>
      </div>

      {/* Summary Recouvrement Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Loyers attendus ({selectedMonth})
          </span>
          <span className="text-2xl font-black text-slate-900">{formatFCFA(totalExpected)}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Total Encaissé
          </span>
          <span className="text-2xl font-black text-emerald-600">{formatFCFA(totalCollected)}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Reste à recouvrer (Impayés)
          </span>
          <span className="text-2xl font-black text-red-600">{formatFCFA(totalUnpaid)}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Taux de recouvrement
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-600">{recoveryRate}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${recoveryRate}%` }} />
          </div>
        </div>
      </div>

      {/* Month & Building selectors */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Mois :</span>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-blue-700 bg-blue-50/50"
          >
            {months.map(m => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Filtrer par immeuble :</span>
          <select
            value={selectedBuilding}
            onChange={e => setSelectedBuilding(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">Tous les immeubles</option>
            {buildings.filter(b => b !== 'all').map(b => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tenants Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80">
            <tr>
              <th className="p-3.5 pl-5">Locataire</th>
              <th className="p-3.5">Immeuble & Lot</th>
              <th className="p-3.5 text-right">Loyer dû</th>
              <th className="p-3.5 text-right">Réglé</th>
              <th className="p-3.5 text-center">Statut du mois</th>
              <th className="p-3.5 pr-5 text-right">Relance / Quittance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTenants.map(tenant => {
              const pay = monthPayments.find(p => p.tenantId === tenant.id);
              const paidAmount = pay ? pay.amount : 0;
              const due = tenant.rentAmount;
              const isFullyPaid = paidAmount >= due;
              const isPartial = paidAmount > 0 && paidAmount < due;
              const isOverdue = !pay || pay.status === 'retard' || paidAmount === 0;

              const whatsappRelance = `Bonjour ${tenant.fullName}, rappel pour votre loyer du mois de ${selectedMonth} (${formatFCFA(due - paidAmount)} restant dû) pour ${tenant.unitNumber} - ${tenant.buildingName}. Règlement rapide possible par Wave au ${settings.waveMerchantPhone}. Merci de votre diligence !`;

              return (
                <tr key={tenant.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5 pl-5">
                    <span className="font-bold text-slate-900 block">{tenant.fullName}</span>
                    <span className="text-[10px] text-slate-400">{tenant.phone}</span>
                  </td>

                  <td className="p-3.5">
                    <span className="font-semibold text-slate-800 block">{tenant.buildingName}</span>
                    <span className="text-[11px] text-blue-600 font-medium">{tenant.unitNumber}</span>
                  </td>

                  <td className="p-3.5 text-right font-black text-slate-900">
                    {formatFCFA(due)}
                  </td>

                  <td className="p-3.5 text-right font-bold text-emerald-700">
                    {formatFCFA(paidAmount)}
                  </td>

                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        isFullyPaid
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isPartial
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {isFullyPaid ? 'Soldé' : isPartial ? 'Partiel' : 'Impayé'}
                    </span>
                  </td>

                  <td className="p-3.5 pr-5 text-right">
                    {isFullyPaid && pay ? (
                      <button
                        onClick={() => setViewingReceiptPayment(pay)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-bold text-[11px] text-slate-700 inline-flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Quittance</span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={generateWhatsAppLink(tenant.phone, whatsappRelance)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] inline-flex items-center gap-1 shadow-2xs hover:bg-emerald-700 transition-colors"
                          title="Relance WhatsApp immédiate"
                        >
                          <Send className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>

                        {onOpenAddPaymentForTenant && (
                          <button
                            onClick={() => onOpenAddPaymentForTenant(tenant)}
                            className="px-2 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px]"
                            title="Encaisser"
                          >
                            Encaisser
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
