import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Building,
  Unit,
  Tenant,
  Payment,
  AutoReminderRule,
  NotificationItem,
  AgencySettings,
  AdminUser,
  SubscriptionInfo,
  SubscriptionInvoice,
  SupportTicket,
} from '../types';
import {
  INITIAL_AGENCY_SETTINGS,
  INITIAL_BUILDINGS,
  INITIAL_UNITS,
  INITIAL_TENANTS,
  INITIAL_PAYMENTS,
  INITIAL_RULES,
  INITIAL_NOTIFICATIONS,
  INITIAL_ADMIN_USERS,
  INITIAL_SUBSCRIPTION_INFO,
  INITIAL_SUBSCRIPTION_INVOICES,
  INITIAL_SUPPORT_TICKETS,
} from '../data/mockData';

export type SettingsSubTab = 'profil' | 'agence' | 'utilisateurs' | 'securite' | 'abonnement' | 'support';

export interface UserProfileData {
  fullName: string;
  phone: string;
  email: string;
  registrationDate: string;
}

interface AppContextType {
  buildings: Building[];
  units: Unit[];
  tenants: Tenant[];
  payments: Payment[];
  rules: AutoReminderRule[];
  notifications: NotificationItem[];
  settings: AgencySettings;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewMode: 'landing' | 'app';
  setViewMode: (mode: 'landing' | 'app') => void;
  activePricingPlan: 'Starter' | 'Pro' | 'Enterprise';
  setActivePricingPlan: (plan: 'Starter' | 'Pro' | 'Enterprise') => void;
  navigateToAppTab: (tab: string) => void;
  // Settings subtab navigation
  settingsSubTab: SettingsSubTab;
  setSettingsSubTab: (tab: SettingsSubTab) => void;
  // User Profile
  userProfile: UserProfileData;
  updateUserProfile: (data: Partial<UserProfileData>) => void;
  // Security / Password
  changePassword: (currentPass: string, newPass: string) => { success: boolean; message: string };
  // Admin Users
  adminUsers: AdminUser[];
  addAdminUser: (user: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => void;
  updateAdminUser: (id: string, updates: Partial<AdminUser>) => void;
  deleteAdminUser: (id: string) => void;
  // Subscription
  subscriptionInfo: SubscriptionInfo;
  subscriptionInvoices: SubscriptionInvoice[];
  renewSubscription: (
    plan: 'Pro' | 'Enterprise',
    durationMonths: number,
    method: 'Orange Money' | 'Wave' | 'MTN MoMo',
    phone: string
  ) => SubscriptionInvoice;
  // Support Tickets
  supportTickets: SupportTicket[];
  addSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => SupportTicket;
  // Buildings
  addBuilding: (building: Omit<Building, 'id' | 'createdAt'>) => Building;
  updateBuilding: (id: string, updates: Partial<Building>) => void;
  deleteBuilding: (id: string) => void;
  // Units
  addUnit: (unit: Omit<Unit, 'id'>) => Unit;
  updateUnit: (id: string, updates: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;
  // Tenants
  addTenant: (tenant: Omit<Tenant, 'id'>) => Tenant;
  updateTenant: (id: string, updates: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  // Payments
  addPayment: (payment: Omit<Payment, 'id' | 'receiptNumber'>) => Payment;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  // Rules & Reminders
  updateRule: (id: string, updates: Partial<AutoReminderRule>) => void;
  toggleRule: (id: string) => void;
  triggerBatchReminders: (ruleId?: string) => { sentCount: number; message: string };
  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'date' | 'isRead'>) => void;
  // Settings
  updateSettings: (newSettings: Partial<AgencySettings>) => void;
  // Reset demo data
  resetToDefaults: () => void;
  // Authentication & Session
  isAuthenticated: boolean;
  login: (email?: string, password?: string) => { success: boolean; message: string };
  logout: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isLogoutConfirmOpen: boolean;
  setIsLogoutConfirmOpen: (open: boolean) => void;
  // Quick navigation helpers
  viewingReceiptPayment: Payment | null;
  setViewingReceiptPayment: (payment: Payment | null) => void;
  portalTenant: Tenant | null;
  setPortalTenant: (tenant: Tenant | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [viewMode, setViewMode] = useState<'landing' | 'app'>(() => {
    const saved = localStorage.getItem('immopilot_view_mode');
    return (saved as 'landing' | 'app') || 'landing';
  });
  const [activePricingPlan, setActivePricingPlan] = useState<'Starter' | 'Pro' | 'Enterprise'>('Pro');
  const [settingsSubTab, setSettingsSubTab] = useState<SettingsSubTab>('profil');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('immopilot_auth');
    return saved !== null ? saved === 'true' : true;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState<boolean>(false);

  const navigateToAppTab = (tab: string) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    setActiveTab(tab);
    setViewMode('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    localStorage.setItem('immopilot_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('immopilot_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  const [buildings, setBuildings] = useState<Building[]>(() => {
    const saved = localStorage.getItem('immopilot_buildings');
    return saved ? JSON.parse(saved) : INITIAL_BUILDINGS;
  });

  const [units, setUnits] = useState<Unit[]>(() => {
    const saved = localStorage.getItem('immopilot_units');
    return saved ? JSON.parse(saved) : INITIAL_UNITS;
  });

  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('immopilot_tenants');
    return saved ? JSON.parse(saved) : INITIAL_TENANTS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('immopilot_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [rules, setRules] = useState<AutoReminderRule[]>(() => {
    const saved = localStorage.getItem('immopilot_rules');
    return saved ? JSON.parse(saved) : INITIAL_RULES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('immopilot_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<AgencySettings>(() => {
    const saved = localStorage.getItem('immopilot_settings');
    return saved ? JSON.parse(saved) : INITIAL_AGENCY_SETTINGS;
  });

  // User profile matching image_f7b42411.png
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => {
    const saved = localStorage.getItem('immopilot_user_profile');
    return saved
      ? JSON.parse(saved)
      : {
          fullName: 'Abdoulaye DIOUF',
          phone: '777030600',
          email: 'dioufagm@gmail.com',
          registrationDate: '19 oct. 2026',
        };
  });

  // Admin users team management
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('immopilot_admin_users');
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_USERS;
  });

