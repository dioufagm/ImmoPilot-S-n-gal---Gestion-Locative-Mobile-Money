import React, { useState } from 'react';
import { X, User, Phone, Mail, FileText, Check, Shield } from 'lucide-react';
import { Tenant } from '../../types';
import { useApp } from '../../context/AppContext';

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUnitId?: string;
}

export const AddTenantModal: React.FC<AddTenantModalProps> = ({
  isOpen,
  onClose,
  targetUnitId,
}) => {
  const { units, buildings, addTenant } = useApp();

  const vacantUnits = units.filter(u => u.status === 'libre' || u.id === targetUnitId);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+221 77 ');
  const [email, setEmail] = useState('');
  const [cniNumber, setCniNumber] = useState('1 780 1990 ');
  const [occupation, setOccupation] = useState('Cadre d’entreprise');
  const [unitId, setUnitId] = useState<string>(targetUnitId || vacantUnits[0]?.id || '');
  const [depositMonths, setDepositMonths] = useState<number>(2); // 2 mois de caution standard au Sénégal
  const [entryDate, setEntryDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('Bail à usage d’habitation.');

  if (!isOpen) return null;

  const selectedUnit = units.find(u => u.id === unitId);
  const totalRent = selectedUnit ? selectedUnit.rentAmount + selectedUnit.chargesAmount : 200000;
  const depositAmount = totalRent * depositMonths;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit || !fullName.trim() || !phone.trim()) return;

    addTenant({
      fullName,
      phone,
      email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      cniNumber,
      occupation,
      unitId: selectedUnit.id,
      unitNumber: selectedUnit.unitNumber,
      buildingId: selectedUnit.buildingId,
      buildingName: selectedUnit.buildingName,
      rentAmount: totalRent,
      depositAmount,
      entryDate,
      status: 'actif',
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Nouveau Locataire & Attribution de bail
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Enregistrez les coordonnées et les modalités de caution (Sénégal).
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nom et Prénom complet <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="ex : Babacar Ndiaye, Mariama Ba..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Numéro WhatsApp / Téléphone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+221 77 000 00 00"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="locataire@gmail.com"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                CNI / Passeport (Identité Sénégal)
              </label>
              <input
                type="text"
                value={cniNumber}
                onChange={e => setCniNumber(e.target.value)}
                placeholder="1 780 1990 00000"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Profession / Employeur
              </label>
              <input
                type="text"
                value={occupation}
                onChange={e => setOccupation(e.target.value)}
                placeholder="ex : Cadre banque, Commerçant..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Logement à attribuer <span className="text-red-500">*</span>
            </label>
            {vacantUnits.length === 0 ? (
              <p className="text-xs text-red-500 p-2.5 bg-red-50 rounded-xl">
                Aucun logement vacant pour le moment. Veuillez libérer un lot ou en ajouter un nouveau.
              </p>
            ) : (
              <select
                required
                value={unitId}
                onChange={e => setUnitId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 bg-white"
              >
                {vacantUnits.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.unitNumber} - {u.buildingName} (Loyer: {(u.rentAmount + u.chargesAmount).toLocaleString()} FCFA)
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Date d'entrée dans les lieux
              </label>
              <input
                type="date"
                value={entryDate}
                onChange={e => setEntryDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Caution (Mois de garantie)
              </label>
              <select
                value={depositMonths}
                onChange={e => setDepositMonths(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
              >
                <option value={1}>1 mois de caution</option>
                <option value={2}>2 mois de caution (légal standard)</option>
                <option value={3}>3 mois (caution + avance)</option>
              </select>
            </div>
          </div>

          {/* Caution summary box */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Montant de la caution calculée :</span>
            <span className="font-black text-slate-900 text-sm">
              {depositAmount.toLocaleString()} FCFA
            </span>
          </div>

          {/* Footer Actions */}
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
              disabled={vacantUnits.length === 0}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Valider le locataire</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
