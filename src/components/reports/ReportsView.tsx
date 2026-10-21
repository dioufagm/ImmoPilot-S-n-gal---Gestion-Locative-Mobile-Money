import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  Building2,
  PieChart,
  Calendar,
  Wallet,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatFCFA, exportToCSV } from '../../utils/formatters';

export const ReportsView: React.FC = () => {
  const { buildings, units, tenants, payments, settings } = useApp();

  const totalCollected = payments
    .filter(p => p.status === 'paye' || p.status === 'partiel')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalExpectedAll = tenants.reduce((sum, t) => sum + t.rentAmount, 0);

  // Revenue per building
  const buildingStats = buildings.map(b => {
    const bUnits = units.filter(u => u.buildingId === b.id);
    const bTenants = tenants.filter(t => t.buildingId === b.id);
    const bMonthly = bTenants.reduce((sum, t) => sum + t.rentAmount, 0);
    const bCollected = payments
      .filter(p => p.buildingId === b.id && (p.status === 'paye' || p.status === 'partiel'))
      .reduce((sum, p) => sum + p.amount, 0);
    const occRate = bUnits.length > 0 ? Math.round((bTenants.length / bUnits.length) * 100) : 0;

    return {
      id: b.id,
      name: b.name,
      district: b.district,
      lotsCount: bUnits.length,
      tenantsCount: bTenants.length,
      monthlyExpected: bMonthly,
      collected: bCollected,
      occupancyRate: occRate,
    };
  });

  // Mobile money share
  const waveAmount = payments
    .filter(p => p.method === 'wave' && (p.status === 'paye' || p.status === 'partiel'))
    .reduce((sum, p) => sum + p.amount, 0);

  const omAmount = payments
    .filter(p => p.method === 'orange_money' && (p.status === 'paye' || p.status === 'partiel'))
    .reduce((sum, p) => sum + p.amount, 0);

  const freeAmount = payments
    .filter(p => p.method === 'free_money' && (p.status === 'paye' || p.status === 'partiel'))
    .reduce((sum, p) => sum + p.amount, 0);

  const bankOrCashAmount = totalCollected - waveAmount - omAmount - freeAmount;

  const handleExportFullReport = () => {
    const exportData = buildingStats.map(b => ({
      Immeuble: b.name,
      Quartier: b.district,
      NombreLots: b.lotsCount,
      Locataires: b.tenantsCount,
      TauxOccupation: `${b.occupancyRate}%`,
      LoyerMensuelAttendu: b.monthlyExpected,
      TotalEncaisse: b.collected,
    }));
    exportToCSV('Rapport_Financier_Gestion_Locative_Senegal', exportData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Rapports financiers & Statistiques
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Revenus locatifs, répartition par immeuble et performance des canaux Mobile Money.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Imprimer le bilan</span>
          </button>

          <button
            onClick={handleExportFullReport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 active:scale-95"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Exporter en CSV (Excel)</span>
          </button>
        </div>
      </div>

      {/* Top 3 KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Chiffre d'affaires encaissé</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-700">{formatFCFA(totalCollected)}</span>
          <p className="text-[11px] text-slate-400 mt-1">Cumul encaissements exercice 2026</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Potentiel mensuel à 100%</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-black text-blue-600">{formatFCFA(totalExpectedAll)}</span>
          <p className="text-[11px] text-slate-400 mt-1">Sur l'ensemble des baux actifs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Taux Mobile Money</span>
            <PieChart className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-2xl font-black text-indigo-700">
            {totalCollected > 0
              ? Math.round(((waveAmount + omAmount + freeAmount) / totalCollected) * 100)
              : 85}
            %
          </span>
          <p className="text-[11px] text-slate-400 mt-1">
            Paiements dématérialisés Wave & Orange Money
          </p>
        </div>
      </div>

      {/* Breakdown By Building */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Rentabilité et encaissement par immeuble
        </h3>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          Comparaison du chiffre d'affaires et du taux d'occupation par résidence à Dakar.
        </p>

        <div className="space-y-5">
          {buildingStats.map(b => {
            const share = totalCollected > 0 ? (b.collected / totalCollected) * 100 : 0;
            return (
              <div key={b.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      {b.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {b.district} • {b.lotsCount} lots ({b.occupancyRate}% occupé)
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-base font-black text-slate-900 block">
                      {formatFCFA(b.collected)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Attendu mensuel : {formatFCFA(b.monthlyExpected)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(10, share))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Money Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Wave */}
        <div className="p-5 rounded-2xl bg-cyan-50/60 border border-cyan-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-black text-xs text-cyan-800">WAVE SÉNÉGAL</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-600 text-white font-bold text-[10px]">
              {totalCollected > 0 ? Math.round((waveAmount / totalCollected) * 100) : 0}%
            </span>
          </div>
          <span className="text-xl font-black text-slate-900">{formatFCFA(waveAmount)}</span>
          <p className="text-xs text-slate-500 mt-1">
            Numéro récepteur : {settings.waveMerchantPhone}
          </p>
        </div>

        {/* Orange Money */}
        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-black text-xs text-amber-800">ORANGE MONEY</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px]">
              {totalCollected > 0 ? Math.round((omAmount / totalCollected) * 100) : 0}%
            </span>
          </div>
          <span className="text-xl font-black text-slate-900">{formatFCFA(omAmount)}</span>
          <p className="text-xs text-slate-500 mt-1">
            Code marchand : #{settings.orangeMerchantNumber}
          </p>
        </div>

        {/* Autre */}
        <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-black text-xs text-slate-800">AUTRES (ESPÈCES & VIREMENT)</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-700 text-white font-bold text-[10px]">
              {totalCollected > 0 ? Math.round((bankOrCashAmount / totalCollected) * 100) : 0}%
            </span>
          </div>
          <span className="text-xl font-black text-slate-900">{formatFCFA(bankOrCashAmount)}</span>
          <p className="text-xs text-slate-500 mt-1">Bordereaux bancaires et caisse</p>
        </div>
      </div>
    </div>
  );
};