  // Subscription info matching image_c7fdaffd.png
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>(() => {
    const saved = localStorage.getItem('immopilot_subscription');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTION_INFO;
  });

  // Subscription invoices
  const [subscriptionInvoices, setSubscriptionInvoices] = useState<SubscriptionInvoice[]>(() => {
    const saved = localStorage.getItem('immopilot_sub_invoices');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTION_INVOICES;
  });

  // Support tickets matching image_6f314153.png
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('immopilot_support_tickets');
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
  });

  const [viewingReceiptPayment, setViewingReceiptPayment] = useState<Payment | null>(null);
  const [portalTenant, setPortalTenant] = useState<Tenant | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('immopilot_buildings', JSON.stringify(buildings));
  }, [buildings]);

  useEffect(() => {
    localStorage.setItem('immopilot_units', JSON.stringify(units));
  }, [units]);

  useEffect(() => {
    localStorage.setItem('immopilot_tenants', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('immopilot_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('immopilot_rules', JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem('immopilot_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('immopilot_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('immopilot_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('immopilot_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  useEffect(() => {
    localStorage.setItem('immopilot_subscription', JSON.stringify(subscriptionInfo));
  }, [subscriptionInfo]);

  useEffect(() => {
    localStorage.setItem('immopilot_sub_invoices', JSON.stringify(subscriptionInvoices));
  }, [subscriptionInvoices]);

  useEffect(() => {
    localStorage.setItem('immopilot_support_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  // Actions: User Profile
  const updateUserProfile = (data: Partial<UserProfileData>) => {
    setUserProfile(prev => {
      const updated = { ...prev, ...data };
      if (data.fullName) {
        updateSettings({ managerName: data.fullName });
      }
      if (data.email) {
        updateSettings({ email: data.email });
      }
      return updated;
    });

    addNotification({
      title: 'Profil mis à jour',
      message: 'Vos informations personnelles ont été enregistrées avec succès.',
      type: 'systeme',
    });
  };

  // Actions: Security & Password
  const changePassword = (currentPass: string, newPass: string) => {
    if (!currentPass || !newPass) {
      return { success: false, message: 'Veuillez remplir tous les champs.' };
    }
    if (newPass.length < 6) {
      return { success: false, message: 'Le nouveau mot de passe doit comporter au moins 6 caractères.' };
    }

    addNotification({
      title: 'Sécurité du compte',
      message: 'Votre mot de passe a été modifié avec succès.',
      type: 'systeme',
    });

    return { success: true, message: 'Votre mot de passe a été modifié avec succès.' };
  };

  // Actions: Admin Users
  const addAdminUser = (userData: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newUser: AdminUser = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Invitation envoyée',
    };
    setAdminUsers(prev => [newUser, ...prev]);

    addNotification({
      title: 'Nouvel utilisateur ajouté',
      message: `${userData.fullName} (${userData.role}) a été ajouté à votre équipe.`,
      type: 'systeme',
    });
  };

  const updateAdminUser = (id: string, updates: Partial<AdminUser>) => {
    setAdminUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
  };

  const deleteAdminUser = (id: string) => {
    setAdminUsers(prev => prev.filter(u => u.id !== id));
  };

  // Actions: Subscription
  const renewSubscription = (
    plan: 'Pro' | 'Enterprise',
    durationMonths: number,
    method: 'Orange Money' | 'Wave' | 'MTN MoMo',
    phone: string
  ): SubscriptionInvoice => {
    const basePrice = plan === 'Pro' ? 15000 : 45000;
    let finalAmount = basePrice * durationMonths;
    if (durationMonths === 12) {
      // 2 mois offerts: 10 mois facturés
      finalAmount = basePrice * 10;
    }

    const newInvoice: SubscriptionInvoice = {
      id: `inv-${Date.now()}`,
      plan,
      durationMonths,
      amount: finalAmount,
      method,
      phone,
      date: new Date().toISOString().split('T')[0],
      reference: `${method === 'Wave' ? 'WV' : 'OM'}-SUB-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'succes',
    };

    setSubscriptionInvoices(prev => [newInvoice, ...prev]);

    // Extend subscription
    setSubscriptionInfo(prev => ({
      ...prev,
      currentPlan: plan,
      status: 'active',
      daysLeft: (prev.daysLeft || 0) + durationMonths * 30,
      maxBuildings: plan === 'Enterprise' ? 999 : 15,
      maxTenants: plan === 'Enterprise' ? 9999 : 100,
    }));

    addNotification({
      title: 'Abonnement renouvelé',
      message: `Votre abonnement formule ${plan} (${durationMonths} mois) a été validé avec succès.`,
      type: 'systeme',
    });

    return newInvoice;
  };

  // Actions: Support Tickets
  const addSupportTicket = (
    ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>
  ): SupportTicket => {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'en_attente',
      adminReply:
        'Votre demande a bien été reçue par notre équipe support à Dakar. Un conseiller vous répond sous 1 heure.',
      repliedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setSupportTickets(prev => [newTicket, ...prev]);

    addNotification({
      title: 'Ticket de support envoyé',
      message: `Votre demande "${ticketData.subject}" a été transmise à l'équipe IMMO PILOT.`,
      type: 'systeme',
    });

    return newTicket;
  };

  // Actions: Buildings
  const addBuilding = (data: Omit<Building, 'id' | 'createdAt'>): Building => {
    const newId = `bld-${Date.now()}`;
    const newBuilding: Building = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBuildings(prev => [newBuilding, ...prev]);

    if (data.totalUnitsCount > 0) {
      const generatedUnits: Unit[] = [];
      for (let i = 1; i <= Math.min(data.totalUnitsCount, 12); i++) {
        generatedUnits.push({
          id: `unit-${newId}-${i}`,
          buildingId: newId,
          buildingName: data.name,
          unitNumber: `Lot ${i}`,
          type: i % 2 === 0 ? 'Appartement F3' : 'Appartement F2',
          floor: Math.floor((i - 1) / 3) + 1,
          surfaceM2: 70 + (i % 3) * 15,
          rentAmount: 200000 + (i % 4) * 35000,
          chargesAmount: 20000,
          status: 'libre',
          description: `Logement standard de ${data.name}.`,
        });
      }
      setUnits(prev => [...generatedUnits, ...prev]);
    }

    addNotification({
      title: 'Nouvel immeuble ajouté',
      message: `L'immeuble "${data.name}" situé à ${data.district} a été configuré avec succès.`,
      type: 'systeme',
    });

    return newBuilding;
  };

  const updateBuilding = (id: string, updates: Partial<Building>) => {
    setBuildings(prev =>
      prev.map(b => (b.id === id ? { ...b, ...updates } : b))
    );
    if (updates.name) {
      setUnits(prev => prev.map(u => (u.buildingId === id ? { ...u, buildingName: updates.name! } : u)));
    }
  };

  const deleteBuilding = (id: string) => {
    setBuildings(prev => prev.filter(b => b.id !== id));
    setUnits(prev => prev.filter(u => u.buildingId !== id));
  };

  // Actions: Units
  const addUnit = (data: Omit<Unit, 'id'>): Unit => {
    const newUnit: Unit = {
      ...data,
      id: `unit-${Date.now()}`,
    };
    setUnits(prev => [newUnit, ...prev]);
    return newUnit;
  };

  const updateUnit = (id: string, updates: Partial<Unit>) => {
    setUnits(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
  };

  const deleteUnit = (id: string) => {
    setUnits(prev => prev.filter(u => u.id !== id));
  };

  // Actions: Tenants
  const addTenant = (data: Omit<Tenant, 'id'>): Tenant => {
    const newTenant: Tenant = {
      ...data,
      id: `ten-${Date.now()}`,
    };
    setTenants(prev => [newTenant, ...prev]);

    updateUnit(data.unitId, {
      status: 'occupe',
      currentTenantId: newTenant.id,
      currentTenantName: newTenant.fullName,
      rentAmount: data.rentAmount,
    });

    addNotification({
      title: 'Nouveau locataire enregistré',
      message: `${data.fullName} a été assigné(e) au ${data.unitNumber} (${data.buildingName}).`,
      type: 'systeme',
      tenantId: newTenant.id,
      tenantName: newTenant.fullName,
      phone: newTenant.phone,
    });

    return newTenant;
  };

  const updateTenant = (id: string, updates: Partial<Tenant>) => {
    setTenants(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    if (updates.fullName) {
      setUnits(prev =>
        prev.map(u => (u.currentTenantId === id ? { ...u, currentTenantName: updates.fullName } : u))
      );
    }
  };

  const deleteTenant = (id: string) => {
    const tenant = tenants.find(t => t.id === id);
    if (tenant && tenant.unitId) {
      updateUnit(tenant.unitId, {
        status: 'libre',
        currentTenantId: undefined,
        currentTenantName: undefined,
      });
    }
    setTenants(prev => prev.filter(t => t.id !== id));
  };

  // Actions: Payments
  const addPayment = (data: Omit<Payment, 'id' | 'receiptNumber'>): Payment => {
    const year = new Date().getFullYear();
    const count = payments.length + 1;
    const receiptNumber = `QUIT-${year}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(count).padStart(4, '0')}`;
    const newPayment: Payment = {
      ...data,
      id: `pay-${Date.now()}`,
      receiptNumber,
    };
    setPayments(prev => [newPayment, ...prev]);

    addNotification({
      title: 'Paiement reçu',
      message: `${data.tenantName} a réglé ${data.amount.toLocaleString()} FCFA via ${data.method.toUpperCase().replace('_', ' ')}.`,
      type: 'loyer_recu',
      tenantId: data.tenantId,
      tenantName: data.tenantName,
      amount: data.amount,
      unitNumber: data.unitNumber,
    });

    return newPayment;
  };

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    setPayments(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  // Actions: Rules
  const updateRule = (id: string, updates: Partial<AutoReminderRule>) => {
    setRules(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => (r.id === id ? { ...r, isActive: !r.isActive } : r)));
  };

  const triggerBatchReminders = (ruleId?: string) => {
    const latePayments = payments.filter(p => p.status === 'retard' || p.status === 'partiel');
    const targetedTenants = tenants.filter(t => latePayments.some(lp => lp.tenantId === t.id));

    const count = targetedTenants.length || 2;
    addNotification({
      title: 'Rappels automatiques déclenchés',
      message: `${count} notifications de relance de loyer envoyées avec succès via WhatsApp & SMS.`,
      type: 'systeme',
    });

    return {
      sentCount: count,
      message: `${count} relances envoyées avec succès aux locataires en attente de paiement !`,
    };
  };

  // Actions: Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'date' | 'isRead'>) => {
    const newItem: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      date: new Date().toISOString(),
      isRead: false,
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  // Actions: Settings
  const updateSettings = (newSettings: Partial<AgencySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Reset
  const resetToDefaults = () => {
    localStorage.clear();
    setBuildings(INITIAL_BUILDINGS);
    setUnits(INITIAL_UNITS);
    setTenants(INITIAL_TENANTS);
    setPayments(INITIAL_PAYMENTS);
    setRules(INITIAL_RULES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_AGENCY_SETTINGS);
    setAdminUsers(INITIAL_ADMIN_USERS);
    setSubscriptionInfo(INITIAL_SUBSCRIPTION_INFO);
    setSubscriptionInvoices(INITIAL_SUBSCRIPTION_INVOICES);
    setSupportTickets(INITIAL_SUPPORT_TICKETS);
    setUserProfile({
      fullName: 'Abdoulaye DIOUF',
      phone: '777030600',
      email: 'dioufagm@gmail.com',
      registrationDate: '19 oct. 2026',
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setViewMode('landing');
    setIsLogoutConfirmOpen(false);
    addNotification({
      type: 'loyer_recu',
      title: 'Session terminée',
      message: 'Vous avez été déconnecté avec succès de votre compte IMMO PILOT.',
    });
  };

  const login = (email?: string, password?: string) => {
    setIsAuthenticated(true);
    setViewMode('app');
    setIsLoginModalOpen(false);
    addNotification({
      type: 'loyer_recu',
      title: 'Connexion réussie',
      message: `Bienvenue sur votre espace IMMO PILOT, ${userProfile.fullName}.`,
    });
    return { success: true, message: 'Connexion réussie avec succès !' };
  };

  return (
    <AppContext.Provider
      value={{
        buildings,
        units,
        tenants,
        payments,
        rules,
        notifications,
        settings,
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        activePricingPlan,
        setActivePricingPlan,
        navigateToAppTab,
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
        addBuilding,
        updateBuilding,
        deleteBuilding,
        addUnit,
        updateUnit,
        deleteUnit,
        addTenant,
        updateTenant,
        deleteTenant,
        addPayment,
        updatePayment,
        updateRule,
        toggleRule,
        triggerBatchReminders,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        updateSettings,
        resetToDefaults,
        isAuthenticated,
        login,
        logout,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isLogoutConfirmOpen,
        setIsLogoutConfirmOpen,
        viewingReceiptPayment,
        setViewingReceiptPayment,
        portalTenant,
        setPortalTenant,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
