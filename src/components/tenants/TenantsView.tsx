import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Building2,
  Home,
  Send,
  FileText,
  CreditCard,
  Trash2,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Tenant } from '../../types';
import { formatFCFA, formatShortDate, generateWhatsAppLink } from '../../utils/formatters';
import { AddTenantModal } from './AddTenantModal';
import { LeaseContractModal } from './LeaseContractModal';

interface TenantsViewProps {
  onOpenAddPaymentForTenant?: (tenant: Tenant) => void;
  onOpenPortalForTenant?: (tenant: Tenant) => void;
}

export const TenantsView: React.FC<TenantsViewProps> = ({
  onOpenAddPaymentForTenant,
  onOpenPortalForTenant,
}) => {
  const { tenants, payments, settings, deleteTenant } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contractTenant, setContractTenant] = useState<Tenant | null>(null);

  const filteredTenants = tenants.filter(t => {
    if (selectedBuilding !== 'all' && t.buildingId !== selectedBuilding) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.fullName.toLowerCase().includes(q);
      const matchPhone = t.phone.toLowerCase().includes(q);
      const matchUnit = t.unitNumber.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchUnit) return false;
    }
    return true;
  });

  const buildingsList = ['all', ...Array.from(new Set(tenants.map(t => t.buildingId)))];

  return (
    <div className="space-y-6">
      {/* Modals */}
      <AddTenantModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <LeaseContractModal
        tenant={contractTenant}
        isOpen={!!contractTenant}
        onClose={() => setContractTenant(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Gestion des locataires
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Fiches locataires, contrats de bail, cautions et relances WhatsApp directes.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/25 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nouveau locataire</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, lot..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          {filteredTenants.length} locataire(s) actif(s) sous bail
        </div>
      </div>

      {/* Tenants Cards Grid */}
      {filteredTenants.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-800 text-sm">Aucun locataire trouvé</p>
          <p className="text-xs text-slate-400 mt-1">Ajoutez un premier locataire ou modifiez votre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTenants.map(tenant => {
            // Check payment status for current month
            const currentPay = payments.find(
              p => p.tenantId === tenant.id && p.periodMonth.toLowerCase().includes('octobre')
            );
            const isLate = currentPay?.status === 'retard' || currentPay?.status === 'partiel';
            const isPaid = currentPay?.status === 'paye';

            const whatsappMessage = `Bonjour ${tenant.fullName}, de la part de l'agence AB Services (Immeuble ${tenant.buildingName}, lot ${tenant.unitNumber}). Votre loyer de ${formatFCFA(tenant.rentAmount)} pour le mois d'octobre est exigible. Merci de procéder au paiement par Wave au ${settings.waveMerchantPhone} ou par Orange Money. Belle journée !`;
            const whatsappLink = generateWhatsAppLink(tenant.phone, whatsappMessage);

            return (
              <div
                key={tenant.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top user row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                        {tenant.fullName
                          .split(' ')
                          .map(n => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900 leading-tight">
                          {tenant.fullName}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {tenant.occupation || 'Locataire'}
                        </p>
                      </div>
                    </div>

                    {/* Status pill */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isPaid
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isLate
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isPaid ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Loyer à jour
                        </>
                      ) : isLate ? (
                        <>
                          <AlertCircle className="w-3 h-3 text-red-600" />
                          Impayé
                        </>
                      ) : (
                        'En cours'
                      )}
                    </span>
                  </div>

                  {/* Lot & Building info */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-600" />
                        {tenant.buildingName}
                      </span>
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                        {tenant.unitNumber}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                      <span>Loyer mensuel :</span>
                      <span className="font-black text-slate-900 text-xs">
                        {formatFCFA(tenant.rentAmount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Caution déposée :</span>
                      <span className="font-bold text-slate-700">
                        {formatFCFA(tenant.depositAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Contacts */}
                  <div className="space-y-1 text-xs text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-medium">{tenant.phone}</span>
                    </div>
                    {tenant.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px] text-slate-500 truncate">{tenant.email}</span>
                      </div>
                    )}
                    {tenant.cniNumber && (
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px] text-slate-500">CNI : {tenant.cniNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* WhatsApp Reminder */}
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
                      title="Envoyer un rappel ou reçu par WhatsApp"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    {/* View Contract */}
                    <button
                      onClick={() => setContractTenant(tenant)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Consulter le contrat de bail légal"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Contrat</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {onOpenAddPaymentForTenant && (
                      <button
                        onClick={() => onOpenAddPaymentForTenant(tenant)}
                        className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1"
                        title="Encaisser un paiement pour ce locataire"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Encaisser</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm(`Résilier et supprimer le locataire ${tenant.fullName} ? Le logement deviendra libre.`)) {
                          deleteTenant(tenant.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Supprimer le locataire"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
