import React, { useState } from 'react';
import {
  Home,
  Building2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Wrench,
  User,
  ExternalLink,
  Trash2,
  Edit,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Unit, UnitStatus } from '../../types';
import { formatFCFA } from '../../utils/formatters';

interface UnitsViewProps {
  onOpenAddUnit: () => void;
  onOpenAddTenantForUnit?: (unitId: string) => void;
  selectedBuildingFilter?: string;
}

export const UnitsView: React.FC<UnitsViewProps> = ({
  onOpenAddUnit,
  onOpenAddTenantForUnit,
  selectedBuildingFilter,
}) => {
  const { units, buildings, updateUnit, deleteUnit, setActiveTab } = useApp();

  const [buildingFilter, setBuildingFilter] = useState<string>(
    selectedBuildingFilter || 'all'
  );
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredUnits = units.filter(unit => {
    if (buildingFilter !== 'all' && unit.buildingId !== buildingFilter) return false;
    if (statusFilter !== 'all' && unit.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = unit.unitNumber.toLowerCase().includes(q);
      const matchBuilding = unit.buildingName.toLowerCase().includes(q);
      const matchTenant = unit.currentTenantName?.toLowerCase().includes(q);
      if (!matchNumber && !matchBuilding && !matchTenant) return false;
    }
    return true;
  });

  const totalOccupied = units.filter(u => u.status === 'occupe').length;
  const totalLibres = units.filter(u => u.status === 'libre').length;
  const totalTravaux = units.filter(u => u.status === 'en_travaux').length;

  return (
    <div className="space-y-6">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Gestion des logements
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Supervisez les appartements, studios, bureaux et magasins de vos immeubles.
          </p>
        </div>

        <button
          onClick={onOpenAddUnit}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Ajouter un logement</span>
        </button>
      </div>

      {/* KPI Stats Pill Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Total logements</span>
            <span className="text-xl font-black text-slate-900">{units.length}</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Home className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Occupés</span>
            <span className="text-xl font-black text-emerald-600">{totalOccupied}</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Libres / Vacants</span>
            <span className="text-xl font-black text-blue-600">{totalLibres}</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">En travaux</span>
            <span className="text-xl font-black text-amber-600">{totalTravaux}</span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Wrench className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par lot, locataire, immeuble..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Building filter */}
          <select
            value={buildingFilter}
            onChange={e => setBuildingFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">Tous les immeubles</option>
            {buildings.map(b => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Status buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'occupe', label: 'Occupés' },
              { id: 'libre', label: 'Libres' },
              { id: 'en_travaux', label: 'Travaux' },
            ].map(st => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st.id
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Units Grid */}
      {filteredUnits.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Home className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-800 text-sm">Aucun logement trouvé</p>
          <p className="text-xs text-slate-400 mt-1">Modifiez vos critères de recherche ou ajoutez un nouveau lot.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUnits.map(unit => {
            const totalRent = unit.rentAmount + unit.chargesAmount;

            return (
              <div
                key={unit.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:border-blue-200 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top lot badge and status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      {unit.unitNumber}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        unit.status === 'occupe'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : unit.status === 'libre'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {unit.status === 'occupe'
                        ? 'Occupé'
                        : unit.status === 'libre'
                        ? 'Libre'
                        : 'En travaux'}
                    </span>
                  </div>

                  {/* Building & Type */}
                  <p className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-500" />
                    {unit.buildingName}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium mb-3">
                    {unit.type} • Étage {unit.floor} • {unit.surfaceM2} m²
                  </p>

                  {/* Financials */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-500">Loyer total :</span>
                      <span className="text-base font-black text-slate-900">
                        {formatFCFA(totalRent)}
                      </span>
                    </div>
                    {unit.chargesAmount > 0 && (
                      <p className="text-[10px] text-slate-400 text-right mt-0.5">
                        dont {formatFCFA(unit.chargesAmount)} de charges communes
                      </p>
                    )}
                  </div>

                  {/* Tenant state */}
                  {unit.status === 'occupe' && unit.currentTenantName ? (
                    <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                          {unit.currentTenantName.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800">{unit.currentTenantName}</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('tenants')}
                        className="text-emerald-700 hover:text-emerald-900 font-semibold text-[11px] flex items-center gap-1"
                      >
                        <span>Fiche</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ) : unit.status === 'libre' ? (
                    <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs mb-3">
                      <span className="text-blue-800 font-medium text-[11px]">
                        Prêt à être loué
                      </span>
                      <button
                        onClick={() => {
                          if (onOpenAddTenantForUnit) onOpenAddTenantForUnit(unit.id);
                          setActiveTab('tenants');
                        }}
                        className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-2xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Attribuer locataire</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium mb-3">
                      Entretien en cours (peinture / plomberie)
                    </div>
                  )}
                </div>

                {/* Footer Controls: Quick status toggle or delete */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        updateUnit(unit.id, {
                          status:
                            unit.status === 'libre'
                              ? 'en_travaux'
                              : unit.status === 'en_travaux'
                              ? 'libre'
                              : 'libre',
                        })
                      }
                      className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 hover:underline"
                    >
                      {unit.status === 'libre'
                        ? 'Mettre en travaux'
                        : unit.status === 'en_travaux'
                        ? 'Marquer libre'
                        : 'Libérer'}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Supprimer le logement ${unit.unitNumber} ?`)) {
                        deleteUnit(unit.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Supprimer ce lot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
