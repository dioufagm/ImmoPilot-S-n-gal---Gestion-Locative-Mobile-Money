import React, { useState } from 'react';
import { Building2, ArrowLeft, Eye, EyeOff, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginPage: React.FC = () => {
  const { login, setViewMode, userProfile, settings } = useApp();

  const [email, setEmail] = useState('dioufagm@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState<string | null>(null);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      login(email, password);
    }, 400);
  };

  const handleQuickDemoFill = () => {
    setEmail('dioufagm@gmail.com');
    setPassword('Pass1234@!');
  };

  const handleForgotPassword = () => {
    setForgotPasswordMessage(
      `Un lien de réinitialisation sécurisé a été simulé et envoyé à l'adresse ${email || 'votre email'}.`
    );
    setTimeout(() => setForgotPasswordMessage(null), 5000);
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* LEFT COLUMN: Clean Login Form */}
      <div className="w-full lg:w-[46%] xl:w-[42%] min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 z-10 bg-white">
        {/* Top Header: Logo + Retour à l'accueil */}
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <div
            onClick={() => setViewMode('landing')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">IMMO</span>
              <span className="font-black text-xl text-blue-600 tracking-tight">PILOT</span>
            </div>
          </div>

          {/* Retour à l'accueil button */}
          <button
            type="button"
            onClick={() => setViewMode('landing')}
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Retour à l'accueil</span>
          </button>
        </div>

        {/* Center Content Form */}
        <div className="my-auto py-8 w-full max-w-md mx-auto">
          {/* Connexion Pill Tag */}
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
              {isSignUpMode ? 'Inscription' : 'Connexion'}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {isSignUpMode ? (
              <>
                Créer votre compte <span className="text-blue-600">IMMO PILOT</span>
              </>
            ) : (
              <>
                Bon retour sur <span className="text-blue-600">IMMO PILOT</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-500 mt-2.5 leading-relaxed">
            {isSignUpMode
              ? 'Rejoignez les propriétaires et agences immobilières modernes au Sénégal.'
              : 'Connectez-vous pour retrouver vos biens, vos locataires et vos loyers.'}
          </p>

          {/* Feedback messages */}
          {forgotPasswordMessage && (
            <div className="mt-4 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>{forgotPasswordMessage}</span>
            </div>
          )}

          {signUpSuccess && (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{signUpSuccess}</span>
            </div>
          )}

          {/* Quick Demo Credentials Assistant */}
          <div
            onClick={handleQuickDemoFill}
            className="mt-6 mb-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between text-xs"
            title="Cliquer pour préremplir avec le compte de démonstration"
          >
            <div className="flex items-center gap-2 text-slate-600">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>
                Compte démo : <strong className="text-slate-800">dioufagm@gmail.com</strong>
              </span>
            </div>
            <span className="text-[11px] font-bold text-blue-600 hover:underline">
              Remplir
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Adresse e-mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ex : jean@gmail.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-white"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {!isSignUpMode && (
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{isSignUpMode ? "S'inscrire gratuitement" : 'Se connecter'}</span>
                )}
              </button>
            </div>

            {/* Switch between Login and Sign Up */}
            <div className="text-center pt-2">
              <p className="text-xs text-slate-600">
                {isSignUpMode ? (
                  <>
                    Déjà un compte ?{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignUpMode(false)}
                      className="font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      Se connecter
                    </button>
                  </>
                ) : (
                  <>
                    Pas encore de compte ?{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignUpMode(true)}
                      className="font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      Créer un compte
                    </button>
                  </>
                )}
              </p>
            </div>
          </form>
        </div>

        {/* Bottom subtle assurance */}
        <div className="w-full max-w-md mx-auto pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sécurité & conformité Sénégal</span>
          </div>
          <span>© 2026 IMMO PILOT</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Full-Height Image matching the visual attachment */}
      <div className="hidden lg:block lg:w-[54%] xl:w-[58%] relative min-h-screen overflow-hidden bg-slate-900 select-none">
        {/* Background Image using the exact asset */}
        <img
          src="/assets/aistudio/IMMO-PILOT-10-28-2026_12_22_PM_Connexion_0bce50da.png"
          alt="Patrimoine immobilier IMMO PILOT"
          className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none"
        />

        {/* Gradient overlay on bottom-left for crisp high-contrast readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

        {/* Floating Text matching the design exactly */}
        <div className="absolute bottom-12 left-12 right-12 z-20 text-white max-w-xl">
          <h2 className="text-2xl xl:text-3xl font-extrabold tracking-tight text-white leading-tight drop-shadow-sm">
            Votre patrimoine immobilier, piloté en toute sérénité.
          </h2>
          <p className="text-sm xl:text-base text-white/90 mt-2 font-medium drop-shadow-xs">
            Simple, rapide et sécurisé.
          </p>
        </div>
      </div>
    </div>
  );
};
