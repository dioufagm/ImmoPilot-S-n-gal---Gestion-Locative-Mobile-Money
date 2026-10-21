import React, { useState } from 'react';
import {
  X,
  Building2,
  MapPin,
  Layers,
  Image as ImageIcon,
  Check,
  ChevronRight,
  ChevronLeft,
  Zap,
  Shield,
  ArrowUpDown,
  Droplets,
  Car,
  Wifi,
  Camera,
  Sparkles,
} from 'lucide-react';
import { Building, BuildingType } from '../../types';
import {
  SENEGAL_CITIES,
  DAKAR_DISTRICTS,
  SENEGAL_AMENITIES,
  BUILDING_PHOTOS,
} from '../../utils/formatters';

interface AddBuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (buildingData: Omit<Building, 'id' | 'createdAt'>) => void;
}

export const AddBuildingModal: React.FC<AddBuildingModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form fields
  const [name, setName] = useState('ABDOULAYE');
  const [type, setType] = useState<BuildingType>('Résidentiel');
  const [description, setDescription] = useState('Un immeuble résidentiel moderne avec finitions de qualité.');

  // Step 2: Location
  const [address, setAddress] = useState('Rue 10 x Avenue Cheikh Ahmadou Bamba');
  const [city, setCity] = useState('Dakar');
  const [district, setDistrict] = useState('Grand Dakar');

  // Step 3: Characteristics
  const [floorsCount, setFloorsCount] = useState<number>(4);
  const [totalUnitsCount, setTotalUnitsCount] = useState<number>(8);
  const [constructionYear, setConstructionYear] = useState<number>(2023);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'groupe',
    'gardien',
    'eau',
    'fibre',
  ]);

  // Step 4: Photo
  const [selectedPhoto, setSelectedPhoto] = useState<string>(BUILDING_PHOTOS[0]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');

  if (!isOpen) return null;

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!name.trim()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!address.trim() || !city.trim() || !district.trim()) return;
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      type,
      description,
      address,
      city,
      district,
      floorsCount: Number(floorsCount) || 1,
      totalUnitsCount: Number(totalUnitsCount) || 1,
      constructionYear: Number(constructionYear) || new Date().getFullYear(),
      amenities: selectedAmenities,
      photoUrl: customPhotoUrl || selectedPhoto,
    });
    onClose();
  };

  const steps = [
    { num: 1, label: 'Informations', icon: Building2 },
    { num: 2, label: 'Localisation', icon: MapPin },
    { num: 3, label: 'Caractéristiques', icon: Layers },
    { num: 4, label: 'Photo', icon: ImageIcon },
  ];

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return 'Étape 1 sur 4 — Informations';
      case 2:
        return 'Étape 2 sur 4 — Localisation';
      case 3:
        return 'Étape 3 sur 4 — Caractéristiques';
      case 4:
        return 'Étape 4 sur 4 — Photo';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header matching user's screenshots */}
        <div className="p-6 pb-4 border-b border-slate-100 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Ajouter un immeuble</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{getStepSubtitle()}</p>

          {/* Stepper Wizard Bar */}
          <div className="mt-5 flex items-center justify-between relative px-2">
            {/* Step lines */}
            <div className="absolute top-5 left-8 right-8 h-0.5 bg-slate-200 -z-0">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {steps.map(step => {
              const Icon = step.icon;
              const isDone = currentStep > step.num;
              const isCurrent = currentStep === step.num;

              return (
                <div key={step.num} className="relative z-10 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (step.num < currentStep) setCurrentStep(step.num);
                    }}
                    disabled={step.num > currentStep}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-blue-600 text-white shadow-sm'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md shadow-blue-500/20'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isDone ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-5 h-5" />}
                  </button>
                  <span
                    className={`text-[11px] font-semibold mt-1.5 transition-colors ${
                      isCurrent ? 'text-blue-600 font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Informations (Matching Screenshot 3 & 4) */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nom de l'immeuble <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="ex : Résidence Les Palmiers"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Type d'immeuble <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as BuildingType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm font-medium text-slate-800 bg-white"
                  >
                    <option value="Résidentiel">Résidentiel</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Mixte">Mixte (Bureaux & Logements)</option>
                    <option value="Villa">Villa / Immeuble privé</option>
                    <option value="Bureaux">Bureaux / Siège entreprise</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Quelques mots sur l'immeuble : équipements, état, particularités..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm font-medium text-slate-800 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-700">
                <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  Cet immeuble permettra de regrouper vos logements, de générer les quittances et de suivre les encaissements Mobile Money.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Localisation (Matching Screenshot 5 & 6) */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Adresse <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="ex : Rue 10 x Avenue Cheikh Ahmadou Bamba"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm font-medium text-slate-800 bg-white"
                  >
                    {SENEGAL_CITIES.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Quartier <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    list="senegal-districts"
                    required
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    placeholder="ex : Grand Dakar, Almadies, Mermoz..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm font-medium text-slate-800"
                  />
                  <datalist id="senegal-districts">
                    {DAKAR_DISTRICTS.map(d => (
                      <option key={d} value={d} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
                <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>
                  La localisation précise sera imprimée automatiquement sur les quittances de loyer officielles.
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Caractéristiques */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Étages
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={floorsCount}
                    onChange={e => setFloorsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Logements (Lots)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={totalUnitsCount}
                    onChange={e => setTotalUnitsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Année
                  </label>
                  <input
                    type="number"
                    min={1980}
                    max={2030}
                    value={constructionYear}
                    onChange={e => setConstructionYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Commodités & Équipements de l'immeuble
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SENEGAL_AMENITIES.map(amenity => {
                    const isChecked = selectedAmenities.includes(amenity.id);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                          isChecked
                            ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-2xs font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center text-white ${
                            isChecked ? 'bg-blue-600' : 'border border-slate-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{amenity.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Photo */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold text-slate-700">
                Sélectionnez une photo de façade ou d'architecture
              </label>

              <div className="grid grid-cols-3 gap-3">
                {BUILDING_PHOTOS.map((photo, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedPhoto(photo);
                      setCustomPhotoUrl('');
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-4/3 cursor-pointer border-2 transition-all group ${
                      selectedPhoto === photo && !customPhotoUrl
                        ? 'border-blue-600 ring-4 ring-blue-100 shadow-md'
                        : 'border-transparent hover:opacity-90'
                    }`}
                  >
                    <img src={photo} alt={`Façade ${idx + 1}`} className="w-full h-full object-cover" />
                    {selectedPhoto === photo && !customPhotoUrl && (
                      <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Ou URL d'une photo personnalisée :
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={customPhotoUrl}
                  onChange={e => setCustomPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors"
            >
              Annuler
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/25 transition-all"
            >
              <span>Suivant</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Enregistrer l'immeuble</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
