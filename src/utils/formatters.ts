// Senegal currency and text utilities

export const formatFCFA = (amount: number): string => {
  if (isNaN(amount)) return '0 FCFA';
  return new Intl.NumberFormat('fr-SN', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA';
};

export const formatShortDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const SENEGAL_CITIES = [
  'Dakar',
  'Thiès',
  'Mbour / Saly',
  'Saint-Louis',
  'Rufisque',
  'Ziguinchor',
  'Touba',
  'Kaolack',
];

export const DAKAR_DISTRICTS = [
  'Grand Dakar',
  'Almadies',
  'Mermoz',
  'Sacré-Cœur 1, 2 & 3',
  'Plateau',
  'Point E',
  'Fann Résidence',
  'Ouakam',
  'Ngor',
  'Yoff',
  'Hann Maristes',
  'Liberté 6 / VDN',
  'Sicap Baobabs',
  'Sicap Amitié',
  'Mamelles',
  'Nord Foire',
  'Fann Hock',
  'Médina',
  'Guédiawaye',
  'Pikine',
  'Diamniadio',
];

export const SENEGAL_AMENITIES = [
  { id: 'groupe', label: 'Groupe électrogène', icon: 'Zap' },
  { id: 'gardien', label: 'Gardiennage 24/7', icon: 'Shield' },
  { id: 'ascenseur', label: 'Ascenseur', icon: 'ArrowUpDown' },
  { id: 'eau', label: 'Surpresseur & Bâche d’eau', icon: 'Droplets' },
  { id: 'parking', label: 'Parking sécurisé', icon: 'Car' },
  { id: 'fibre', label: 'Fibre Optique Orange/Free', icon: 'Wifi' },
  { id: 'cameras', label: 'Caméras de vidéosurveillance', icon: 'Camera' },
  { id: 'nettoyage', label: 'Nettoyage des communs', icon: 'Sparkles' },
];

export const BUILDING_PHOTOS = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
];

export const generateWhatsAppLink = (phone: string, message: string): string => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  // Ensure Senegal country code if omitted
  const fullPhone = cleanPhone.startsWith('221') ? cleanPhone : `221${cleanPhone}`;
  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
};

export const exportToCSV = (filename: string, rows: object[]) => {
  if (!rows || !rows.length) return;
  const separator = ';';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map(row =>
        keys
          .map(k => {
            let cell = (row as Record<string, unknown>)[k] ?? '';
            cell = typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell;
            return cell;
          })
          .join(separator)
      )
      .join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
