import React, { useState } from 'react';
import {
  Building2,
  Wallet,
  Users,
  Smartphone,
  FileText,
  BarChart3,
  Check,
  X as XIcon,
  ChevronRight,
  ChevronUp,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingPage: React.FC = () => {
  const {
    setViewMode,
    navigateToAppTab,
    setActivePricingPlan,
    setSettingsSubTab,
    settings,
    isAuthenticated,
    setIsLoginModalOpen,
    setIsLogoutConfirmOpen,
  } = useApp();

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => (prev === index ? null : index));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      id: 'buildings',
      icon: Building2,
      title: 'Gestion des immeubles',
      description:
        'Immeubles et logements avec photos, statut de chaque logement (libre, occupé, en travaux) et propriétaire de chaque bien.',
      targetTab: 'buildings',
    },
    {
      id: 'rents',
      icon: Wallet,
      title: 'Suivi des loyers',
      description:
        'Échéancier du mois : loyers payés, partiels ou en retard, et relance du locataire par e-mail ou WhatsApp en un clic.',
      targetTab: 'rents',
    },
    {
      id: 'tenants',
      icon: Users,
      title: 'Gestion des locataires',
      description:
        'Fiches locataires, dates de bail, attribution des logements, historique des paiements et reçus envoyés automatiquement par e-mail.',
      targetTab: 'tenants',
    },
    {
      id: 'payments',
      icon: Smartphone,
      title: 'Paiement en ligne',
      description:
        'Chaque locataire reçoit un lien personnel pour payer son loyer par Orange Money ou MTN MoMo, versé au propriétaire du logement.',
      targetTab: 'payments',
    },
    {
      id: 'notifications',
      icon: FileText,
      title: 'Notifications & Alertes',
      description:
        'Notification à chaque loyer payé, retard ou nouveau locataire, et rappel avant l’échéance de votre abonnement.',
      targetTab: 'notifications',
    },
    {
      id: 'reports',
      icon: BarChart3,
      title: 'Rapports financiers',
      description:
        'Revenus des 12 derniers mois, taux d’occupation, loyers impayés et export de vos données en CSV (Excel).',
      targetTab: 'reports',
    },
  ];

  const faqs = [
    {
      question: 'Puis-je essayer IMMOPILOT gratuitement ?',
      answer:
        'Oui, absolument ! Vous bénéficiez d’un essai gratuit de 14 jours, sans engagement et sans carte bancaire requise. Vous pouvez également opter pour la formule Starter qui reste 100% gratuite pour les petits patrimoines.',
    },
    {
      question: 'Combien d’immeubles et de locataires puis-je gérer ?',
      answer:
        'La formule Starter permet de gérer jusqu’à 3 immeubles et 10 locataires. La formule Pro permet de gérer jusqu’à 15 immeubles et 100 locataires. La formule Enterprise offre une capacité illimitée pour les agences et grands gestionnaires.',
    },
    {
      question: 'Comment IMMOPILOT m’aide-t-il à suivre les loyers ?',
      answer:
        'L’échéancier mensuel classe automatiquement vos loyers en soldés, partiels et en retard. En un clic, vous pouvez envoyer une relance WhatsApp ou SMS avec le montant restant et le lien Mobile Money sécurisé.',
    },
    {
      question: 'Que reçoivent mes locataires ?',
      answer:
        'Vos locataires reçoivent un lien personnalisé pour régler leur loyer par Wave, Orange Money ou virement. Dès validation, une quittance numérique certifiée avec cachet électronique et référence de transaction leur est délivrée automatiquement.',
    },
    {
      question: 'Quels rapports financiers sont disponibles ?',
      answer:
        'Vous disposez d’une vue consolidée de vos encaissements des 12 derniers mois, du taux d’occupation par immeuble, de la ventilation des modes de règlement et d’un export complet en CSV / Excel.',
    },
    {
      question: 'Comment choisir une formule ?',
      answer:
        'Si vous gérez 1 à 3 biens en direct, la formule Starter est idéale. Dès que vous avez plusieurs lots ou souhaitez automatiser les relances par WhatsApp, le plan Pro à 15 000 FCFA/mois est le plus populaire. Pour les agences avec plusieurs propriétaires tiers, optez pour Enterprise.',
    },
    {
      question: 'Comment contacter le support ?',
      answer:
        'Notre équipe est disponible 7j/7 directement depuis votre espace gestionnaire, par WhatsApp officiel et par email à dioufagm@gmail.com.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Header Navigation matching image_edae3ab0.png */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
        {/* Brand Logo */}
        <div
          onClick={scrollToTop}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
            <Building2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">IMMO</span>
            <span className="font-black text-lg text-blue-600 tracking-tight">PILOT</span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <button
            onClick={() => scrollToSection('hero')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Accueil
          </button>
          <button
            onClick={() => scrollToSection('features')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Fonctionnalités
          </button>
          <button
            onClick={() => scrollToSection('pricing')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Tarifs
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Right Account & Login / Logout Buttons */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigateToAppTab('dashboard')}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-slate-50 border border-slate-200/80 transition-all text-left group cursor-pointer"
                title="Accéder à mon espace gestionnaire"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {settings.managerName.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                    {settings.managerName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium leading-tight">Mon compte</p>
                </div>
              </button>

              <button
                onClick={() => setIsLogoutConfirmOpen(true)}
                className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connexion</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Hero Section matching image_edae3ab0.png */}
      <section
        id="hero"
        className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden bg-slate-950 text-white px-4 sm:px-6 py-20"
      >
        {/* Background Building Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=85"
            alt="Immeuble moderne"
            className="w-full h-full object-cover object-right opacity-35 filter brightness-75 scale-105 transition-transform duration-1000"
          />
          {/* Subtle gradient to highlight center text and sunset lighting */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-[11px] font-semibold text-slate-200 backdrop-blur-md mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-xs bg-blue-500" />
            <span>La solution pour les bailleurs modernes</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
            Gérez vos immeubles. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              Gardez le contrôle.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed">
            Immeubles, locataires, loyers et paiements Orange Money / MTN MoMo : tout centralisé dans une seule plateforme. Simple, rapide, efficace.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={() => navigateToAppTab('dashboard')}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95 cursor-pointer"
            >
              Commencer gratuitement
            </button>
            <button
              onClick={() => navigateToAppTab('dashboard')}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-slate-600/80 text-xs sm:text-sm font-bold backdrop-blur-xs transition-all active:scale-95 cursor-pointer"
            >
              Voir la démo
            </button>
          </div>

          {/* 3 Checkmark Guarantees */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Gratuit 14 jours</span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Sans carte bancaire</span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>Paiement Mobile Money</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section ("Tout ce dont vous avez besoin pour piloter vos Immeubles") */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-tight">
            Tout ce dont vous avez besoin pour piloter vos Immeubles
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 font-medium">
            Conçu spécifiquement pour automatiser les tâches chronophages et sécuriser vos revenus locatifs au quotidien.
          </p>
        </div>

        {/* 6 Feature Cards Grid matching image_d9f00a10.png & image_edae3ab0.png */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {f.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100">
                  <button
                    onClick={() => navigateToAppTab(f.targetTab)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>En savoir plus</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Pricing Section ("Tarifs - Un plan pour chaque bailleur") */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold tracking-wide uppercase mb-2">
              Tarifs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-tight">
              Un plan pour chaque bailleur
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
              Commencez gratuitement, évoluez selon vos besoins.
            </p>
          </div>

          {/* 3 Pricing Cards matching image_edae3ab0.png */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {/* Starter Plan */}
            <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Starter</h3>
                <p className="text-xs text-slate-500 mt-0.5">Pour les petits bailleurs</p>

                <div className="my-6">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">Gratuit</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Jusqu’à 3 immeubles</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>10 locataires max</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Suivi des loyers</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Paiement en ligne des loyers</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-400">
                    <XIcon className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    <span>Relances e-mail / WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-400">
                    <XIcon className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    <span>Rapports et exports CSV</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => {
                    setActivePricingPlan('Starter');
                    navigateToAppTab('dashboard');
                  }}
                  className="w-full py-2.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-xs transition-colors cursor-pointer"
                >
                  Commencer gratuitement
                </button>
              </div>
            </div>

            {/* Pro Plan (Highlighted with POPULAIRE badge) */}
            <div className="relative p-7 rounded-2xl bg-white border-2 border-blue-600 shadow-xl shadow-blue-500/10 flex flex-col justify-between">
              {/* Badge Populaire */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white font-black text-[10px] tracking-wider uppercase shadow-xs">
                POPULAIRE
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Pro</h3>
                <p className="text-xs text-slate-500 mt-0.5">Pour les bailleurs actifs</p>

                <div className="my-6">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">15 000</span>
                  <span className="text-xs text-slate-500 font-semibold ml-1">FCFA/mois</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2.5 font-medium text-slate-800">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Jusqu’à 15 immeubles</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium text-slate-800">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>100 locataires max</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium text-slate-800">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Relances e-mail / WhatsApp</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium text-slate-800">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Paiement en ligne des loyers</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium text-slate-800">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Rapports financiers et exports CSV</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium text-slate-800">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Support depuis votre espace</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => {
                    setActivePricingPlan('Pro');
                    setSettingsSubTab('abonnement');
                    navigateToAppTab('settings');
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer"
                >
                  Essai gratuit 14 jours
                </button>
              </div>
            </div>

            {/* Enterprise Plan (Dark Navy Card) */}
            <div className="p-7 rounded-2xl bg-[#0e172a] text-white border border-slate-800 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Enterprise</h3>
                <p className="text-xs text-slate-400 mt-0.5">Pour les agences immobilières</p>

                <div className="my-6">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">45 000</span>
                  <span className="text-xs text-slate-400 font-semibold ml-1">FCFA/mois</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>Immeubles illimités</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>Locataires illimités</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>Tout le plan Pro inclus</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>Idéal pour les agences</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>Plusieurs propriétaires par parc</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>Support prioritaire</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => {
                    setActivePricingPlan('Enterprise');
                    setSettingsSubTab('abonnement');
                    navigateToAppTab('settings');
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Choisir Enterprise
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section ("Question frequente") */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold tracking-wide uppercase mb-2">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-tight">
            Question frequente
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200/90 rounded-xl overflow-hidden transition-all bg-white"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <div className="ml-4 text-slate-400">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-4.5 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Call to Action Banner matching image_edae3ab0.png */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="p-8 sm:p-14 rounded-3xl bg-blue-600 text-white text-center flex flex-col items-center shadow-xl shadow-blue-600/20">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Votre patrimoine mérite une <br className="hidden sm:block" /> gestion plus simple.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-blue-100 max-w-lg font-medium">
            Rejoignez les propriétaires et gestionnaires qui gagnent en sérénité chaque mois avec IMMOPILOT.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={() => navigateToAppTab('dashboard')}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white hover:bg-slate-100 text-blue-600 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Commencer gratuitement
            </button>
            <button
              onClick={() => navigateToAppTab('dashboard')}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-700/60 hover:bg-blue-700 text-white border border-white/30 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
            >
              Voir la démo
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] font-medium text-blue-100">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Essai gratuit 14 jours • Sans engagement • Sans carte bancaire</span>
          </div>
        </div>
      </section>

      {/* 7. Footer matching image_edae3ab0.png */}
      <footer className="relative bg-white border-t border-slate-100 pt-12 pb-8 px-4 sm:px-8">
        {/* Scroll to Top floating button */}
        <div className="max-w-6xl mx-auto relative">
          <button
            onClick={scrollToTop}
            className="absolute -top-18 right-0 w-10 h-10 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 flex items-center justify-center transition-all cursor-pointer"
            title="Retour en haut"
          >
            <ChevronUp className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-slate-100">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Building2 className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-base text-slate-900 tracking-tight">IMMO</span>
                <span className="font-black text-base text-blue-600 tracking-tight">PILOT</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              La gestion locative simplifiée pour les propriétaires et les agences : immeubles, locataires, loyers et paiements Mobile Money, au même endroit.
            </p>
          </div>

          <nav className="flex items-center gap-6 text-xs font-semibold text-slate-600">
            <button onClick={() => scrollToSection('hero')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Accueil
            </button>
            <button onClick={() => scrollToSection('features')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Fonctionnalités
            </button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition-colors cursor-pointer">
              Tarifs
            </button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-blue-600 transition-colors cursor-pointer">
              FAQ
            </button>
            <button
              onClick={() => navigateToAppTab('dashboard')}
              className="text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Tableau de bord
            </button>
          </nav>
        </div>

        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© 2026 IMMO PILOT. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-600 transition-colors">
              Conditions d’utilisation
            </a>
            <span>•</span>
            <a href="#" className="hover:text-slate-600 transition-colors">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
