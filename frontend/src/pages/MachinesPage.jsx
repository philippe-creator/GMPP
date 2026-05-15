import React, { useEffect, useState } from 'react'
import { machinesApi } from '../api/services'
import { useTheme } from '../contexts/ThemeContext'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { toast } from 'react-toastify'
import { Plus, Pencil, Trash2, Cpu, Search, QrCode } from 'lucide-react'
import { statusBadge, statusLabel, fmtDate } from '../utils/helpers'
import { QRCodeSVG as QRCode } from 'qrcode.react'

const emptyForm = { name:'', machineType:'', brand:'', model:'', serialNumber:'', manufacturingYear:'', commissioningDate:'', location:'', status:'EN_SERVICE', operatingHours:0, description:'' }

export default function MachinesPage() {
  const { theme, isDark } = useTheme()
  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [showQrModal, setShowQrModal] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => machinesApi.getAll().then(r => setMachines(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true) }
  const openEdit = m => { setEditing(m); setForm({ ...m, manufacturingYear: m.manufacturingYear||'', commissioningDate: m.commissioningDate||'', operatingHours: m.operatingHours||0 }); setShowForm(true) }

  const handleSave = async e => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) { await machinesApi.update(editing.id, form); toast.success('Machine mise à jour') }
      else { await machinesApi.create(form); toast.success('Machine créée') }
      setShowForm(false); load()
    } catch(err) { toast.error(err.response?.data?.message || 'Erreur') }
    finally { setSaving(false) }
  }

  const handleDelete = async id => {
    try { await machinesApi.delete(id); toast.success('Machine supprimée'); load() }
    catch { toast.error('Erreur lors de la suppression') }
  }

  const filtered = machines.filter(m =>
    (!search || m.name.toLowerCase().includes(search.toLowerCase()) || m.serialNumber?.toLowerCase().includes(search.toLowerCase()) || m.location?.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStatus || m.status === filterStatus)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-light ${theme.text} tracking-tight`}>Machines</h1>
          <p className={`${theme.textMuted} text-sm font-light`}>{machines.length} machine(s) enregistrée(s)</p>
        </div>
        <button onClick={openCreate} className={`${theme.button} px-4 py-2 flex items-center gap-2 text-sm tracking-wide`}>
          <Plus size={16}/>Nouvelle machine
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className={`flex items-center gap-2 ${theme.bgSecondary} border ${theme.border} rounded-none px-3 py-2 flex-1 min-w-48 transition-colors duration-300`}>
          <Search size={15} className={theme.textMuted}/>
          <input className={`bg-transparent text-sm ${theme.textSecondary} placeholder:${theme.textSubtle} outline-none w-full`} placeholder="Rechercher par nom, série, localisation…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className={`${theme.input} border ${theme.border} rounded-none px-3 py-2 w-48 outline-none`} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {STATUSES.map(s=><option key={s} value={s}>{statusLabel(s)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className={`${theme.bgCard} border ${theme.border} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDark ? 'bg-slate-900/50' : 'bg-slate-100'} border-b ${theme.border}`}>
              <tr>
                <th className={`th ${theme.textSecondary}`}>Nom</th><th className={`th ${theme.textSecondary}`}>Type</th><th className={`th ${theme.textSecondary}`}>Marque / Modèle</th>
                <th className={`th ${theme.textSecondary}`}>N° Série</th><th className={`th ${theme.textSecondary}`}>Localisation</th>
                <th className={`th ${theme.textSecondary}`}>Heures</th><th className={`th ${theme.textSecondary}`}>Statut</th><th className={`th ${theme.textSecondary}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className={`td text-center py-12 ${theme.textMuted}`}>Chargement…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className={`td text-center py-12 ${theme.textMuted}`}>Aucune machine trouvée</td></tr>
              ) : filtered.map(m => (
                <tr key={m.id} className={`tr-hover border-b ${theme.border} ${theme.hover} transition-colors`}>
                  <td className={`td font-medium ${theme.text}`}>{m.name}</td>
                  <td className={`td ${theme.textMuted}`}>{m.machineType||'-'}</td>
                  <td className={`td ${theme.textSecondary}`}>{[m.brand, m.model].filter(Boolean).join(' / ') || '-'}</td>
                  <td className={`td font-mono text-xs ${theme.textMuted}`}>{m.serialNumber||'-'}</td>
                  <td className={`td ${theme.textMuted}`}>{m.location||'-'}</td>
                  <td className={`td ${theme.textSecondary}`}>{m.operatingHours?.toLocaleString()} h</td>
                  <td className="td"><span className={statusBadge(m.status)}>{statusLabel(m.status)}</span></td>
                  <td className="td">
                    <div className="flex items-center gap-1">
                      <button onClick={()=>setShowQrModal(m)} className={`${theme.buttonSecondary} p-1.5 text-xs rounded`} title="Voir QR Code"><QrCode size={14}/></button>
                      <button onClick={()=>openEdit(m)} className={`${theme.buttonSecondary} p-1.5 text-xs rounded`}><Pencil size={14}/></button>
                      <button onClick={()=>setConfirmDelete(m.id)} className={`${isDark ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-red-100 text-red-600 hover:bg-red-200'} p-1.5 rounded transition-colors`}><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <Modal open={showForm} onClose={()=>setShowForm(false)} title={editing ? 'Modifier la machine' : 'Nouvelle machine'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="label">Nom *</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
            <div><label className="label">Type</label><input className="input" value={form.machineType||''} onChange={e=>setForm({...form,machineType:e.target.value})} placeholder="ex: HYDRAULIQUE"/></div>
            <div><label className="label">Marque</label><input className="input" value={form.brand||''} onChange={e=>setForm({...form,brand:e.target.value})}/></div>
            <div><label className="label">Modèle</label><input className="input" value={form.model||''} onChange={e=>setForm({...form,model:e.target.value})}/></div>
            <div><label className="label">N° Série</label><input className="input" value={form.serialNumber||''} onChange={e=>setForm({...form,serialNumber:e.target.value})}/></div>
            <div><label className="label">Année de fabrication</label><input className="input" type="number" value={form.manufacturingYear||''} onChange={e=>setForm({...form,manufacturingYear:e.target.value})}/></div>
            <div><label className="label">Date mise en service</label><input className="input" type="date" value={form.commissioningDate||''} onChange={e=>setForm({...form,commissioningDate:e.target.value})}/></div>
            <div><label className="label">Localisation</label><input className="input" value={form.location||''} onChange={e=>setForm({...form,location:e.target.value})}/></div>
            <div><label className="label">Heures de fonctionnement</label><input className="input" type="number" value={form.operatingHours||0} onChange={e=>setForm({...form,operatingHours:+e.target.value})}/></div>
            <div><label className="label">Statut</label>
              <select className="select" value={form.status||'EN_SERVICE'} onChange={e=>setForm({...form,status:e.target.value})}>
                {STATUSES.map(s=><option key={s} value={s}>{statusLabel(s)}</option>)}
              </select>
            </div>
            <div className="col-span-2"><label className="label">Description</label><textarea className="input" rows={2} value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={()=>setShowForm(false)} className="btn-secondary">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving?'Enregistrement…':'Enregistrer'}</button>
          </div>
        </form>
      </Modal>

      {/* QR Code Modal */}
      <Modal open={!!showQrModal} onClose={()=>setShowQrModal(null)} title="Code QR Machine" size="sm">
        {showQrModal && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-6 bg-white rounded-lg">
              <QRCode value={showQrModal.qrCode || showQrModal.id?.toString()} size={200} level="H" includeMargin={true} />
            </div>
            <div>
              <p className={`${theme.textMuted} text-xs mb-1`}>Code QR</p>
              <p className={`${theme.text} font-mono text-lg`}>{showQrModal.qrCode || 'Non généré'}</p>
            </div>
            <div>
              <p className={`${theme.textMuted} text-xs mb-1`}>Machine</p>
              <p className={`${theme.text} font-medium`}>{showQrModal.name}</p>
              <p className={`${theme.textSecondary} text-sm`}>{showQrModal.serialNumber || 'N/A'}</p>
            </div>
            <div className={`pt-4 border-t ${theme.border}`}>
              <p className={`${theme.textMuted} text-xs`}>Scannez ce code QR pour accéder à la machine sur mobile</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
