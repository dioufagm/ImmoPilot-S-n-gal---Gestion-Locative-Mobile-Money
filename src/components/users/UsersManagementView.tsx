import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Mail,
  Phone,
  Search,
  Filter,
  Trash2,
  Key,
  CheckCircle2,
  Clock,
  Building,
  X,
  Lock,
  Check,
  UserCog,
  AlertCircle,
  Sparkles,
  Edit3,
  UserCheck,
  UserX,
  BadgeCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdminUser } from '../../types';

export const UsersManagementView: React.FC = () => {
  const { adminUsers, addAdminUser, updateAdminUser, deleteAdminUser, userProfile } = useApp();

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);

  // Form states for Add
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+221 77 ');
  const [role, setRole] = useState<'Super Admin' | 'Gestionnaire' | 'Comptable' | 'Agent Terrain'>(
    'Gestionnaire'
  );
  const [status, setStatus] = useState<'actif' | 'invite' | 'suspendu'>('actif');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // KPIs
  const totalUsers = adminUsers.length;
  const activeUsers = adminUsers.filter(u => u.status === 'actif').length;
  const invitedUsers = adminUsers.filter(u => u.status === 'invite').length;
  const managerUsers = adminUsers.filter(u => u.role === 'Gestionnaire' || u.role === 'Super Admin').length;

  // Filtered users
  const filteredUsers = useMemo(() => {
    return adminUsers.filter(user => {
      const matchSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm);

      const matchRole = roleFilter === 'all' || user.role === roleFilter;
      const matchStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [adminUsers, searchTerm, roleFilter, statusFilter]);

  // Handlers
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    addAdminUser({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role,
      status,
    });

    setFullName('');
    setEmail('');
    setPhone('+221 77 ');
    setRole('Gestionnaire');
    setStatus('actif');
    setIsAddModalOpen(false);
    showToast(`Compte pour ${fullName} créé avec succès !`);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateAdminUser(editingUser.id, {
      fullName: editingUser.fullName,
      email: editingUser.email,
      phone: editingUser.phone,
      role: editingUser.role,
      status: editingUser.status,
    });

    setEditingUser(null);
    showToast(`Informations de ${editingUser.fullName} mises à jour.`);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    deleteAdminUser(userToDelete.id);
    showToast(`L'utilisateur ${userToDelete.fullName} a été supprimé.`);
    setUserToDelete(null);
  };

  const handleToggleStatus = (user: AdminUser) => {
    const nextStatus = user.status === 'actif' ? 'suspendu' : 'actif';
    updateAdminUser(user.id, { status: nextStatus });
    showToast(
      nextStatus === 'actif'
        ? `Accès réactivé pour ${user.fullName}.`
        : `Accès suspendu pour ${user.fullName}.`
    );
  };

  const handleResetPassword = (user: AdminUser) => {
    showToast(`Un email de réinitialisation sécurisé a été envoyé à ${user.email}.`);
  };

  const getRoleBadgeStyle = (r: AdminUser['role']) => {
    switch (r) {
      case 'Super Admin':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      case 'Gestionnaire':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'Comptable':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Agent Terrain':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getRoleDescription = (r: AdminUser['role']) => {
    switch (r) {
      case 'Super Admin':
        return 'Contrôle total : agence, baux, loyers, suppression et gestion des accès.';
      case 'Gestionnaire':
        return 'Gestion des immeubles, unités, baux, locataires et édition des états.';
      case 'Comptable':
        return 'Suivi financier, validation des paiements Mobile Money et rapports.';
      case 'Agent Terrain':
        return 'Visites, états des lieux et encaissements physiques sur place.';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
              <UserCog className="w-3.5 h-3.5" />
              Équipe & Sécurité
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Gestion des utilisateurs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Gérez les différents comptes d'accès, rôles et permissions des collaborateurs de votre agence.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer active:scale-95"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Nouvel utilisateur</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Total comptes</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{totalUsers}</p>
          <p className="text-[11px] text-slate-400 mt-1">Collaborateurs inscrits</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Comptes actifs</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">{activeUsers}</p>
          <p className="text-[11px] text-slate-400 mt-1">Accès opérationnels</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Invitations</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600">{invitedUsers}</p>
          <p className="text-[11px] text-slate-400 mt-1">En attente de connexion</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500">Gestion & Direction</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-700">{managerUsers}</p>
          <p className="text-[11px] text-slate-400 mt-1">Admins & Gestionnaires</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, email ou numéro de téléphone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap hidden sm:inline">
              Statut :
            </span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="invite">Invité</option>
              <option value="suspendu">Suspendu</option>
            </select>
          </div>
        </div>

        {/* Role Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] mr-1 hidden sm:inline">
            Filtrer par rôle :
          </span>
          {[
            { id: 'all', label: 'Tous les comptes' },
            { id: 'Super Admin', label: 'Super Admin' },
            { id: 'Gestionnaire', label: 'Gestionnaires' },
            { id: 'Comptable', label: 'Comptables' },
            { id: 'Agent Terrain', label: 'Agents Terrain' },
          ].map(pill => (
            <button
              key={pill.id}
              onClick={() => setRoleFilter(pill.id)}
              className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer ${
                roleFilter === pill.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800">Aucun utilisateur trouvé</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Aucun collaborateur ne correspond à vos critères de recherche.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredUsers.map(user => {
              const isCurrentUser =
                user.email.toLowerCase() === userProfile.email.toLowerCase() || user.id === 'usr-1';

              return (
                <div
                  key={user.id}
                  className="p-5 sm:p-6 hover:bg-slate-50/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left: User Avatar + Identity */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-base flex items-center justify-center shadow-sm">
                        {user.fullName.charAt(0)}
                      </div>
                      <span
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                          user.status === 'actif'
                            ? 'bg-emerald-500'
                            : user.status === 'invite'
                            ? 'bg-amber-400'
                            : 'bg-rose-500'
                        }`}
                        title={`Statut: ${user.status}`}
                      />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          {user.fullName}
                        </h4>
                        {isCurrentUser && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                            Votre compte
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getRoleBadgeStyle(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {user.phone}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-1 hidden sm:block">
                        {getRoleDescription(user.role)}
                      </p>
                    </div>
                  </div>

                  {/* Right: Meta & Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 pt-3 lg:pt-0">
                    <div className="text-left lg:text-right">
                      <div className="flex items-center lg:justify-end gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            user.status === 'actif'
                              ? 'bg-emerald-50 text-emerald-700'
                              : user.status === 'invite'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === 'actif'
                                ? 'bg-emerald-500'
                                : user.status === 'invite'
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                          />
                          {user.status === 'actif'
                            ? 'Actif'
                            : user.status === 'invite'
                            ? 'Invité'
                            : 'Suspendu'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">
                        Dernière connexion : {user.lastLogin}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Modifier l'utilisateur"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleResetPassword(user)}
                        className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                        title="Réinitialiser le mot de passe"
                      >
                        <Key className="w-4 h-4" />
                      </button>

                      {!isCurrentUser && (
                        <>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`p-2 rounded-xl transition-colors cursor-pointer ${
                              user.status === 'actif'
                                ? 'text-slate-500 hover:text-amber-600 hover:bg-amber-50'
                                : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={
                              user.status === 'actif' ? "Suspendre l'accès" : "Réactiver l'accès"
                            }
                          >
                            {user.status === 'actif' ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => setUserToDelete(user)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Supprimer ce compte"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Role Privileges Reference Guide Card */}
      <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 p-6 rounded-2xl border border-blue-100">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-blue-600" />
          <span>Matrice des rôles & Niveaux d'habilitation</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-blue-100/80 shadow-2xs">
            <span className="font-bold text-purple-700 block mb-1">Super Admin</span>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Gère l'intégralité du compte agence, ajoute ou révoque des collaborateurs, modifie les coordonnées bancaires et Mobile Money.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-blue-100/80 shadow-2xs">
            <span className="font-bold text-blue-700 block mb-1">Gestionnaire</span>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Crée et édite les immeubles, les logements, les contrats de bail et gère les fiches locataires complètes.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-blue-100/80 shadow-2xs">
            <span className="font-bold text-emerald-700 block mb-1">Comptable</span>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Valide les encaissements (Wave, Orange Money, espèces), émet les quittances numériques certifiées et consulte les rapports.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-blue-100/80 shadow-2xs">
            <span className="font-bold text-amber-700 block mb-1">Agent Terrain</span>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Accède au suivi des impayés sur le terrain, effectue les relances de loyer et saisit les paiements d'urgence.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL: Add New User */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Nouvel utilisateur</h3>
                  <p className="text-xs text-slate-500">
                    Créez un compte et attribuez un niveau d'accès.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nom et prénom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="ex : Mamadou Ndiaye"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Adresse e-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="mamadou@agence.sn"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Numéro de téléphone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+221 77 000 00 00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Rôle & Habilitation <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['Gestionnaire', 'Comptable', 'Agent Terrain', 'Super Admin'] as const).map(
                    r => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setRole(r)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          role === r
                            ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className="block font-bold text-xs text-slate-900">{r}</span>
                        <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                          {r === 'Super Admin'
                            ? 'Accès total'
                            : r === 'Gestionnaire'
                            ? 'Immeubles & locataires'
                            : r === 'Comptable'
                            ? 'Paiements & Mobile Money'
                            : 'Opérations terrain'}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  État initial du compte
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === 'actif'}
                      onChange={() => setStatus('actif')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Actif immédiatement</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === 'invite'}
                      onChange={() => setStatus('invite')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Envoyer une invitation</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Enregistrer l'utilisateur</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit User */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Modifier l'utilisateur</h3>
                  <p className="text-xs text-slate-500">
                    Mettez à jour les informations et permissions.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nom et prénom complet
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.fullName}
                  onChange={e => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={editingUser.phone}
                    onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Rôle</label>
                  <select
                    value={editingUser.role}
                    onChange={e =>
                      setEditingUser({
                        ...editingUser,
                        role: e.target.value as AdminUser['role'],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                  >
                    <option value="Gestionnaire">Gestionnaire</option>
                    <option value="Comptable">Comptable</option>
                    <option value="Agent Terrain">Agent Terrain</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Statut du compte
                  </label>
                  <select
                    value={editingUser.status}
                    onChange={e =>
                      setEditingUser({
                        ...editingUser,
                        status: e.target.value as AdminUser['status'],
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white"
                  >
                    <option value="actif">Actif</option>
                    <option value="invite">Invité</option>
                    <option value="suspendu">Suspendu</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Confirm Delete */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Supprimer le compte de {userToDelete.fullName} ?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Cette action révoquera immédiatement tous les accès à l'application IMMO PILOT pour l'adresse{' '}
                <strong className="text-slate-700">{userToDelete.email}</strong>.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/25"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
