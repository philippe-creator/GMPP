import React, { useEffect, useState } from 'react'
import { reportsApi, dashboardApi } from '../api/services'
import { toast } from 'react-toastify'
import { FileDown, FileText } from 'lucide-react'
import { downloadBlob } from '../utils/helpers'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { statusLabel } from '../utils/helpers'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const COLORS = ['#3b82f6','#f59e0b','#10b981','#ef4444','#8b5cf6']

export default function ReportsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState('')

  useEffect(() => {
    if (user && user.role !== 'ADMIN' && user.role !== 'RESPONSABLE_MAINTENANCE') {
      navigate('/')
      return
    }
    dashboardApi.getStats().then(r => setStats(r.data)).finally(() => setLoading(false))
  }, [user, navigate])

  const exportFile = async (apiFn, filename, label) => {
    setExporting(label)
    try {
      const r = await apiFn()
      downloadBlob(r.data, filename)
      toast.success(`${filename} téléchargé`)
    } catch { toast.error('Erreur export') }
    finally { setExporting('') }
  }

  const exports = [
    { label: 'Interventions PDF', fn: () => exportFile(reportsApi.interventionsPdf, 'interventions.pdf', 'int-pdf'), id: 'int-pdf', fmt: 'PDF' },
    { label: 'Interventions CSV', fn: () => exportFile(reportsApi.interventionsCsv, 'interventions.csv', 'int-csv'), id: 'int-csv', fmt: 'CSV' },
    { label: 'Machines PDF', fn: () => exportFile(reportsApi.machinesPdf, 'machines.pdf', 'mach-pdf'), id: 'mach-pdf', fmt: 'PDF' },
    { label: 'Machines CSV', fn: () => exportFile(reportsApi.machinesCsv, 'machines.csv', 'mach-csv'), id: 'mach-csv', fmt: 'CSV' },
  ]

  return (
    <div className="space-y-6">
      <div><h1 className="page-title">Rapports & Exports</h1><p className="page-subtitle">Analyse de performance et téléchargements</p></div>

      {/* Export cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {exports.map(e => (
          <div key={e.id} className="card flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${e.fmt==='PDF'?'bg-red-900/40 text-red-400':'bg-green-900/40 text-green-400'}`}>
                <FileText size={18}/>
              </div>
              <div>
                <p className="text-white font-medium text-sm">{e.label}</p>
                <p className="text-slate-500 text-xs">{e.fmt}</p>
              </div>
            </div>
            <button onClick={e.fn} disabled={!!exporting} className="btn-secondary text-xs py-1.5 justify-center">
              <FileDown size={13}/> {exporting === e.id ? 'Export…' : 'Télécharger'}
            </button>
          </div>
        ))}
      </div>

      {/* Charts */}
      {!loading && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-base font-semibold text-white mb-4">Tendance mensuelle</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.monthlyTrend || []}>
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}/>
                <Bar dataKey="completed" fill="#10b981" radius={[4,4,0,0]} name="Terminées"/>
                <Bar dataKey="overdue" fill="#ef4444" radius={[4,4,0,0]} name="En retard"/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-base font-semibold text-white mb-4">Répartition des statuts</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={Object.entries(stats.statusDistribution||{}).map(([n,v])=>({name:statusLabel(n),value:v}))} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,value})=>`${name}: ${value}`} labelLine={false}>
                  {Object.keys(stats.statusDistribution||{}).map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-base font-semibold text-white mb-4">Performance techniciens</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.technicianPerformance||[]} layout="vertical">
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="technician" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={120}/>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}/>
                <Bar dataKey="completed" fill="#10b981" radius={[0,4,4,0]} name="Terminées"/>
                <Bar dataKey="overdue" fill="#ef4444" radius={[0,4,4,0]} name="En retard"/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-base font-semibold text-white mb-4">Top machines</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.machineRanking||[]} layout="vertical">
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="machine" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={130}/>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}/>
                <Bar dataKey="count" fill="#f59e0b" radius={[0,4,4,0]} name="Interventions"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
