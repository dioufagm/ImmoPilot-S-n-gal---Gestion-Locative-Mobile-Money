import React, { useState } from 'react';
import {
  Building2,
  Key,
  Wallet,
  ShieldCheck,
  Plus,
  Download,
  MapPin,
  Home,
  Check,
  Trash2,
  Edit2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Building } from '../../types';
import { formatFCFA, exportToCSV, SENEGAL_AMENITIES } from '../../utils/formatters';

interface BuildingsViewProps {
  onOpenAddBuilding: () => void;
  onSelectBuildingForUnits?: (buildingId: string) => void;
}

export const BuildingsView: React.FC<BuildingsViewProps> = ({
  onOpenAddBuilding,
  onSelectBuildingForUnits,
}) => {
  const { buildings, units, deleteBuilding, setActiveTab } = useApp();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  const totalLots = units.length;
  const occupiedLots = units.filter(u => u.status === 'occupe').length;
  const vacantLots = units.filter(u => u.status === 'libre').length;
  const globalOccupancy = totalLots > 0 ? ((occupiedLots / totalLots) * 100).toFixed(1) : '0.0';

  const monthlyExpectedRevenue = units
    .filter(u => u.status === 'occupe')
    .reduce((sum, u) => sum + u.rentAmount + u.chargesAmount, 0);

  const districts = ['all', ...Array.from(new Set(buildings.map(b => b.district)))];

  const filteredBuildings =
    selectedDistrict === 'all'
      ? buildings
      : buildings.filter(b => b.district === selectedDistrict);

  const handleExport = () => {
    const exportData = buildings.map(b => {
      const bUnits = units.filter(u => u.buildingId === b.id);
      const occ = bUnits.filter(u => u.status === 'occupe').length;
      return {
        Nom: b.name,
        Type: b.type,
        Quartier: b.district,
        Ville: b.city,
        Adresse: b.address,
        LotsTotaux: b.totalUnitsCount,
        LotsConfigures: bUnits.length,
        Occupes: occ,
        Vacants: bUnits.length - occ,
        Annee: b.constructionYear,
      };
    });
    exportToCSV('ImmoPilot_Immeubles_Senegal', exportData);
  };

  return (
    <div className="space-y-6">
      {/* Title & Top Action Buttons (Exact Replica of Screenshot 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-blue-600 tracking-tight">
            Mes immeubles
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Supervisez les performances locatives et les unités de gestion de l'ensemble de votre parc.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Exporter</span>
          </button>

          <button
            onClick={onOpenAddBuilding}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Ajouter un immeuble</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards matching Screenshot 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Lots totaux sous gestion */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Lots totaux sous gestion</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none mb-2">
            {totalLots} <span className="text-sm font-semibold text-slate-500">logements</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              {occupiedLots} occupés
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              {vacantLots} vacants
            </span>
          </div>
        </div>

        {/* Taux d'occupation global */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Taux d'occupation global</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none mb-3">
            {globalOccupancy} %
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${globalOccupancy}%` }}
            />
          </div>
        </div>

        {/* Loyers mensuels attendus */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Loyers mensuels attendus</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none mb-1">
            {formatFCFA(monthlyExpectedRevenue)}
          </div>
          <p className="text-xs text-slate-400 font-medium">sur les logements occupés</p>
        </div>

        {/* Immeubles autorisés */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Immeubles autorisés</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 leading-none mb-2">
            {buildings.length} / 15 <span className="text-xs font-semibold text-slate-400">formule Pro</span>
          </div>
          {/* visual slots */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 15 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded-sm ${
                  idx < buildings.length ? 'bg-teal-500' : 'bg-slate-100'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Buildings Listing or Empty State */}
      {buildings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h4 className="text-base font-bold text-slate-800">Aucun immeuble pour l'instant</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Cliquez sur « Ajouter un immeuble » pour enregistrer votre premier bien et commencer la gestion.
          </p>
          <button
            onClick={onOpenAddBuilding}
            className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-600/25 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Ajouter un immeuble</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Quartier Filter Tabs */}
          {districts.length > 2 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {districts.map(dist => (
                <button
                  key={dist}
                  onClick={() => setSelectedDistrict(dist)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedDistrict === dist
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {dist === 'all' ? 'Tous les quartiers' : dist}
                </button>
              ))}
            </div>
          )}

          {/* Grid of Buildings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuildings.map(building => {
              const bUnits = units.filter(u => u.buildingId === building.id);
              const occCount = bUnits.filter(u => u.status === 'occupe').length;
              const bRevenue = bUnits
                .filter(u => u.status === 'occupe')
                .reduce((acc, curr) => acc + curr.rentAmount + curr.chargesAmount, 0);

              return (
                <div
                  key={building.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Image header with badges */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={building.photoUrl}
                      alt={building.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold">
                        {building.type}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold shadow-sm">
                        {building.floorsCount} étages
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        {building.district}, {building.city}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                          {building.name}
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-400">
                          Bâti en {building.constructionYear}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                        {building.description || building.address}
                      </p>

                      {/* Amenities pills */}
                      {building.amenities && building.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {building.amenities.slice(0, 4).map(aid => {
                            const item = SENEGAL_AMENITIES.find(a => a.id === aid);
                            if (!item) return null;
                            return (
                              <span
                                key={aid}
                                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                              >
                                {item.label}
                              </span>
                            );
                          })}
                          {building.amenities.length > 4 && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                              +{building.amenities.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Stats & Footer */}
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[11px]">Lots occupés</span>
                          <span className="font-bold text-slate-800">
                            {occCount} / {bUnits.length || building.totalUnitsCount} lots
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 block text-[11px]">Revenu mensuel</span>
                          <span className="font-extrabold text-blue-600">{formatFCFA(bRevenue)}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (onSelectBuildingForUnits) {
                              onSelectBuildingForUnits(building.id);
                            }
                            setActiveTab('units');
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Home className="w-3.5 h-3.5" />
                          <span>Voir les logements</span>
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Supprimer l'immeuble "${building.name}" et ses logements associés ?`)) {
                              deleteBuilding(building.id);
                            }
                          }}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Supprimer l'immeuble"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
