import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Smartphone,
  Send,
  Building2,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Payment, PaymentMethod } from '../../types';
import { formatFCFA, formatShortDate, exportToCSV, generateWhatsAppLink } from '../../utils/formatters';

interface PaymentsViewProps {
  onOpenAddPayment: () => void;
  onOpenPortalModal: () => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  onOpenAddPayment,
  onOpenPortalModal,
}) => {
  const { payments, settings, setViewingReceiptPayment } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredPayments = payments.filter(p => {
    if (methodFilter !== 'all' && p.method !== methodFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTenant = p.tenantName.toLowerCase().includes(q);
      const matchUnit = p.unitNumber.toLowerCase().includes(q);
      const matchRef = p.transactionRef.toLowerCase().includes(q);
      const matchReceipt = p.receiptNumber.toLowerCase().includes(q);
      if (!matchTenant && !matchUnit && !matchRef && !matchReceipt) return false;
    }
    return true;
  });

  const totalCollected = payments
    .filter(p => p.status === 'paye' || p.status === 'partiel')
    .reduce((sum, p) => sum + p.amount, 0);

  const waveCollected = payments
    .filter(p => p.method === 'wave' && (p.status === 'paye' || p.status === 'partiel'))
    .reduce((sum, p) => sum + p.amount, 0);

  const omCollected = payments
    .filter(p => p.method === 'orange_money' && (p.status === 'paye' || p.status === 'partiel'))
    .reduce((sum, p) => sum + p.amount, 0);

  const handleExport = () => {
    const exportData = payments.map(p => ({
      Quittance: p.receiptNumber,
      Locataire: p.tenantName,
      Telephone: p.tenantPhone,
      Immeuble: p.buildingName,
      Lot: p.unitNumber,
      Mois: p.periodMonth,
      Montant: p.amount,
      Attendu: p.expectedAmount,
      Methode: p.method,
      Reference: p.transactionRef,
      Statut: p.status,
      DatePaiement: p.paymentDate,
    }));
    exportToCSV('ImmoPilot_Paiements_Senegal', exportData);
  };

  const getMethodBadge = (m: PaymentMethod) => {
    switch (m) {
      case 'wave':
        return <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-black">WAVE</span>;
      case 'orange_money':
        return <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">ORANGE MONEY</span>;
      case 'free_money':
        return <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black">FREE MONEY</span>;
      case 'virement':
        return <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black">VIREMENT</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-black">ESPÈCES</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Paiements & Mobile Money
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Registre des encaissements Wave, Orange Money, reçus et quittances numériques.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenPortalModal}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-cyan-500/20 active:scale-95"
          >
            <Smartphone className="w-4 h-4" />
            <span>Tester paiement locataire</span>
          </button>

          <button
            onClick={onOpenAddPayment}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Encaisser loyer</span>
          </button>
        </div>
      </div>

      {/* Mobile Money Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Total Encaissé</span>
            <CreditCard className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-2xl font-black text-slate-900">{formatFCFA(totalCollected)}</span>
          <p className="text-[11px] text-slate-400 mt-1">Tous modes confondus</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cyan-600">Wave Sénégal</span>
            <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 text-[10px] font-black">
              1% FRAIS
            </span>
          </div>
          <span className="text-2xl font-black text-cyan-600">{formatFCFA(waveCollected)}</span>
          <p className="text-[11px] text-slate-400 mt-1">Marchand : {settings.waveMerchantPhone}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-600">Orange Money</span>
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-black">
              DIRECT OM
            </span>
          </div>
          <span className="text-2xl font-black text-amber-600">{formatFCFA(omCollected)}</span>
          <p className="text-[11px] text-slate-400 mt-1">Marchand : #{settings.orangeMerchantNumber}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par locataire, quittance, réf txn..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Method Filter */}
          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">Tous les modes</option>
            <option value="wave">Wave</option>
            <option value="orange_money">Orange Money</option>
            <option value="free_money">Free Money</option>
            <option value="especes">Espèces</option>
            <option value="virement">Virement</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="paye">Soldé (Payé)</option>
            <option value="partiel">Partiel</option>
            <option value="retard">En retard</option>
          </select>

          <button
            onClick={handleExport}
            className="p-2 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80">
              <tr>
                <th className="p-3.5 pl-5">Quittance / Date</th>
                <th className="p-3.5">Locataire & Logement</th>
                <th className="p-3.5">Mois</th>
                <th className="p-3.5">Mode de paiement</th>
                <th className="p-3.5 text-right">Montant</th>
                <th className="p-3.5 text-center">Statut</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Aucun encaissement trouvé.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => {
                  const isPaid = p.status === 'paye';
                  const isLate = p.status === 'retard';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 pl-5">
                        <span className="font-mono font-bold text-slate-800 block">
                          {p.receiptNumber || 'EN COURS'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {p.paymentDate ? formatShortDate(p.paymentDate) : 'Non payé'}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block">{p.tenantName}</span>
                        <span className="text-[11px] text-slate-500">
                          {p.unitNumber} • {p.buildingName}
                        </span>
                      </td>

                      <td className="p-3.5 font-medium text-slate-700">{p.periodMonth}</td>

                      <td className="p-3.5">
                        {getMethodBadge(p.method)}
                        {p.transactionRef && (
                          <span className="block font-mono text-[10px] text-slate-400 mt-0.5">
                            {p.transactionRef}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-right">
                        <span className="font-black text-slate-900 block">
                          {formatFCFA(p.amount)}
                        </span>
                        {p.expectedAmount > p.amount && (
                          <span className="text-[10px] text-red-500 block">
                            Reste : {formatFCFA(p.expectedAmount - p.amount)}
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isLate
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {isPaid ? 'Soldé' : isLate ? 'En retard' : 'Partiel'}
                        </span>
                      </td>

                      <td className="p-3.5 pr-5 text-right">
                        {isPaid ? (
                          <button
                            onClick={() => setViewingReceiptPayment(p)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 font-semibold text-[11px] text-slate-600 inline-flex items-center gap-1 transition-colors"
                            title="Consulter et imprimer la quittance"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Quittance</span>
                          </button>
                        ) : (
                          <a
                            href={generateWhatsAppLink(
                              p.tenantPhone,
                              `Bonjour ${p.tenantName}, rappel pour le loyer ${p.periodMonth} (${formatFCFA(p.expectedAmount - p.amount)}). Règlement possible par Wave au ${settings.waveMerchantPhone}.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] inline-flex items-center gap-1 shadow-2xs hover:bg-emerald-700 transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            <span>Relancer</span>
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
