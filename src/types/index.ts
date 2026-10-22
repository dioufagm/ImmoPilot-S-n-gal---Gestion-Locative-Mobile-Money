export type BuildingType = 'Résidentiel' | 'Commercial' | 'Mixte' | 'Villa' | 'Bureaux';

export type UnitType = 'Studio' | 'Appartement F2' | 'Appartement F3' | 'Appartement F4' | 'Appartement F5' | 'Magasin' | 'Bureau' | 'Villa';

export type UnitStatus = 'libre' | 'occupe' | 'en_travaux' | 'reserve';

export type PaymentMethod = 'wave' | 'orange_money' | 'free_money' | 'especes' | 'virement';

export type PaymentStatus = 'paye' | 'partiel' | 'en_attente' | 'retard' | 'echoue';

export interface Amenity {
  id: string;
  label: string;
  iconName: string;
}

export interface Building {
  id: string;
  name: string;
  type: BuildingType;
  description: string;
  address: string;
  city: string;
  district: string; // Quartier (ex: Grand Dakar, Almadies, Mermoz, etc.)
  floorsCount: number;
  totalUnitsCount: number;
  constructionYear: number;
  amenities: string[]; // ids of amenities
  photoUrl: string;
  createdAt: string;
  ownerName?: string;
  ownerPhone?: string;
}

export interface Unit {
  id: string;
  buildingId: string;
  buildingName: string;
  unitNumber: string; // e.g. "Appt 1A", "Studio 02"
  type: UnitType;
  floor: number;
  surfaceM2: number;
  rentAmount: number; // in FCFA
  chargesAmount: number; // in FCFA
  status: UnitStatus;
  currentTenantId?: string;
  currentTenantName?: string;
  description?: string;
  features?: string[];
  photoUrl?: string;
}

export interface Tenant {
  id: string;
  fullName: string;
  phone: string; // e.g. +221 77 000 00 00
  email: string;
  cniNumber: string; // Carte Nationale d'Identité ou Passeport
  occupation: string;
  unitId: string;
  unitNumber: string;
  buildingId: string;
  buildingName: string;
  rentAmount: number;
  depositAmount: number; // Caution en FCFA
  entryDate: string; // YYYY-MM-DD
  leaseEndDate?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  status: 'actif' | 'ancien';
  notes?: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  unitId: string;
  unitNumber: string;
  buildingId: string;
  buildingName: string;
  periodMonth: string; // e.g. "Octobre 2026"
  periodYear: number;
  amount: number; // in FCFA
  expectedAmount: number; // in FCFA
  method: PaymentMethod;
  transactionRef: string; // e.g. "WV-SN-928172"
  status: PaymentStatus;
  paymentDate: string; // YYYY-MM-DD
  receiptNumber: string; // e.g. "QUIT-2026-10-0042"
  notes?: string;
}

export interface AutoReminderRule {
  id: string;
  name: string;
  triggerDays: number; // -5 = 5 days before due date, +2 = 2 days after
  channel: 'whatsapp' | 'sms' | 'email';
  isActive: boolean;
  messageTemplate: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'loyer_recu' | 'retard' | 'echeance' | 'bail' | 'systeme';
  tenantId?: string;
  tenantName?: string;
  phone?: string;
  unitNumber?: string;
  amount?: number;
  date: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface AgencySettings {
  agencyName: string;
  managerName: string;
  managerTitle: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  ninea: string;
  rcNumber: string;
  currency: string;
  waveMerchantPhone: string;
  orangeMerchantNumber: string;
  freeMerchantNumber: string;
  ribIban: string;
  bankName: string;
  smsSenderId: string;
  enableAutoWhatsApp: boolean;
  enableAutoSms: boolean;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'Super Admin' | 'Gestionnaire' | 'Comptable' | 'Agent Terrain';
  status: 'actif' | 'invite' | 'suspendu';
  lastLogin: string;
  createdAt: string;
}

export interface SubscriptionInfo {
  currentPlan: 'Starter' | 'Pro' | 'Enterprise';
  status: 'trial' | 'active' | 'expired';
  trialEndDate: string; // e.g. "2026-11-02"
  daysLeft: number;
  maxBuildings: number;
  maxTenants: number;
}

export interface SubscriptionInvoice {
  id: string;
  plan: 'Pro' | 'Enterprise';
  durationMonths: number;
  amount: number;
  method: 'Orange Money' | 'Wave' | 'MTN MoMo';
  phone: string;
  date: string;
  reference: string;
  status: 'succes' | 'en_attente';
}

export interface SupportTicket {
  id: string;
  subject: string;
  urgency: 'Normale' | 'Haute' | 'Urgente';
  message: string;
  createdAt: string;
  status: 'en_attente' | 'en_cours' | 'resolue';
  adminReply?: string;
  repliedAt?: string;
}

