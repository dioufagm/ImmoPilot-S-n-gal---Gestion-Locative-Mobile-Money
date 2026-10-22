import React, { useState } from 'react';
import {
  User,
  Building2,
  Lock,
  CreditCard,
  HelpCircle,
  Users,
  Eye,
  EyeOff,
  Save,
  Check,
  CheckCircle2,
  AlertCircle,
  Send,
  Plus,
  Trash2,
  Clock,
  Sparkles,
  Download,
  Smartphone,
  Shield,
  LifeBuoy,
  LogOut,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp, SettingsSubTab } from '../../context/AppContext';
import { AdminUser } from '../../types';
import { formatFCFA, formatShortDate } from '../../utils/formatters';

export const SettingsView: React.FC = () => {
  const {
    settingsSubTab,
    setSettingsSubTab,
    userProfile,
    updateUserProfile,
    changePassword,
    adminUsers,
    addAdminUser,
    updateAdminUser,
    deleteAdminUser,
    subscriptionInfo,
    subscriptionInvoices,
    renewSubscription,
    supportTickets,
    addSupportTicket,
    settings,
    updateSettings,
    buildings,
    tenants,
    setIsLogoutConfirmOpen,
  } = useApp();

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Profil state
  const [profilForm, setProfilForm] = useState({
    fullName: userProfile.fullName,
    phone: userProfile.phone,
    email: userProfile.email,
  });

  const handleSaveProfil = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profilForm);
    showToast('Profil mis à jour avec succès !');
  };

  // 2. Sécurité / Mot de passe state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (!currentPassword) {
      setPasswordError('Veuillez renseigner votre mot de passe actuel.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Les deux nouveaux mots de passe ne correspondent pas.');
      return;
    }

    const res = changePassword(currentPassword, newPassword);
    if (res.success) {
      showToast(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordError(res.message);
    }
  };

  // 3. Abonnement state
  const [selectedSubPlan, setSelectedSubPlan] = useState<'Pro' | 'Enterprise'>('Pro');
  const [selectedDuration, setSelectedDuration] = useState<1 | 3 | 12>(1);
  const [subPhone, setSubPhone] = useState(userProfile.phone || '777030600');
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<
    'Orange Money' | 'Wave' | 'MTN MoMo'
  >('Orange Money');
  const [isRenewing, setIsRenewing] = useState(false);

  const planBasePrice = selectedSubPlan === 'Pro' ? 15000 : 45000;
  const computedSubTotal =
    selectedDuration === 12 ? planBasePrice * 10 : planBasePrice * selectedDuration;

  const handleRenewSubscription = () => {
    setIsRenewing(true);
    setTimeout(() => {
      setIsRenewing(false);
      renewSubscription(selectedSubPlan, selectedDuration, selectedPaymentProvider, subPhone);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
      showToast(
        `Abonnement ${selectedSubPlan} (${selectedDuration} mois) renouvelé avec succès !`
      );
    }, 1000);
  };

  // 4. Support state
  const [supportSubject, setSupportSubject] = useState('');
  const [supportUrgency, setSupportUrgency] = useState<'Normale' | 'Haute' | 'Urgente'>('Normale');
  const [supportMessage, setSupportMessage] = useState('');

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportSubject.trim() || !supportMessage.trim()) return;

    addSupportTicket({
      subject: supportSubject,
      urgency: supportUrgency,
      message: supportMessage,
    });
    setSupportSubject('');
    setSupportMessage('');
    showToast('Votre message a bien été transmis au support IMMO PILOT !');
  };

  // 5. Agence state
  const [agencyForm, setAgencyForm] = useState(settings);

  const handleSaveAgency = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(agencyForm);
    showToast('Coordonnées de l’agence enregistrées !');
  };

  // 6. User Management (Admin team) state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newUserFullName, setNewUserFullName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('+221 77 ');
  const [newUserRole, setNewUserRole] = useState<
    'Super Admin' | 'Gestionnaire' | 'Comptable' | 'Agent Terrain'
  >('Gestionnaire');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserFullName.trim() || !newUserEmail.trim()) return;

    addAdminUser({
      fullName: newUserFullName,
      email: newUserEmail,
      phone: newUserPhone,
      role: newUserRole,
      status: 'actif',
    });

    setNewUserFullName('');
    setNewUserEmail('');
    setNewUserPhone('+221 77 ');
    setIsInviteModalOpen(false);
    showToast(`Utilisateur ${newUserFullName} ajouté à l'équipe !`);
  };

  // Subtabs configuration
  const subTabs = [
    { id: 'profil', label: 'Profil', icon: User },
    { id: 'agence', label: 'Agence', icon: Building2 },
    { id: 'utilisateurs', label: 'Utilisateurs', icon: Users },
    { id: 'securite', label: 'Sécurité', icon: Lock },
    { id: 'abonnement', label: 'Abonnement', icon: CreditCard },
    { id: 'support', label: 'Support', icon: HelpCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Title matching user's screenshots */}
      <div>
        <h2 className="text-3xl font-black text-blue-600 tracking-tight">Paramètres</h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Gérez votre compte, votre agence et votre abonnement.
        </p>
      </div>

      {/* Main Layout: Left Sidebar Subtabs + Right Content */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Subtab Navigation */}
        <div className="md:col-span-3 space-y-1">
          {subTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = settingsSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSettingsSubTab(tab.id as SettingsSubTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <div className="pt-2 my-2 border-t border-slate-200" />
          <button
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Déconnexion</span>
          </button>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-9 space-y-6">
          {/* ========================================================= */}
          {/* 1. PROFIL SUBTAB (Matches image_f7b42411.png)            */}
          {/* ========================================================= */}
          {settingsSubTab === 'profil' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Profil</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Vos informations personnelles, visibles dans l'application.
                </p>
              </div>

              <form onSubmit={handleSaveProfil} className="p-6 space-y-6">
                {/* User Avatar & Name Banner */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-blue-600/20">
                    {profilForm.fullName.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{profilForm.fullName}</h4>
                    <p className="text-xs text-slate-400 font-medium">
                      Inscrit le {userProfile.registrationDate}
                    </p>
                  </div>
                </div>

                {/* Form Fields matching image_f7b42411.png */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={profilForm.fullName}
                      onChange={e => setProfilForm({ ...profilForm, fullName: e.target.value })}
                      placeholder="Abdoulaye DIOUF"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={profilForm.phone}
                      onChange={e => setProfilForm({ ...profilForm, phone: e.target.value })}
                      placeholder="777030600"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Adresse e-mail (identifiant de connexion)
                  </label>
                  <input
                    type="email"
                    value={profilForm.email}
                    onChange={e => setProfilForm({ ...profilForm, email: e.target.value })}
                    placeholder="dioufagm@gmail.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-slate-800"
                  />
                </div>

                {/* Footer Save Button matching screenshot with Logout option */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setIsLogoutConfirmOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Déconnexion</span>
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. AGENCE SUBTAB                                          */}
          {/* ========================================================= */}
          {settingsSubTab === 'agence' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Agence & Coordonnées officielles</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Informations légales et comptes marchands Mobile Money sénégalais.
                </p>
              </div>

              <form onSubmit={handleSaveAgency} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Nom de l'agence / Société
                    </label>
                    <input
                      type="text"
                      value={agencyForm.agencyName}
                      onChange={e => setAgencyForm({ ...agencyForm, agencyName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Titre du gestionnaire
                    </label>
                    <input
                      type="text"
                      value={agencyForm.managerTitle}
                      onChange={e => setAgencyForm({ ...agencyForm, managerTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      NINEA (Fiscal Sénégal)
                    </label>
                    <input
                      type="text"
                      value={agencyForm.ninea}
                      onChange={e => setAgencyForm({ ...agencyForm, ninea: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Registre de Commerce (RC)
                    </label>
                    <input
                      type="text"
                      value={agencyForm.rcNumber}
                      onChange={e => setAgencyForm({ ...agencyForm, rcNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-cyan-700 mb-1.5">
                      Compte Wave (Téléphone)
                    </label>
                    <input
                      type="text"
                      value={agencyForm.waveMerchantPhone}
                      onChange={e =>
                        setAgencyForm({ ...agencyForm, waveMerchantPhone: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-cyan-300 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-amber-700 mb-1.5">
                      Code Orange Money
                    </label>
                    <input
                      type="text"
                      value={agencyForm.orangeMerchantNumber}
                      onChange={e =>
                        setAgencyForm({ ...agencyForm, orangeMerchantNumber: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Free Money (#150#)
                    </label>
                    <input
                      type="text"
                      value={agencyForm.freeMerchantNumber}
                      onChange={e =>
                        setAgencyForm({ ...agencyForm, freeMerchantNumber: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer l'agence</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. UTILISATEURS / ÉQUIPE SUBTAB                           */}
          {/* ========================================================= */}
          {settingsSubTab === 'utilisateurs' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Gestion des utilisateurs & Profils
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Contrôlez les accès administrateurs, comptables et agents de terrain.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer active:scale-95"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Inviter un collaborateur</span>
                  </button>
                </div>

                {/* Users List */}
                <div className="divide-y divide-slate-100 mt-2">
                  {adminUsers.map(user => (
                    <div
                      key={user.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{user.fullName}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                user.role === 'Super Admin'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : user.role === 'Gestionnaire'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : user.role === 'Comptable'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {user.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {user.email} • Tel : {user.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <span
                            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              user.status === 'actif'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {user.status === 'actif' ? 'Actif' : 'Invité'}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {user.lastLogin}
                          </span>
                        </div>

                        {user.id !== 'usr-1' && (
                          <button
                            onClick={() => {
                              if (confirm(`Supprimer l'accès pour ${user.fullName} ?`)) {
                                deleteAdminUser(user.id);
                                showToast('Accès utilisateur supprimé.');
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Supprimer cet utilisateur"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. SÉCURITÉ SUBTAB (Matches image_3e53b16a.png)          */}
          {/* ========================================================= */}
          {settingsSubTab === 'securite' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Sécurité</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Changez votre mot de passe régulièrement.
                </p>
              </div>

              <form onSubmit={handleChangePassword} className="p-6 space-y-5">
                {passwordError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {/* Mot de passe actuel */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-slate-800 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Nouveau mot de passe */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-slate-800 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirmer le nouveau mot de passe */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-slate-800 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Footer Save Button matching screenshot 2 */}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Changer le mot de passe</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. ABONNEMENT SUBTAB (Matches image_c7fdaffd.png)        */}
          {/* ========================================================= */}
          {settingsSubTab === 'abonnement' && (
            <div className="space-y-6">
              {/* Top Card: Formule actuelle matching image_c7fdaffd.png */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Formule actuelle</span>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-200/60">
                    {subscriptionInfo.status === 'trial' ? 'Essai gratuit' : 'Actif'}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {subscriptionInfo.currentPlan}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Essai gratuit jusqu'au {formatShortDate(subscriptionInfo.trialEndDate)} ({subscriptionInfo.daysLeft} jours).
                  </p>
                </div>

                {/* Progress bars: Immeubles and Locataires */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-slate-600">
                      <span>Immeubles</span>
                      <span>
                        {buildings.length} / {subscriptionInfo.maxBuildings}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (buildings.length / subscriptionInfo.maxBuildings) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5 font-semibold text-slate-600">
                      <span>Locataires</span>
                      <span>
                        {tenants.length} / {subscriptionInfo.maxTenants}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (tenants.length / subscriptionInfo.maxTenants) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Card: Payer / renouveler mon abonnement matching image_c7fdaffd.png */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Payer / renouveler mon abonnement
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Paiement sécurisé par Orange Money, Wave ou MTN Mobile Money.
                  </p>
                </div>

                {/* Formule selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Formule</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedSubPlan('Pro')}
                      className={`p-3.5 rounded-xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedSubPlan === 'Pro'
                          ? 'border-blue-600 bg-blue-50/40'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-bold text-xs text-slate-900">Pro</span>
                      <span className="text-xs font-semibold text-slate-600">15 000 FCFA / mois</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedSubPlan('Enterprise')}
                      className={`p-3.5 rounded-xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedSubPlan === 'Enterprise'
                          ? 'border-blue-600 bg-blue-50/40'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-bold text-xs text-slate-900">Enterprise</span>
                      <span className="text-xs font-semibold text-slate-600">45 000 FCFA / mois</span>
                    </button>
                  </div>
                </div>

                {/* Durée selector matching image_c7fdaffd.png */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Durée</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedDuration(1)}
                      className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        selectedDuration === 1
                          ? 'border-blue-600 bg-blue-50/40'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="block font-bold text-xs text-slate-900">1 mois</span>
                      <span className="text-xs text-slate-500 font-semibold">
                        {formatFCFA(planBasePrice)}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedDuration(3)}
                      className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        selectedDuration === 3
                          ? 'border-blue-600 bg-blue-50/40'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="block font-bold text-xs text-slate-900">3 mois</span>
                      <span className="text-xs text-slate-500 font-semibold">
                        {formatFCFA(planBasePrice * 3)}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedDuration(12)}
                      className={`relative p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        selectedDuration === 12
                          ? 'border-blue-600 bg-blue-50/40'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="block font-bold text-xs text-slate-900">12 mois</span>
                      <span className="text-xs text-slate-500 font-semibold">
                        {formatFCFA(planBasePrice * 10)}
                      </span>
                      <span className="mt-1 inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                        2 mois offerts
                      </span>
                    </button>
                  </div>
                </div>

                {/* Mobile Money Provider selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Moyen Mobile Money
                    </label>
                    <select
                      value={selectedPaymentProvider}
                      onChange={e =>
                        setSelectedPaymentProvider(
                          e.target.value as 'Orange Money' | 'Wave' | 'MTN MoMo'
                        )
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                    >
                      <option value="Orange Money">Orange Money Sénégal</option>
                      <option value="Wave">Wave Sénégal</option>
                      <option value="MTN MoMo">MTN Mobile Money</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Numéro {selectedPaymentProvider} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={subPhone}
                      onChange={e => setSubPhone(e.target.value)}
                      placeholder="777030600"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800"
                    />
                  </div>
                </div>

                {/* Total box matching image_c7fdaffd.png */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">Total à payer</span>
                    <span className="text-xl font-black text-slate-900">
                      {formatFCFA(computedSubTotal)}
                    </span>
                  </div>

                  <button
                    onClick={handleRenewSubscription}
                    disabled={isRenewing}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer active:scale-95"
                  >
                    {isRenewing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 stroke-[3]" />
                    )}
                    <span>Payer {formatFCFA(computedSubTotal)}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-400">
                  Vous validerez le paiement sur votre téléphone. Aucun prélèvement automatique.
                </p>
              </div>

              {/* Bottom Card: Historique des paiements matching image_c7fdaffd.png */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Historique des paiements</h3>

                {subscriptionInvoices.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3">
                    Aucun paiement d'abonnement pour l'instant.
                  </p>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {subscriptionInvoices.map(inv => (
                      <div
                        key={inv.id}
                        className="py-3 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">Formule {inv.plan}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                              {inv.durationMonths} mois
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Réf : {inv.reference} • {inv.method} • {formatShortDate(inv.date)}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-emerald-700 block">
                            {formatFCFA(inv.amount)}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold">Payé</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. SUPPORT SUBTAB (Matches image_6f314153.png)            */}
          {/* ========================================================= */}
          {settingsSubTab === 'support' && (
            <div className="space-y-6">
              {/* Top Card: Contacter le support matching image_6f314153.png */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Contacter le support</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Une question, un problème, un changement de formule ? L'équipe IMMO PILOT vous répond ici.
                  </p>
                </div>

                <form onSubmit={handleSendTicket} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Sujet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={supportSubject}
                        onChange={e => setSupportSubject(e.target.value)}
                        placeholder="ex : Passer à la formule Pro"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Urgence
                      </label>
                      <select
                        value={supportUrgency}
                        onChange={e =>
                          setSupportUrgency(e.target.value as 'Normale' | 'Haute' | 'Urgente')
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-slate-800 bg-white"
                      >
                        <option value="Normale">Normale</option>
                        <option value="Haute">Haute</option>
                        <option value="Urgente">Urgente</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={supportMessage}
                      onChange={e => setSupportMessage(e.target.value)}
                      placeholder="Décrivez votre demande en quelques lignes..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-medium text-slate-800 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                      <span>Envoyer</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Bottom Card: Mes demandes matching image_6f314153.png */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Mes demandes</h3>

                {supportTickets.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3">
                    Vous n'avez envoyé aucune demande.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {supportTickets.map(ticket => (
                      <div
                        key={ticket.id}
                        className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">
                                {ticket.subject}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  ticket.urgency === 'Urgente'
                                    ? 'bg-red-50 text-red-600'
                                    : ticket.urgency === 'Haute'
                                    ? 'bg-amber-50 text-amber-600'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {ticket.urgency}
                              </span>
                            </div>
                            <p className="text-slate-600 mt-1">{ticket.message}</p>
                          </div>

                          <div className="text-right">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                ticket.status === 'resolue'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {ticket.status === 'resolue' ? 'Résolue' : 'En attente'}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              {ticket.createdAt}
                            </span>
                          </div>
                        </div>

                        {/* Admin reply if any */}
                        {ticket.adminReply && (
                          <div className="mt-2 p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 flex items-start gap-2">
                            <LifeBuoy className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-blue-950">
                                Réponse de l'équipe IMMO PILOT :
                              </p>
                              <p className="mt-0.5 text-blue-900">{ticket.adminReply}</p>
                              {ticket.repliedAt && (
                                <span className="text-[10px] text-blue-600/70 block mt-1">
                                  Envoyé le {ticket.repliedAt}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Inviter un collaborateur */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Inviter un nouveau collaborateur</h3>
            <p className="text-xs text-slate-500">
              Attribuez un profil et des droits d'accès à votre gestionnaire ou comptable.
            </p>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom et prénom *
                </label>
                <input
                  type="text"
                  required
                  value={newUserFullName}
                  onChange={e => setNewUserFullName(e.target.value)}
                  placeholder="ex : Moussa Fall"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adresse e-mail *
                </label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={e => setNewUserEmail(e.target.value)}
                  placeholder="collaborateur@abservices.sn"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={newUserPhone}
                    onChange={e => setNewUserPhone(e.target.value)}
                    placeholder="+221 77 000 00 00"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rôle & Profil
                  </label>
                  <select
                    value={newUserRole}
                    onChange={e =>
                      setNewUserRole(
                        e.target.value as
                          | 'Super Admin'
                          | 'Gestionnaire'
                          | 'Comptable'
                          | 'Agent Terrain'
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                  >
                    <option value="Gestionnaire">Gestionnaire</option>
                    <option value="Comptable">Comptable</option>
                    <option value="Agent Terrain">Agent Terrain</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
