import React from 'react';
import {
  Building2,
  Home,
  AlertCircle,
  Wallet,
  ArrowRight,
  Plus,
  Send,
  CheckCircle2,
  Smartphone,
  ExternalLink,
  CreditCard,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatFCFA, generateWhatsAppLink } from '../../utils/formatters';

interface DashboardViewProps {
  onOpenAddBuilding: () => void;
  onOpenAddPayment: () => void;
  onOpenPortalModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenAddBuilding,
  onOpenAddPayment,
  onOpenPortalModal,
}) => {
  const { buildings, units, tenants, payments, settings, setActiveTab, setViewingReceiptPayment } = useApp();

  const totalBuildings = buildings.length;
  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === 'occupe').length;
  const vacantUnits = units.filter(u => u.status === 'libre').length;
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

  // Payments calculations for current month (Octobre 2026)
  const currentMonthPayments = payments.filter(p => p.periodMonth.toLowerCase().includes('octobre'));
  const collectedThisMonth = currentMonthPayments
    .filter(p => p.status === 'paye' || p.status === 'partiel')
    .reduce((sum, p) => sum + p.amount, 0);

  const unpaidThisMonth = currentMonthPayments
    .filter(p => p.status === 'retard' || p.status === 'partiel')
    .reduce((sum, p) => sum + (p.expectedAmount - p.amount), 0);

  const latePaymentsList = currentMonthPayments.filter(
    p => p.status === 'retard' || (p.status === 'partiel' && p.amount < p.expectedAmount)
  );

  const recentSuccessfulPayments = payments
    .filter(p => p.status === 'paye')
    .slice(0, 5);

  // 12 months simulated revenue series
  const monthsData = [
    { month: 'nov', amount: 1450000 },
    { month: 'déc', amount: 1520000 },
    { month: 'janv', amount: 1580000 },
    { month: 'févr', amount: 1650000 },
    { month: 'mars', amount: 1720000 },
    { month: 'avr', amount: 1780000 },
    { month: 'mai', amount: 1850000 },
    { month: 'juin', amount: 1890000 },
    { month: 'juil', amount: 1950000 },
    { month: 'août', amount: 2050000 },
    { month: 'sept', amount: 2150000 },
    { month: 'oct', amount: collectedThisMonth > 0 ? collectedThisMonth : 1630000 },
  ];

  const totalYearRevenue = monthsData.reduce((acc, curr) => acc + curr.amount, 0);
  const maxAmount = Math.max(...monthsData.map(d => d.amount));

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Bonjour {settings.managerName.split(' ')[0]}
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Le résumé de votre patrimoine et de vos loyers à Dakar et au Sénégal.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenPortalModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20 hover:opacity-95 transition-all"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Portail Paiement Wave</span>
          </button>
          <button
            onClick={onOpenAddPayment}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-all"
          >
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span>Encaisser un loyer</span>
          </button>
          <button
            onClick={onOpenAddBuilding}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter un immeuble</span>
          </button>
        </div>
      </div>

      {/* Top Banner if user wants to add/explore */}
      {totalBuildings === 0 ? (
        <div
          onClick={onOpenAddBuilding}
          className="cursor-pointer group flex items-center justify-between p-4 rounded-2xl bg-blue-50 border border-blue-200 hover:border-blue-300 hover:bg-blue-100/70 transition-all text-blue-800"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">
                Bienvenue ! Commencez par ajouter votre premier immeuble.
              </p>
              <p className="text-xs text-blue-600/80">Configurez les lots, les étages et vos locataires.</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
        </div>
      ) : (
        <div className="flex items-center justify-between p-3.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-medium shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              Suivi d’échéance du mois en cours : <strong>Octobre 2026</strong>. {latePaymentsList.length} impayé(s) nécessitant une relance.
            </span>
          </div>
          <button
            onClick={() => setActiveTab('rents')}
            className="text-blue-300 hover:text-white font-semibold flex items-center gap-1 hover:underline"
          >
            <span>Consulter l’échéancier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 4 Top KPI Cards - Identical to screenshot 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Immeubles */}
        <div
          onClick={() => setActiveTab('buildings')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Immeubles</span>
            <span className="text-2xl font-extrabold text-slate-900">{totalBuildings}</span>
          </div>
        </div>

        {/* Card 2: Logements occupés */}
        <div
          onClick={() => setActiveTab('units')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Home className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Logements occupés</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">
                {occupiedUnits} / {totalUnits}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                {occupancyRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Loyers impayés */}
        <div
          onClick={() => setActiveTab('rents')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-500">Loyers impayés</span>
              {latePaymentsList.length > 0 && (
                <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.2 rounded-full">
                  {latePaymentsList.length}
                </span>
              )}
            </div>
            <span className="text-xl sm:text-2xl font-extrabold text-red-600">
              {formatFCFA(unpaidThisMonth)}
            </span>
          </div>
        </div>

        {/* Card 4: Encaissé ce mois */}
        <div
          onClick={() => setActiveTab('payments')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all cursor-pointer flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Wallet className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Encaissé ce mois</span>
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-700">
              {formatFCFA(collectedThisMonth)}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Section: Évolution des revenus */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Évolution des revenus
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Loyers encaissés sur les 12 derniers mois (Dakar & régions)
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium mr-1.5">Total encaissé :</span>
            <span className="text-sm font-black text-slate-900">
              {formatFCFA(totalYearRevenue)}
            </span>
          </div>
        </div>

        {/* Interactive Bar Chart */}
        <div className="pt-6 pb-2">
          <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2">
            {monthsData.map((d, index) => {
              const heightPercent = maxAmount > 0 ? (d.amount / maxAmount) * 100 : 20;
              const isCurrent = index === monthsData.length - 1;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-900 text-white py-1 px-1.5 rounded shadow whitespace-nowrap -mb-1 z-10 pointer-events-none font-medium">
                    {formatFCFA(d.amount)}
                  </div>
                  <div className="w-full max-w-[42px] bg-slate-100 rounded-t-lg h-full flex items-end overflow-hidden">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isCurrent
                          ? 'bg-gradient-to-t from-blue-600 to-indigo-500 shadow-md shadow-blue-500/30'
                          : 'bg-blue-200 group-hover:bg-blue-400'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-semibold uppercase ${
                      isCurrent ? 'text-blue-600 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Split Bottom Sections: Loyers impayés & Derniers encaissements Mobile Money */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loyers impayés & en retard */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <h4 className="font-bold text-sm text-slate-900">
                Loyers impayés & en retard ({latePaymentsList.length})
              </h4>
            </div>
            <span className="text-xs font-bold text-red-600">
              {formatFCFA(unpaidThisMonth)}
            </span>
          </div>

          <div className="flex-1 space-y-2.5">
            {latePaymentsList.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Tous les loyers du mois sont à jour !</p>
                <p className="text-[11px] text-slate-400">Aucun retard d’encaissement enregistré.</p>
              </div>
            ) : (
              latePaymentsList.map(pay => {
                const due = pay.expectedAmount - pay.amount;
                const whatsappMsg = `Bonjour ${pay.tenantName}, rappel amical pour votre loyer ${pay.periodMonth} (${pay.unitNumber} - ${pay.buildingName}). Montant restant dû : ${due.toLocaleString()} FCFA. Vous pouvez régler immédiatement par Wave au ${settings.waveMerchantPhone}. Merci !`;
                const whatsappUrl = generateWhatsAppLink(pay.tenantPhone, whatsappMsg);

                return (
                  <div
                    key={pay.id}
                    className="p-3 rounded-xl border border-red-100 bg-red-50/40 hover:bg-red-50/70 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{pay.tenantName}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 font-semibold text-slate-600">
                          {pay.unitNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {pay.buildingName} • Tel : {pay.tenantPhone}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="font-black text-red-600 block">{formatFCFA(due)}</span>
                        <span className="text-[10px] text-red-500 font-medium">En attente</span>
                      </div>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                        title="Relancer immédiatement par WhatsApp"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Derniers encaissements Mobile Money */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h4 className="font-bold text-sm text-slate-900">
                Derniers encaissements reçus
              </h4>
            </div>
            <button
              onClick={() => setActiveTab('payments')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Voir tout
            </button>
          </div>

          <div className="flex-1 space-y-2.5">
            {recentSuccessfulPayments.map(pay => (
              <div
                key={pay.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] text-white shadow-2xs ${
                      pay.method === 'wave'
                        ? 'bg-cyan-500'
                        : pay.method === 'orange_money'
                        ? 'bg-amber-500'
                        : pay.method === 'free_money'
                        ? 'bg-red-600'
                        : 'bg-slate-700'
                    }`}
                  >
                    {pay.method === 'wave'
                      ? 'WV'
                      : pay.method === 'orange_money'
                      ? 'OM'
                      : pay.method === 'free_money'
                      ? 'FM'
                      : 'ESP'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{pay.tenantName}</div>
                    <div className="text-[11px] text-slate-400">
                      {pay.buildingName} • {pay.unitNumber}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 block">
                      +{formatFCFA(pay.amount)}
                    </span>
                    <span className="text-[10px] text-slate-400">{pay.paymentDate}</span>
                  </div>
                  <button
                    onClick={() => setViewingReceiptPayment(pay)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:text-blue-600"
                    title="Voir la quittance officielle"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
