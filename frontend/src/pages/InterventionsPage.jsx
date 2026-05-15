import React, { useEffect, useState } from 'react'
import { interventionsApi, machinesApi, usersApi, maintenancePointsApi } from '../api/services'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { toast } from 'react-toastify'
import { Plus, Search, Play, Pause, CheckCircle, XCircle, ShieldCheck, Pencil, Trash2, AlertTriangle, Image as ImageIcon, X } from 'lucide-react'
import { statusBadge, statusLabel, fmtDateTime } from '../utils/helpers'
import { useAuth } from '../contexts/AuthContext'

const emptyForm = { machineId:'', maintenancePointId:'', technicianId:'', plannedAt:'', observations:'', urgent:false }
const emptyComplete = { observations:'', etatConstate:'', findingStatus:'NORMAL', technicianSignature:'', correctionReport:'', photos:[] }
const FINDINGS = ['NORMAL','USURE_DETECTEE','ANOMALIE_TROUVEE','REPARATION_REQUISE']
const STATUSES = ['PLANIFIEE','EN_COURS','EN_PAUSE','TERMINEE','VALIDEE','EN_RETARD','ANNULEE']

export default function InterventionsPage() {
  const { user } = useAuth()
  const [interventions, setInterventions] = useState([])
  const [machines, setMachines] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [points, setPoints] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(null)
  const [showComplete, setShowComplete] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [completeForm, setCompleteForm] = useState(emptyComplete)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const canCreateIntervention = user?.role !== 'TECHNICIEN'
  const canValidateIntervention = user?.role === 'ADMIN' || user?.role === 'RESPONSABLE_MAINTENANCE'
  const canCancelIntervention = user?.role === 'ADMIN' || user?.role === 'RESPONSABLE_MAINTENANCE'

  const load = () => {
    Promise.all([interventionsApi.getAll(), machinesApi.getAll(), usersApi.getTechnicians(), maintenancePointsApi.getAll()])
      .then(([i, m, t, p]) => { setInterventions(i.data); setMachines(m.data); setTechnicians(t.data); setPoints(p.data) })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true) }
  const openEdit = i => { setEditing(i); setForm({ machineId: i.machineId, maintenancePointId: i.maintenancePointId||'', technicianId: i.technicianId||'', plannedAt: i.plannedAt?.slice(0,16)||'', observations: i.observations||'', urgent: i.urgent||false }); setShowForm(true) }

  const handleSave = async e => {
    e.preventDefault(); setSaving(true)
    try {
      const p = { ...form, machineId: +form.machineId, technicianId: form.technicianId ? +form.technicianId : null, maintenancePointId: form.maintenancePointId ? +form.maintenancePointId : null, plannedAt: form.plannedAt + ':00' }
      if (editing) { await interventionsApi.update(editing.id, p); toast.success('Intervention mise à jour') }
      else { await interventionsApi.create(p); toast.success('Intervention créée') }
      setShowForm(false); load()
    } catch(err) { toast.error(err.response?.data?.message || 'Erreur') }
    finally { setSaving(false) }
  }

  const action = async (fn, label) => {
    try { await fn(); toast.success(label); load() }
    catch(err) { toast.error(err.response?.data?.message || 'Erreur') }
  }

  const handleComplete = async e => {
    e.preventDefault(); setSaving(true)
    try { await interventionsApi.complete(showComplete.id, completeForm); toast.success('Intervention terminée'); setShowComplete(null); load() }
    catch(err) { toast.error(err.response?.data?.message || 'Erreur') }
    finally { setSaving(false) }
  }

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    
    const newPhotos = []
    for (const file of files) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target.result
        newPhotos.push(base64)
        if (newPhotos.length === files.length) {
          setCompleteForm(prev => ({ ...prev, photos: [...(prev.photos || []), ...newPhotos] }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = (index) => {
    setCompleteForm(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const filtered = interventions.filter(i =>
    (!search || i.machineName?.toLowerCase().includes(search.toLowerCase()) || i.technicianName?.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStatus || i.status === filterStatus)
  )

  const machinePoints = points.filter(p => String(p.machineId) === String(form.machineId))

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div><h1 className="page-title">Interventions</h1><p className="page-subtitle">{interventions.length} intervention(s) au total</p></div>
        {canCreateIntervention && <button onClick={openCreate} className="btn-primary"><Plus size={16}/>Nouvelle intervention</button>}
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 flex-1 min-w-48">
          <Search size={15} className="text-slate-500"/>
          <input className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full" placeholder="Rechercher machine, technicien…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="select w-48" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {STATUSES.map(s=><option key={s} value={s}>{statusLabel(s)}</option>)}
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="th">#</th><th className="th">Machine</th><th className="th">Technicien</th>
                <th className="th">Date planifiée</th><th className="th">Durée réelle</th>
                <th className="th">Constat</th><th className="th">Statut</th><th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={8} className="td text-center py-12 text-slate-500">Chargement…</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={8} className="td text-center py-12 text-slate-500">Aucune intervention</td></tr>
              : filtered.map(i => (
                <tr key={i.id} className="tr-hover border-b border-slate-700/30 cursor-pointer" onClick={()=>setShowDetail(i)}>
                  <td className="td text-slate-500 font-mono text-xs">#{i.id}</td>
                  <td className="td">
                    <div>
                      <span className="font-medium text-white">{i.machineName}</span>
                      {i.urgent && <span className="ml-2 badge-red text-xs">URGENT</span>}
                      <div className="text-xs text-slate-500">{i.machineLocation}</div>
                    </div>
                  </td>
                  <td className="td text-slate-400">{i.technicianName||<span className="text-slate-600 italic">Non assigné</span>}</td>
                  <td className="td text-sm">{fmtDateTime(i.plannedAt)}</td>
                  <td className="td text-slate-400">{i.durationMinutes ? `${i.durationMinutes} min` : '-'}</td>
                  <td className="td"><span className={i.findingStatus==='NORMAL'?'badge-green':i.findingStatus==='USURE_DETECTEE'?'badge-yellow':i.findingStatus==='ANOMALIE_TROUVEE'?'badge-red':'badge-red'}>{statusLabel(i.findingStatus)}</span></td>
                  <td className="td"><span className={statusBadge(i.status)}>{statusLabel(i.status)}</span></td>
                  <td className="td" onClick={e=>e.stopPropagation()}>
                    <div className="flex items-center gap-0.5">
                      {i.status === 'PLANIFIEE' && <button title="Démarrer" onClick={()=>action(()=>interventionsApi.start(i.id),'Démarrée')} className="btn-ghost p-1.5 text-green-400"><Play size={13}/></button>}
                      {i.status === 'EN_COURS' && <button title="Pause" onClick={()=>action(()=>interventionsApi.pause(i.id),'Mise en pause')} className="btn-ghost p-1.5 text-yellow-400"><Pause size={13}/></button>}
                      {(i.status==='EN_COURS'||i.status==='EN_PAUSE') && <button title="Terminer" onClick={()=>{setShowComplete(i);setCompleteForm(emptyComplete)}} className="btn-ghost p-1.5 text-blue-400"><CheckCircle size={13}/></button>}
                      {i.status==='TERMINEE' && canValidateIntervention && <button title="Valider" onClick={()=>action(()=>interventionsApi.validate(i.id),'Validée')} className="btn-ghost p-1.5 text-purple-400"><ShieldCheck size={13}/></button>}
                      {['PLANIFIEE','EN_RETARD'].includes(i.status) && canCreateIntervention && <button title="Modifier" onClick={()=>openEdit(i)} className="btn-ghost p-1.5"><Pencil size={13}/></button>}
                      {['PLANIFIEE','EN_RETARD'].includes(i.status) && canCancelIntervention && <button title="Annuler" onClick={()=>action(()=>interventionsApi.cancel(i.id),'Annulée')} className="btn-ghost p-1.5 text-red-400"><XCircle size={13}/></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal open={showForm} onClose={()=>setShowForm(false)} title={editing?'Modifier intervention':'Nouvelle intervention'} size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="label">Machine *</label>
            <select className="select" value={form.machineId} onChange={e=>setForm({...form,machineId:e.target.value,maintenancePointId:''})} required>
              <option value="">Sélectionner…</option>
              {machines.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          {machinePoints.length > 0 && <div><label className="label">Point de maintenance</label>
            <select className="select" value={form.maintenancePointId||''} onChange={e=>setForm({...form,maintenancePointId:e.target.value})}>
              <option value="">Aucun (intervention libre)</option>
              {machinePoints.map(p=><option key={p.id} value={p.id}>{statusLabel(p.operationType)} — {p.preciseLocation||p.description}</option>)}
            </select>
          </div>}
          <div><label className="label">Technicien</label>
            <select className="select" value={form.technicianId||''} onChange={e=>setForm({...form,technicianId:e.target.value})}>
              <option value="">Non assigné</option>
              {technicians.map(t=><option key={t.id} value={t.id}>{t.fullName} ({statusLabel(t.role)})</option>)}
            </select>
          </div>
          <div><label className="label">Date planifiée *</label><input className="input" type="datetime-local" value={form.plannedAt} onChange={e=>setForm({...form,plannedAt:e.target.value})} required/></div>
          <div><label className="label">Observations</label><textarea className="input" rows={2} value={form.observations||''} onChange={e=>setForm({...form,observations:e.target.value})}/></div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-amber-500" checked={form.urgent} onChange={e=>setForm({...form,urgent:e.target.checked})}/>
            <span className="text-sm text-slate-300">Marquer comme urgent</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={()=>setShowForm(false)} className="btn-secondary">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving?'…':'Enregistrer'}</button>
          </div>
        </form>
      </Modal>

      {/* Complete Modal */}
      <Modal open={!!showComplete} onClose={()=>setShowComplete(null)} title="Clôturer l'intervention" size="md">
        <form onSubmit={handleComplete} className="space-y-4">
          <div><label className="label">Observations</label><textarea className="input" rows={2} value={completeForm.observations} onChange={e=>setCompleteForm({...completeForm,observations:e.target.value})}/></div>
          <div><label className="label">État constaté</label><textarea className="input" rows={2} value={completeForm.etatConstate} onChange={e=>setCompleteForm({...completeForm,etatConstate:e.target.value})}/></div>
          <div><label className="label">Constat</label>
            <select className="select" value={completeForm.findingStatus} onChange={e=>setCompleteForm({...completeForm,findingStatus:e.target.value})}>
              {FINDINGS.map(f=><option key={f} value={f}>{statusLabel(f)}</option>)}
            </select>
          </div>
          <div><label className="label">Rapport de correction</label><textarea className="input" rows={2} value={completeForm.correctionReport} onChange={e=>setCompleteForm({...completeForm,correctionReport:e.target.value})}/></div>
          <div><label className="label">Signature technicien</label><input className="input" value={completeForm.technicianSignature} onChange={e=>setCompleteForm({...completeForm,technicianSignature:e.target.value})}/></div>
          
          <div>
            <label className="label">Photos</label>
            <div className="space-y-3">
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label 
                  htmlFor="photo-upload"
                  className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-slate-500 transition-colors"
                >
                  <ImageIcon size={20} className="text-slate-400" />
                  <span className="text-slate-400 text-sm">Cliquez pour ajouter des photos</span>
                </label>
              </div>
              
              {completeForm.photos && completeForm.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {completeForm.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={photo} 
                        alt={`Photo ${index + 1}`} 
                        className="w-full h-24 object-cover rounded-lg border border-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={()=>setShowComplete(null)} className="btn-secondary">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving?'…':'Clôturer'}</button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!showDetail} onClose={()=>setShowDetail(null)} title={`Intervention #${showDetail?.id}`} size="lg">
        {showDetail && <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            {[['Machine', showDetail.machineName],['Localisation', showDetail.machineLocation||'-'],['Opération', statusLabel(showDetail.operationType)||'-'],['Technicien', showDetail.technicianName||'Non assigné'],['Planifiée le', fmtDateTime(showDetail.plannedAt)],['Démarrée le', fmtDateTime(showDetail.executedAt)],['Terminée le', fmtDateTime(showDetail.completedAt)],['Validée le', fmtDateTime(showDetail.validatedAt)],['Durée réelle', showDetail.durationMinutes ? `${showDetail.durationMinutes} min` : '-'],['Constat', statusLabel(showDetail.findingStatus)]].map(([k,v])=>(
              <div key={k}><p className="text-slate-500 text-xs mb-0.5">{k}</p><p className="text-white font-medium">{v}</p></div>
            ))}
          </div>
          {showDetail.observations && <div><p className="text-slate-500 text-xs mb-1">Observations</p><p className="text-slate-300 bg-slate-900 rounded p-3">{showDetail.observations}</p></div>}
          {showDetail.etatConstate && <div><p className="text-slate-500 text-xs mb-1">État constaté</p><p className="text-slate-300 bg-slate-900 rounded p-3">{showDetail.etatConstate}</p></div>}
          {showDetail.correctionReport && <div><p className="text-slate-500 text-xs mb-1">Rapport correction</p><p className="text-slate-300 bg-slate-900 rounded p-3">{showDetail.correctionReport}</p></div>}
          <div className="flex items-center gap-2 pt-2">
            <span className={statusBadge(showDetail.status)}>{statusLabel(showDetail.status)}</span>
            {showDetail.urgent && <span className="badge-red">URGENT</span>}
            {showDetail.supervisorValidation && <span className="text-xs text-slate-500">Validé par: {showDetail.supervisorValidation}</span>}
          </div>
        </div>}
      </Modal>
    </div>
  )
}
