import React, { useEffect, useState } from 'react'
import { dashboardApi } from '../api/services'
import StatCard from '../components/ui/StatCard'
import { ClipboardList, CheckCircle, AlertTriangle, Clock, TrendingUp, Wrench } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import { statusLabel, fmtDateTime } from '../utils/helpers'

const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b']

export default function TechnicianDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    setError(null)
    dashboardApi.getTechnicianStats()
      .then(r => setStats(r.data))
      .catch(err => {
        console.error('Technician Dashboard error:', err)
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

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
        <AlertTriangle className="w-7 h-7 text-red-400" />
      </div>
      <div className="text-center max-w-md">
        <p className="text-red-400 font-semibold text-lg">Tableau de bord technicien indisponible</p>
        <p className="text-slate-400 text-sm mt-2">{error}</p>
      </div>
      <button onClick={load} className="btn-primary mt-2">
        Réessayer
      </button>
    </div>
  )

  if (!stats) return null

  const pieData = Object.entries(stats.statusDistribution || {}).map(([name, value]) => ({ name: statusLabel(name), value }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Mon Tableau de Bord</h1>
        <p className="page-subtitle">Mes interventions et statistiques personnelles</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total interventions" value={stats.totalInterventions} icon={ClipboardList} color="amber" />
        <StatCard label="Ce mois" value={stats.thisMonth} icon={Clock} color="blue" />
        <StatCard label="Terminées" value={stats.completed} icon={CheckCircle} color="green" />
        <StatCard label="En cours" value={stats.inProgress} icon={Wrench} color="yellow" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="En retard" value={stats.overdue} icon={AlertTriangle} color="red" sub="À traiter urgemment" />
        <StatCard label="Taux réalisation" value={`${stats.completionRate?.toFixed(1)}%`} icon={TrendingUp} color="green" />
        <StatCard label="Planifiées" value={stats.planned} icon={Clock} color="blue" />
        <StatCard label="Durée moy." value={`${Math.round(stats.averageDuration || 0)} min`} icon={Wrench} color="purple" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h3 className="text-base font-semibold text-white mb-4">Activité hebdomadaire</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.weeklyActivity || []}>
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} labelStyle={{ color: '#fff' }} />
              <Bar dataKey="interventions" fill="#3b82f6" radius={[4,4,0,0]} name="Interventions" />
              <Bar dataKey="completed" fill="#10b981" radius={[4,4,0,0]} name="Terminées" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-base font-semibold text-white mb-4">Répartition statuts</h3>
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

      {/* Current Intervention */}
      {stats.currentIntervention && (
        <div className="card">
          <h3 className="text-base font-semibold text-white mb-4">Intervention en cours</h3>
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">#{stats.currentIntervention.id}</span>
              <span className="badge-yellow">EN COURS</span>
            </div>
            <p className="text-white font-medium">{stats.currentIntervention.machine}</p>
            <p className="text-slate-400 text-sm mt-1">{stats.currentIntervention.maintenancePoint}</p>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="text-slate-400">Durée : {stats.currentIntervention.duration} min</span>
              {stats.currentIntervention.startedAt && (
                <span className="text-slate-400">Commencée : {fmtDateTime(stats.currentIntervention.startedAt)}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Today Schedule */}
      <div className="card">
        <h3 className="text-base font-semibold text-white mb-4">Planning du jour</h3>
        {(stats.todaySchedule || []).length === 0
          ? <p className="text-slate-500 text-sm">Aucune intervention planifiée aujourd'hui</p>
          : <div className="space-y-3">
              {(stats.todaySchedule || []).map((s, i) => {
                const badges = { PLANIFIEE: 'badge-blue', EN_COURS: 'badge-yellow', TERMINEE: 'badge-green', EN_RETARD: 'badge-red' }
                return (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-700/50 last:border-0">
                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 text-xs font-bold">
                      #{s.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{s.machine}</p>
                      <p className="text-xs text-slate-500">{s.time ? new Date(s.time).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'}) : ''} · {s.duration} min</p>
                    </div>
                    <span className={badges[s.status] || 'badge-gray'}>{statusLabel(s.status)}</span>
                  </div>
                )
              })}
            </div>
        }
      </div>

      {/* Recent History */}
      <div className="card">
        <h3 className="text-base font-semibold text-white mb-4">Historique récent</h3>
        {(stats.recentHistory || []).length === 0
          ? <p className="text-slate-500 text-sm">Aucun historique</p>
          : <div className="space-y-3">
              {(stats.recentHistory || []).map((h, i) => {
                const badges = { PLANIFIEE: 'badge-blue', EN_COURS: 'badge-yellow', TERMINEE: 'badge-green', EN_RETARD: 'badge-red', ANNULEE: 'badge-gray' }
                return (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-700/50 last:border-0">
                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 text-xs font-bold">
                      #{h.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{h.machine}</p>
                      <p className="text-xs text-slate-500">{h.date ? new Date(h.date).toLocaleDateString('fr-FR') : ''} · {h.duration} min</p>
                    </div>
                    <span className={badges[h.status] || 'badge-gray'}>{statusLabel(h.status)}</span>
                  </div>
                )
              })}
            </div>
        }
      </div>
    </div>
  )
}
