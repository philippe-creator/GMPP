import React, { useEffect, useState } from 'react'
import { maintenancePointsApi, machinesApi } from '../api/services'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { toast } from 'react-toastify'
import { Plus, Pencil, Trash2, Search, AlertTriangle } from 'lucide-react'
import { statusLabel, fmtDate } from '../utils/helpers'

const OPS = ['GRAISSAGE','NETTOYAGE','INSPECTION','REMPLACEMENT','REGLAGE','MESURE','SERRAGE','TEST','CALIBRATION','AUTRE']
const FREQS = ['QUOTIDIENNE','HEBDOMADAIRE','BIMENSUELLE','MENSUELLE','TRIMESTRIELLE','SEMESTRIELLE','ANNUELLE','SELON_COMPTEUR']
const emptyForm = { machineId:'', operationType:'INSPECTION', description:'', preciseLocation:'', consumableType:'', quantityRequired:'', quantityUnit:'', frequency:'MENSUELLE', nextPlannedDate:'', estimatedDurationMinutes:'', instructions:'' }

export default function MaintenancePointsPage() {
  const [points, setPoints] = useState([])
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterMachine, setFilterMachine] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('all')

  const load = () => {
    Promise.all([maintenancePointsApi.getAll(), machinesApi.getAll()])
      .then(([p, m]) => { setPoints(p.data); setMachines(m.data) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true) }
  const openEdit = p => { setEditing(p); setForm({ ...p, machineId: p.machineId, nextPlannedDate: p.nextPlannedDate||'', quantityRequired: p.quantityRequired||'' }); setShowForm(true) }

  const handleSave = async e => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form, machineId: +form.machineId, quantityRequired: form.quantityRequired ? +form.quantityRequired : null, estimatedDurationMinutes: form.estimatedDurationMinutes ? +form.estimatedDurationMinutes : null }
      if (editing) { await maintenancePointsApi.update(editing.id, payload); toast.success('Point mis à jour') }
      else { await maintenancePointsApi.create(payload); toast.success('Point créé') }
      setShowForm(false); load()
    } catch(err) { toast.error(err.response?.data?.message || 'Erreur') }
    finally { setSaving(false) }
  }

  const handleDelete = async id => {
    try { await maintenancePointsApi.delete(id); toast.success('Supprimé'); load() }
    catch { toast.error('Erreur') }
  }

  const today = new Date().toISOString().split('T')[0]
  const filtered = points.filter(p => {
    if (search && !p.machineName?.toLowerCase().includes(search.toLowerCase()) && !p.operationType?.toLowerCase().includes(search.toLowerCase())) return false
    if (filterMachine && String(p.machineId) !== filterMachine) return false
    if (tab === 'overdue' && !(p.nextPlannedDate && p.nextPlannedDate < today)) return false
    if (tab === 'upcoming') {
      const in7 = new Date(); in7.setDate(in7.getDate()+7)
      if (!p.nextPlannedDate || p.nextPlannedDate < today || p.nextPlannedDate > in7.toISOString().split('T')[0]) return false
    }
    return true
  })

  const overdueCount = points.filter(p => p.nextPlannedDate && p.nextPlannedDate < today).length

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div><h1 className="page-title">Points de Maintenance</h1><p className="page-subtitle">{points.length} point(s) défini(s)</p></div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16}/>Nouveau point</button>
      </div>

      {overdueCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-800/40 rounded-xl">
          <AlertTriangle size={18} className="text-red-400 shrink-0"/>
          <span className="text-red-300 text-sm font-medium">{overdueCount} point(s) en retard de maintenance</span>
        </div>
      )}

      {/* Tabs + Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex bg-slate-800 rounded-lg p-1">
          {[['all','Tous'],['overdue','En retard'],['upcoming','Prochains 7j']].map(([v,l])=>(
            <button key={v} onClick={()=>setTab(v)} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${tab===v?'bg-amber-500 text-white':'text-slate-400 hover:text-white'}`}>{l}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 flex-1 min-w-48">
          <Search size={15} className="text-slate-500"/>
          <input className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full" placeholder="Rechercher…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="select w-48" value={filterMachine} onChange={e=>setFilterMachine(e.target.value)}>
          <option value="">Toutes les machines</option>
          {machines.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="th">Machine</th><th className="th">Opération</th><th className="th">Localisation</th>
                <th className="th">Fréquence</th><th className="th">Consommable</th>
                <th className="th">Prochaine date</th><th className="th">Durée est.</th><th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={8} className="td text-center py-12 text-slate-500">Chargement…</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={8} className="td text-center py-12 text-slate-500">Aucun point trouvé</td></tr>
              : filtered.map(p => {
                const isOverdue = p.nextPlannedDate && p.nextPlannedDate < today
                return (
                  <tr key={p.id} className="tr-hover border-b border-slate-700/30">
                    <td className="td font-medium text-white">{p.machineName}</td>
                    <td className="td"><span className="badge-blue">{statusLabel(p.operationType)}</span></td>
                    <td className="td text-slate-400 text-xs">{p.preciseLocation||'-'}</td>
                    <td className="td"><span className="badge-gray">{statusLabel(p.frequency)}</span></td>
                    <td className="td text-xs text-slate-400">{p.consumableType ? `${p.consumableType} ${p.quantityRequired||''}${p.quantityUnit||''}` : '-'}</td>
                    <td className="td">
                      <span className={isOverdue ? 'text-red-400 font-medium' : 'text-slate-300'}>{fmtDate(p.nextPlannedDate)}</span>
                      {isOverdue && <span className="ml-1 badge-red">Retard</span>}
                    </td>
                    <td className="td text-slate-400">{p.estimatedDurationMinutes ? `${p.estimatedDurationMinutes} min` : '-'}</td>
                    <td className="td">
                      <div className="flex items-center gap-1">
                        <button onClick={()=>openEdit(p)} className="btn-ghost p-1.5"><Pencil size={14}/></button>
                        <button onClick={()=>setConfirmDelete(p.id)} className="btn-ghost p-1.5 text-red-400 hover:text-red-300"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showForm} onClose={()=>setShowForm(false)} title={editing?'Modifier le point':'Nouveau point de maintenance'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Machine *</label>
              <select className="select" value={form.machineId||''} onChange={e=>setForm({...form,machineId:e.target.value})} required>
                <option value="">Sélectionner…</option>
                {machines.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div><label className="label">Type d'opération *</label>
              <select className="select" value={form.operationType} onChange={e=>setForm({...form,operationType:e.target.value})}>
                {OPS.map(o=><option key={o} value={o}>{statusLabel(o)}</option>)}
              </select>
            </div>
            <div className="col-span-2"><label className="label">Description</label><textarea className="input" rows={2} value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})}/></div>
            <div><label className="label">Localisation précise</label><input className="input" value={form.preciseLocation||''} onChange={e=>setForm({...form,preciseLocation:e.target.value})}/></div>
            <div><label className="label">Fréquence</label>
              <select className="select" value={form.frequency||'MENSUELLE'} onChange={e=>setForm({...form,frequency:e.target.value})}>
                {FREQS.map(f=><option key={f} value={f}>{statusLabel(f)}</option>)}
              </select>
            </div>
            <div><label className="label">Type consommable</label><input className="input" value={form.consumableType||''} onChange={e=>setForm({...form,consumableType:e.target.value})}/></div>
            <div><label className="label">Quantité</label>
              <div className="flex gap-2">
                <input className="input" type="number" step="0.01" value={form.quantityRequired||''} onChange={e=>setForm({...form,quantityRequired:e.target.value})} placeholder="0"/>
                <input className="input w-24" value={form.quantityUnit||''} onChange={e=>setForm({...form,quantityUnit:e.target.value})} placeholder="unité"/>
              </div>
            </div>
            <div><label className="label">Prochaine date prévue</label><input className="input" type="date" value={form.nextPlannedDate||''} onChange={e=>setForm({...form,nextPlannedDate:e.target.value})}/></div>
            <div><label className="label">Durée estimée (min)</label><input className="input" type="number" value={form.estimatedDurationMinutes||''} onChange={e=>setForm({...form,estimatedDurationMinutes:e.target.value})}/></div>
            <div className="col-span-2"><label className="label">Instructions</label><textarea className="input" rows={2} value={form.instructions||''} onChange={e=>setForm({...form,instructions:e.target.value})}/></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={()=>setShowForm(false)} className="btn-secondary">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving?'Enregistrement…':'Enregistrer'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!confirmDelete} onClose={()=>setConfirmDelete(null)} onConfirm={()=>handleDelete(confirmDelete)} title="Supprimer le point" message="Confirmer la suppression ?" danger/>
    </div>
  )
}
