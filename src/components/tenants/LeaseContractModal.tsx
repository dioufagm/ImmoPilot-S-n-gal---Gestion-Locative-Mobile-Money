import React from 'react';
import { X, Printer, Download, FileCheck, Building2 } from 'lucide-react';
import { Tenant } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatFCFA, formatShortDate } from '../../utils/formatters';

interface LeaseContractModalProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeaseContractModal: React.FC<LeaseContractModalProps> = ({
  tenant,
  isOpen,
  onClose,
}) => {
  const { settings, units, buildings } = useApp();

  if (!isOpen || !tenant) return null;

  const unit = units.find(u => u.id === tenant.unitId);
  const building = buildings.find(b => b.id === tenant.buildingId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Controls Bar */}
        <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-sm text-slate-800">
              Contrat de Bail Officiel — {tenant.fullName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer le contrat</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contract Printable Document */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 font-serif text-slate-900 text-xs sm:text-sm leading-relaxed space-y-6">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4">
            <p className="text-[10px] tracking-widest uppercase font-sans font-bold text-slate-500">
              RÉPUBLIQUE DU SÉNÉGAL • UN PEUPLE - UN BUT - UNE FOI
            </p>
            <h2 className="text-xl sm:text-2xl font-black font-sans tracking-tight text-slate-900 uppercase mt-2">
              CONTRAT DE BAIL À USAGE D'HABITATION
            </h2>
            <p className="text-xs font-sans text-slate-600 italic">
              Conforme au Code des Obligations Civiles et Commerciales (COCC) du Sénégal et aux textes sur la baisse des loyers.
            </p>
          </div>

          {/* Parties */}
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-blue-800 border-b border-blue-200 pb-1">
              ENTRE LES SOUSSIGNÉS :
            </h3>

            <div className="p-4 bg-slate-50 rounded-xl font-sans text-xs space-y-1">
              <p className="font-bold text-slate-900">
                1. LE BAILLEUR (ou son mandataire dûment habilité) :
              </p>
              <p>
                <strong>{settings.agencyName}</strong>, représentée par{' '}
                <strong>{settings.managerName}</strong>, agissant en qualité de gestionnaire mandataire.
              </p>
              <p>Adresse : {settings.address}, {settings.city}.</p>
              <p>Téléphone : {settings.phone} • NINEA : {settings.ninea} • RC : {settings.rcNumber}</p>
              <p className="italic text-slate-500">Ci-après dénommé « LE BAILLEUR », d'une part,</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl font-sans text-xs space-y-1">
              <p className="font-bold text-slate-900">2. LE PRENEUR (LE LOCATAIRE) :</p>
              <p>
                Monsieur / Madame : <strong>{tenant.fullName}</strong>
              </p>
              <p>Profession : {tenant.occupation || 'Salarié(e)'}</p>
              <p>Pièce d'identité (CNI / Passeport) : {tenant.cniNumber || 'Fournie à l’enregistrement'}</p>
              <p>Téléphone WhatsApp : {tenant.phone} • Email : {tenant.email}</p>
              <p className="italic text-slate-500">Ci-après dénommé « LE PRENEUR », d'autre part,</p>
            </div>
          </div>

          {/* Clauses */}
          <div className="space-y-4 font-sans text-xs">
            <div>
              <h4 className="font-bold text-slate-900 uppercase">Article 1 : Désignation des lieux loués</h4>
              <p className="text-slate-700 mt-1">
                Le Bailleur donne en location au Preneur qui accepte les lieux ci-après désignés : le logement{' '}
                <strong>{tenant.unitNumber}</strong> situé dans l’ensemble immobilier{' '}
                <strong>« {building?.name || tenant.buildingName} »</strong>, sis à {building?.address || 'Dakar'}, quartier{' '}
                <strong>{building?.district || 'Grand Dakar'}</strong>, {building?.city || 'Dakar'}.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase">Article 2 : Durée du bail</h4>
              <p className="text-slate-700 mt-1">
                Le présent bail est consenti et accepté pour une durée ferme de <strong>un (1) an</strong> renouvelable par tacite reconduction, prenant effet à compter du{' '}
                <strong>{formatShortDate(tenant.entryDate)}</strong>.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase">Article 3 : Loyer et modalités de règlement</h4>
              <p className="text-slate-700 mt-1">
                Le loyer mensuel net est fixé à la somme de{' '}
                <strong>{formatFCFA(tenant.rentAmount)}</strong>.
                Ce loyer est payable d’avance, au plus tard le <strong>cinq (5)</strong> de chaque mois civil,
                directement par <strong>Mobile Money Wave ({settings.waveMerchantPhone})</strong>, Orange Money marchand (#{settings.orangeMerchantNumber}) ou virement bancaire sur le compte de l'agence.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase">Article 4 : Dépôt de garantie (Caution)</h4>
              <p className="text-slate-700 mt-1">
                À titre de garantie de l'exécution de ses obligations, le Preneur verse ce jour la somme de{' '}
                <strong>{formatFCFA(tenant.depositAmount)}</strong>, représentant la caution légale.
                Cette somme lui sera restituée en fin de bail après état des lieux de sortie contradictoire et apurement de toutes dettes locatives.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase">Article 5 : Clause résolutoire</h4>
              <p className="text-slate-700 mt-1">
                À défaut de paiement d'un seul terme de loyer à son échéance ou en cas d'inexécution d'une seule des clauses du présent bail,
                la résiliation sera acquise de plein droit au Bailleur un mois après une mise en demeure restée infructueuse.
              </p>
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 font-sans text-xs">
            <div className="border border-slate-300 rounded-xl p-4 min-h-[140px] flex flex-col justify-between">
              <div>
                <p className="font-bold text-slate-900">Pour le Bailleur / L'Agence</p>
                <p className="text-[11px] text-slate-500">{settings.managerName} - {settings.agencyName}</p>
              </div>
              <div className="text-center font-mono text-[10px] text-blue-600 bg-blue-50 py-1 rounded border border-blue-200">
                [Cachet et Signature Électronique AB Services]
              </div>
            </div>

            <div className="border border-slate-300 rounded-xl p-4 min-h-[140px] flex flex-col justify-between">
              <div>
                <p className="font-bold text-slate-900">Le Preneur (Locataire)</p>
                <p className="text-[11px] text-slate-500">« Lu et approuvé, bon pour accord »</p>
              </div>
              <p className="font-semibold text-slate-800 text-center border-t border-dashed border-slate-300 pt-2">
                {tenant.fullName}
              </p>
            </div>
          </div>

          <div className="text-center text-[10px] font-sans text-slate-400 pt-4">
            Fait à Dakar, le {formatShortDate(new Date().toISOString())} en deux (2) exemplaires originaux.
          </div>
        </div>
      </div>
    </div>
  );
};
