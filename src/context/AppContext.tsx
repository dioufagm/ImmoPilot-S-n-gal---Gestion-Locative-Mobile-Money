import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Building,
  Unit,
  Tenant,
  Payment,
  AutoReminderRule,
  NotificationItem,
  AgencySettings,
} from '../types';
import {
  INITIAL_AGENCY_SETTINGS,
  INITIAL_BUILDINGS,
  INITIAL_UNITS,
  INITIAL_TENANTS,
  INITIAL_PAYMENTS,
  INITIAL_RULES,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

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
  // Quick navigation helpers
  viewingReceiptPayment: Payment | null;
  setViewingReceiptPayment: (payment: Payment | null) => void;
  portalTenant: Tenant | null;
  setPortalTenant: (tenant: Tenant | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

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

  const [viewingReceiptPayment, setViewingReceiptPayment] = useState<Payment | null>(null);
  const [portalTenant, setPortalTenant] = useState<Tenant | null>(null);

  // Sync to localStorage
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

  // Actions: Buildings
  const addBuilding = (data: Omit<Building, 'id' | 'createdAt'>): Building => {
    const newId = `bld-${Date.now()}`;
    const newBuilding: Building = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBuildings(prev => [newBuilding, ...prev]);

    // Create placeholder units if totalUnitsCount > 0
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

    // Add notification
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
      // sync buildingName in units, tenants, payments
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

    // Update the unit status to occupied
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
    // Find tenants with pending or overdue rents
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
