import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { dashboardApi } from '../api/services'
import StatCard from '../components/ui/StatCard'
import TechnicianDashboard from './TechnicianDashboard'
import { 
  Cpu, ClipboardList, AlertTriangle, CheckCircle, Clock, TrendingUp, Wrench, Package,
  Zap, Sparkles, BookOpen, HelpCircle, ChevronRight, Shield, Users, Target,
  ArrowUpRight, Info, Mail, Phone, ExternalLink
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { statusLabel } from '../utils/helpers'

const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b']

const roleWelcomeMessages = {
  ADMIN: {
    title: "Espace Administrateur",
    subtitle: "Contrôle total sur l'ensemble du système",
    icon: Shield,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    features: ["Gestion des utilisateurs", "Configuration système", "Accès audit complet", "Supervision globale"]
  },
  RESPONSABLE_MAINTENANCE: {
    title: "Espace Responsable Maintenance",
    subtitle: "Planification et supervision des opérations",
    icon: Target,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    features: ["Planification interventions", "Validation des travaux", "Gestion des stocks", "Rapports analytiques"]
  },
  CHEF_EQUIPE: {
    title: "Espace Chef d'Équipe",
    subtitle: "Coordination terrain et gestion des techniciens",
    icon: Users,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    features: ["Assignation des tâches", "Suivi d'équipe", "Planning journalier", "Communication interne"]
  },
  TECHNICIEN: {
    title: "Espace Technicien",
    subtitle: "Exécution des interventions et suivi de vos missions",
    icon: Wrench,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    features: ["Mes interventions", "Exécution des tâches", "Gestion consommables", "Performance personnelle"]
  }
}

const quickGuides = [
  {
    title: "Créer une intervention",
    description: "Planifiez une nouvelle maintenance en quelques clics",
    icon: ClipboardList,
    steps: ["Allez dans Interventions", "Cliquez 'Nouvelle intervention'", "Remplissez les détails", "Assignez un technicien"],
    link: "/interventions"
  },
  {
    title: "Gérer les consommables",
    description: "Suivez vos stocks et déduisez les quantités utilisées",
    icon: Package,
    steps: ["Accédez à Consommables", "Vérifiez les stocks bas", "Ajoutez ou déduisez du stock", "Consultez l'historique"],
    link: "/consumables"
  },
  {
    title: "Consulter le planning",
    description: "Visualisez les interventions du jour et de la semaine",
    icon: Clock,
    steps: ["Ouvrez le Planning", "Sélectionnez une date", "Filtrez par technicien", "Exportez si besoin"],
    link: "/planning"
  }
]

export default function DashboardPage() {
  const { user } = useAuth()
  const { theme, isDark } = useTheme()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const [expandedGuide, setExpandedGuide] = useState(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Si l'utilisateur est un technicien, afficher le dashboard spécifique
  if (user && user.role === 'TECHNICIEN') {
    return <TechnicianDashboard />
  }

  const load = () => {
    setLoading(true)
    setError(null)
    dashboardApi.getStats()
      .then(r => setStats(r.data))
      .catch(err => {
        console.error('Dashboard error:', err)
        const msg = err.response?.data?.message || err.message || 'Erreur inconnue'
        const status = err.response?.status
        if (status === 401) setError('Session expirée — veuillez vous reconnecter.')
        else if (status === 403) setError('Accès refusé.')
        else if (!err.response) setError('Impossible de joindre le serveur. Vérifiez que le backend est démarré sur le port 8080.')
        else setError(`Erreur serveur (${status}) : ${msg}`)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const roleConfig = roleWelcomeMessages[user?.role] || roleWelcomeMessages.ADMIN
  const RoleIcon = roleConfig.icon

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className={`w-8 h-8 border-2 ${isDark ? 'border-amber-500' : 'border-amber-600'} border-t-transparent rounded-full animate-spin`} />
    </div>
  )

  if (error) return (
    <div className={`flex flex-col items-center justify-center h-64 gap-4 ${theme.bg} rounded-none border ${theme.border} p-8`}>
      <div className={`w-14 h-14 rounded-none ${isDark ? 'bg-red-500/10' : 'bg-red-100'} flex items-center justify-center`}>
        <AlertTriangle className={`w-7 h-7 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
      </div>
      <div className="text-center max-w-md">
        <p className={`${isDark ? 'text-red-400' : 'text-red-600'} font-light text-lg`}>Tableau de bord indisponible</p>
        <p className={`${theme.textMuted} text-sm mt-2 font-light`}>{error}</p>
      </div>
      <button onClick={load} className={`${theme.button} px-6 py-2 text-sm tracking-wide transition-colors mt-2`}>
        Réessayer
      </button>
    </div>
  )

  if (!stats) return null

  const pieData = Object.entries(stats.statusDistribution || {}).map(([name, value]) => ({ name: statusLabel(name), value }))

  const roleColors = {
    ADMIN: isDark ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-600 bg-emerald-100',
    RESPONSABLE_MAINTENANCE: isDark ? 'text-blue-400 bg-blue-500/10' : 'text-blue-600 bg-blue-100',
    CHEF_EQUIPE: isDark ? 'text-amber-400 bg-amber-500/10' : 'text-amber-600 bg-amber-100',
    TECHNICIEN: isDark ? 'text-purple-400 bg-purple-500/10' : 'text-purple-600 bg-purple-100',
  }

  const roleColor = roleColors[user?.role] || roleColors.ADMIN

  return (
    <div className={`min-h-screen pb-8 ${theme.bg} transition-colors duration-300`}>
      {/* Welcome Hero Section */}
      <div className={`relative overflow-hidden rounded-none ${theme.bgCard} border ${theme.border} p-8 mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Background Effects */}
        <div className={`absolute top-0 right-0 w-96 h-96 ${isDark ? 'bg-amber-500/5' : 'bg-amber-400/5'} rounded-full blur-3xl`} />
        <div className={`absolute bottom-0 left-0 w-64 h-64 ${isDark ? 'bg-blue-500/5' : 'bg-blue-400/5'} rounded-full blur-3xl`} />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-none ${roleColor.split(' ')[1]}`}>
                  <RoleIcon className={`w-6 h-6 ${roleColor.split(' ')[0]}`} />
                </div>
                <span className={`${theme.textMuted} text-sm font-light`}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              
              <h1 className={`text-3xl font-light ${theme.text} mb-2 tracking-tight`}>
                Bonjour, {user?.fullName?.split(' ')[0] || 'Utilisateur'} !
              </h1>
              <p className={`text-xl ${theme.textSecondary} mb-2 font-light`}>{roleConfig.title}</p>
              <p className={theme.textMuted}>{roleConfig.subtitle}</p>
              
              <div className="flex flex-wrap gap-3 mt-4">
                {roleConfig.features.map((feature, i) => (
                  <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'} rounded-none text-xs ${theme.textSecondary} border ${theme.border}`}>
                    <CheckCircle size={12} className={isDark ? 'text-emerald-400' : 'text-emerald-600'} />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <div className={`text-center p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'} rounded-none border ${theme.border}`}>
                <div className={`text-2xl font-light ${theme.text}`}>{stats.totalMachines}</div>
                <div className={`text-xs ${theme.textMuted}`}>Machines</div>
              </div>
              <div className={`text-center p-4 ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'} rounded-none border ${theme.border}`}>
                <div className={`text-2xl font-light ${theme.accentText}`}>{stats.totalInterventions}</div>
                <div className={`text-xs ${theme.textMuted}`}>Interventions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`space-y-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {/* KPI Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-light ${theme.text} flex items-center gap-2`}>
              <Zap size={18} className={theme.accentText} />
              Vue d'ensemble
            </h2>
            <button onClick={load} className={`text-xs ${theme.textMuted} hover:${theme.accentText} transition-colors flex items-center gap-1`}>
              <ArrowUpRight size={12} />
              Actualiser
            </button>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Machines" value={stats.totalMachines} icon={Cpu} color="blue" sub={`${stats.machinesInService} en service`} />
            <StatCard label="Interventions" value={stats.totalInterventions} icon={ClipboardList} color="amber" />
            <StatCard label="En retard" value={stats.overdue} icon={AlertTriangle} color="red" sub="À traiter urgemment" />
            <StatCard label="Taux de réalisation" value={`${stats.completionRate?.toFixed(1)}%`} icon={TrendingUp} color="green" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <StatCard label="Planifiées" value={stats.planned} icon={Clock} color="blue" />
            <StatCard label="Terminées" value={stats.completed} icon={CheckCircle} color="green" />
            <StatCard label="Durée moy." value={`${Math.round(stats.averageDuration || 0)} min`} icon={Wrench} color="purple" />
            <StatCard label="Pts. en retard" value={stats.overduePoints} icon={Package} color="red" />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card lg:col-span-2">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-400" />
              Tendance mensuelle (6 mois)
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.monthlyTrend || []}>
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} labelStyle={{ color: '#fff' }} />
                <Bar dataKey="total" fill="#3b82f6" radius={[4,4,0,0]} name="Total" />
                <Bar dataKey="completed" fill="#10b981" radius={[4,4,0,0]} name="Terminées" />
                <Bar dataKey="overdue" fill="#ef4444" radius={[4,4,0,0]} name="En retard" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Info size={16} className="text-amber-400" />
              Répartition statuts
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-2">
              {pieData.map((e, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-slate-400">{e.name}</span>
                  </div>
                  <span className="text-white font-medium">{e.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Cpu size={16} className="text-amber-400" />
              Top machines par interventions
            </h3>
            {(stats.machineRanking || []).length === 0
              ? <p className="text-slate-500 text-sm">Aucune donnée disponible</p>
              : <div className="space-y-3">
                  {(stats.machineRanking || []).map((m, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-slate-500 text-xs w-4">{i+1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-slate-300">{m.machine}</span>
                          <span className="text-xs text-amber-400 font-medium">{m.count}</span>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(m.count / (stats.machineRanking[0]?.count || 1)) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </div>

          <div className="card">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Clock size={16} className="text-emerald-400" />
              Activité récente
            </h3>
            {(stats.recentActivity || []).length === 0
              ? <p className="text-slate-500 text-sm">Aucune activité récente</p>
              : <div className="space-y-3">
                  {(stats.recentActivity || []).map((a, i) => {
                    const badges = { PLANIFIEE: 'badge-blue', EN_COURS: 'badge-yellow', TERMINEE: 'badge-green', EN_RETARD: 'badge-red', VALIDEE: 'badge-purple', ANNULEE: 'badge-gray' }
                    return (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-700/50 last:border-0">
                        <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 text-xs font-bold">
                          #{a.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{a.machine}</p>
                          <p className="text-xs text-slate-500">{a.technician} · {a.date ? new Date(a.date).toLocaleDateString('fr-FR') : ''}</p>
                        </div>
                        <span className={badges[a.status] || 'badge-gray'}>{statusLabel(a.status)}</span>
                      </div>
                    )
                  })}
                </div>
            }
          </div>
        </div>

        {/* Performance Table */}
        {(stats.technicianPerformance || []).length > 0 && (
          <div className="card">
            <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Users size={16} className="text-purple-400" />
              Performance des techniciens
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-slate-700">
                  <th className="th">Technicien</th>
                  <th className="th">Total</th>
                  <th className="th">Terminées</th>
                  <th className="th">En retard</th>
                  <th className="th">Taux réalisation</th>
                </tr></thead>
                <tbody>
                  {stats.technicianPerformance.map((t, i) => {
                    const rate = t.total > 0 ? ((t.completed / t.total) * 100).toFixed(0) : 0
                    return (
                      <tr key={i} className="tr-hover border-b border-slate-700/30">
                        <td className="td font-medium">{t.technician}</td>
                        <td className="td">{t.total}</td>
                        <td className="td text-emerald-400">{t.completed}</td>
                        <td className="td text-red-400">{t.overdue}</td>
                        <td className="td">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-24 bg-slate-700 rounded-full">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rate}%` }} />
                            </div>
                            <span className="text-xs text-slate-400">{rate}%</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Start Guide Section */}
        <div className="card border-l-4 border-l-amber-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Guide de Démarrage Rapide</h3>
              <p className="text-slate-400 text-sm">Nouveau sur GMPP ? Voici les actions essentielles pour commencer</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickGuides.map((guide, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  expandedGuide === i 
                    ? 'bg-slate-800/80 border-amber-500/50' 
                    : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'
                }`}
                onClick={() => setExpandedGuide(expandedGuide === i ? null : i)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <guide.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-sm mb-1">{guide.title}</h4>
                    <p className="text-slate-400 text-xs">{guide.description}</p>
                    
                    {expandedGuide === i && (
                      <div className="mt-3 pt-3 border-t border-slate-700/50">
                        <ol className="space-y-1.5">
                          {guide.steps.map((step, j) => (
                            <li key={j} className="flex items-center gap-2 text-xs text-slate-300">
                              <span className="w-4 h-4 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center text-[10px] font-bold">
                                {j + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                        <a 
                          href={guide.link}
                          className="inline-flex items-center gap-1 mt-3 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          Accéder <ChevronRight size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                  <ChevronRight 
                    size={16} 
                    className={`text-slate-500 transition-transform duration-300 ${expandedGuide === i ? 'rotate-90' : ''}`}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <HelpCircle size={14} className="text-amber-400" />
              <span>Besoin d'aide supplémentaire ? Consultez la documentation ou contactez le support.</span>
            </div>
          </div>
        </div>

        {/* About GMPP Section */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">À propos de GMPP Suite</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                <strong className="text-white">GMPP Suite (Gestion de Maintenance Préventive et Prévisionnelle)</strong> est une solution ERP moderne conçue pour optimiser la gestion de la maintenance industrielle. Elle permet aux entreprises de gérer efficacement leur parc de machines, planifier les interventions, suivre les consommables et analyser les performances.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Spring Boot', 'React', 'PostgreSQL', 'Docker'].map((tech, i) => (
                  <span key={i} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 border border-slate-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                <Shield className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-sm font-medium text-white">Sécurité Enterprise</div>
                  <div className="text-xs text-slate-400">Authentification JWT, RBAC, Audit complet</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                <Users className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm font-medium text-white">4 Rôles Hiérarchiques</div>
                  <div className="text-xs text-slate-400">ADMIN, Responsable, Chef, Technicien</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                <Target className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-sm font-medium text-white">Maintenance Prédictive</div>
                  <div className="text-xs text-slate-400">Planification intelligente, alertes automatiques</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Footer */}
      <footer className="mt-12 pt-8 border-t border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white">GMPP Suite</h4>
                <p className="text-xs text-slate-500">Version 1.0.0</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Solution professionnelle de gestion de maintenance préventive. Optimisez vos opérations, réduisez les pannes et maximisez la disponibilité de votre parc.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h5 className="text-white font-medium mb-3 text-sm">Raccourcis</h5>
            <ul className="space-y-2 text-sm">
              {['Machines', 'Interventions', 'Planning', 'Rapports'].map((link, i) => (
                <li key={i}>
                  <a href={`/${link.toLowerCase()}`} className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1">
                    <ChevronRight size={12} />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h5 className="text-white font-medium mb-3 text-sm">Support & Contact</h5>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <Mail size={14} className="text-amber-400" />
                support@gmpp.local
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone size={14} className="text-amber-400" />
                +33 1 23 45 67 89
              </li>
              <li>
                <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors">
                  <ExternalLink size={14} />
                  Documentation API
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs flex items-center gap-1">
            © 2026 GMPP Suite. Tous droits réservés. Conçu avec expertise à Beni Mellal, Maroc
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Système opérationnel
            </span>
            <span>|</span>
            <span>Build 2026.04.27</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
