import React, { useState } from 'react';
import {
  Bell,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  MessageSquare,
  Smartphone,
  Mail,
  Edit2,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatShortDate } from '../../utils/formatters';

export const NotificationsView: React.FC = () => {
  const {
    rules,
    toggleRule,
    updateRule,
    triggerBatchReminders,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'rules' | 'history'>('rules');
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [templateText, setTemplateText] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleStartEdit = (ruleId: string, currentTemplate: string) => {
    setEditingRuleId(ruleId);
    setTemplateText(currentTemplate);
  };

  const handleSaveEdit = (ruleId: string) => {
    updateRule(ruleId, { messageTemplate: templateText });
    setEditingRuleId(null);
  };

  const handleManualTrigger = () => {
    const res = triggerBatchReminders();
    setSuccessToast(res.message);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Notifications & Rappels automatiques
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Programmation des relances WhatsApp & SMS avant et après l'échéance du 5 du mois.
          </p>
        </div>

        <button
          onClick={handleManualTrigger}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/25 active:scale-95"
        >
          <Send className="w-4 h-4" />
          <span>Déclencher les relances maintenant</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTabSub('rules')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTabSub === 'rules'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Règles & Modèles automatiques ({rules.length})
        </button>
        <button
          onClick={() => setActiveTabSub('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTabSub === 'history'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Historique des alertes ({notifications.length})
        </button>
      </div>

      {/* Tab 1: Rules & Templates */}
      {activeTabSub === 'rules' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Automatisation intelligente des loyers au Sénégal :</p>
              <p className="text-blue-800/80 mt-0.5">
                Chaque message intègre automatiquement le nom du locataire, son lot, son loyer et un lien direct pour payer via Wave ou Orange Money.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {rules.map(rule => (
              <div
                key={rule.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${
                        rule.channel === 'whatsapp'
                          ? 'bg-emerald-500'
                          : rule.channel === 'sms'
                          ? 'bg-blue-600'
                          : 'bg-purple-600'
                      }`}
                    >
                      {rule.channel === 'whatsapp' ? (
                        <MessageSquare className="w-4 h-4" />
                      ) : (
                        <Smartphone className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{rule.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        Canal : <strong className="uppercase">{rule.channel}</strong> • Déclencheur :{' '}
                        {rule.triggerDays < 0
                          ? `${Math.abs(rule.triggerDays)} jours avant échéance`
                          : rule.triggerDays === 0
                          ? `Le jour de l'échéance (le 5 du mois)`
                          : `${rule.triggerDays} jours de retard`}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className="flex items-center gap-2 text-xs font-bold transition-transform active:scale-95"
                  >
                    {rule.isActive ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        <Check className="w-3.5 h-3.5" /> Actif
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        Désactivé
                      </span>
                    )}
                  </button>
                </div>

                {/* Template Content */}
                {editingRuleId === rule.id ? (
                  <div className="space-y-2 pt-2">
                    <textarea
                      rows={3}
                      value={templateText}
                      onChange={e => setTemplateText(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        Variables : {'{nom}'}, {'{loyer}'}, {'{mois}'}, {'{logement}'}, {'{immeuble}'},{' '}
                        {'{lien_paiement}'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingRuleId(null)}
                          className="px-3 py-1 rounded-lg text-xs text-slate-500 hover:bg-slate-100"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleSaveEdit(rule.id)}
                          className="px-3.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs text-slate-700">
                    <p className="font-sans leading-relaxed">{rule.messageTemplate}</p>
                    <button
                      onClick={() => handleStartEdit(rule.id, rule.messageTemplate)}
                      className="text-slate-400 hover:text-blue-600 p-1 flex-shrink-0"
                      title="Modifier le texte"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Notifications History */}
      {activeTabSub === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700">
              Journal des notifications ({notifications.length})
            </span>
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Tout marquer comme lu
            </button>
          </div>

          <div className="space-y-2">
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                  n.isRead
                    ? 'bg-slate-50 border-slate-100 text-slate-600'
                    : 'bg-blue-50/50 border-blue-200 text-slate-800 font-medium'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {n.type === 'retard' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                    {n.type === 'loyer_recu' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {n.type === 'bail' && <Clock className="w-4 h-4 text-purple-600" />}
                    {n.type === 'systeme' && <Bell className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">{n.title}</h5>
                    <p className="text-slate-600 mt-0.5">{n.message}</p>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {formatShortDate(n.date)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
