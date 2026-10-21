import React, { useState } from 'react';
import { X, Home, Building2, Plus, Check } from 'lucide-react';
import { Unit, UnitType, UnitStatus } from '../../types';
import { useApp } from '../../context/AppContext';

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedBuildingId?: string;
}

export const AddUnitModal: React.FC<AddUnitModalProps> = ({
  isOpen,
  onClose,
  preselectedBuildingId,
}) => {
  const { buildings, addUnit } = useApp();

  const [buildingId, setBuildingId] = useState<string>(
    preselectedBuildingId || (buildings[0]?.id ?? '')
  );
  const [unitNumber, setUnitNumber] = useState('Appt B2');
  const [type, setType] = useState<UnitType>('Appartement F3');
  const [floor, setFloor] = useState<number>(1);
  const [surfaceM2, setSurfaceM2] = useState<number>(85);
  const [rentAmount, setRentAmount] = useState<number>(250000);
  const [chargesAmount, setChargesAmount] = useState<number>(20000);
  const [status, setStatus] = useState<UnitStatus>('libre');
  const [description, setDescription] = useState('Bel appartement avec balcon et séjour lumineux.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const building = buildings.find(b => b.id === buildingId);
    if (!building) return;

    addUnit({
      buildingId,
      buildingName: building.name,
      unitNumber,
      type,
      floor: Number(floor) || 0,
      surfaceM2: Number(surfaceM2) || 0,
      rentAmount: Number(rentAmount) || 0,
      chargesAmount: Number(chargesAmount) || 0,
      status,
      description,
      features: ['Balcon', 'Climatisation'],
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
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Ajouter un logement / lot</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Configurez un appartement, studio, bureau ou magasin sous gestion.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Immeuble de rattachement <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={buildingId}
              onChange={e => setBuildingId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 bg-white"
            >
              {buildings.map(b => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.district}, {b.city})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Identifiant / Numéro de lot <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={unitNumber}
                onChange={e => setUnitNumber(e.target.value)}
                placeholder="ex : Appt 1A, Studio 2..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Type de bien <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as UnitType)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 bg-white"
              >
                <option value="Studio">Studio</option>
                <option value="Appartement F2">Appartement F2</option>
                <option value="Appartement F3">Appartement F3</option>
                <option value="Appartement F4">Appartement F4</option>
                <option value="Appartement F5">Appartement F5</option>
                <option value="Magasin">Magasin / Commerce</option>
                <option value="Bureau">Bureau professionnel</option>
                <option value="Villa">Villa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Étage
              </label>
              <input
                type="number"
                min={0}
                value={floor}
                onChange={e => setFloor(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Surface (m²)
              </label>
              <input
                type="number"
                min={10}
                value={surfaceM2}
                onChange={e => setSurfaceM2(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Loyer mensuel hors charges (FCFA) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step={5000}
                required
                value={rentAmount}
                onChange={e => setRentAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Charges mensuelles (FCFA)
              </label>
              <input
                type="number"
                step={1000}
                value={chargesAmount}
                onChange={e => setChargesAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Statut initial
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'libre', label: 'Libre / Vacant', color: 'border-blue-500 bg-blue-50 text-blue-800' },
                { id: 'occupe', label: 'Occupé', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
                { id: 'en_travaux', label: 'En travaux', color: 'border-amber-500 bg-amber-50 text-amber-800' },
              ].map(st => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatus(st.id as UnitStatus)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                    status === st.id ? st.color : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description du logement
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="ex: Salon climatisé, cuisine avec placards, balcon..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
            />
          </div>

          {/* Footer actions */}
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
              <span>Créer le logement</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
