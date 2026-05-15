import React, { useEffect, useState } from 'react'
import { usersApi } from '../api/services'
import Modal from '../components/ui/Modal'
import { toast } from 'react-toastify'
import { Plus, UserCheck, UserX, Pencil, Search } from 'lucide-react'
import { statusLabel, roleBadge, fmtDateTime } from '../utils/helpers'
import { useAuth } from '../contexts/AuthContext'

const ROLES = ['ADMIN','RESPONSABLE_MAINTENANCE','CHEF_EQUIPE','TECHNICIEN']
const emptyForm = { fullName:'', email:'', password:'', employeeCode:'', role:'TECHNICIEN', specialties:'', certifications:'', phone:'', department:'', active:true }
const emptyEdit = { fullName:'', email:'', role:'TECHNICIEN', specialties:'', certifications:'', phone:'', department:'', active:true }

export default function UsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [editForm, setEditForm] = useState(emptyEdit)
  const [saving, setSaving] = useState(false)
  const isAdmin = user?.role === 'ADMIN'

  const load = () => usersApi.getAll().then(r => setUsers(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleCreate = async e => {
    e.preventDefault(); setSaving(true)
    try { await usersApi.register(form); toast.success('Utilisateur créé'); setShowCreate(false); setForm(emptyForm); load() }
    catch(err) { toast.error(err.response?.data?.message || 'Erreur') }
    finally { setSaving(false) }
  }

  const handleEdit = async e => {
    e.preventDefault(); setSaving(true)
    try { await usersApi.update(showEdit.id, editForm); toast.success('Mis à jour'); setShowEdit(null); load() }
    catch(err) { toast.error(err.response?.data?.message || 'Erreur') }
    finally { setSaving(false) }
  }

  const toggleActive = async u => {
    try {
      if (u.active) { await usersApi.deactivate(u.id); toast.success('Désactivé') }
      else { await usersApi.activate(u.id); toast.success('Activé') }
      load()
    } catch { toast.error('Erreur') }
  }

  const openEdit = u => { setShowEdit(u); setEditForm({ fullName: u.fullName, email: u.email, role: u.role, specialties: u.specialties||'', certifications: u.certifications||'', phone: u.phone||'', department: u.department||'', active: u.active }) }

  const filtered = users.filter(u =>
    (!search || u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())) &&
    (!filterRole || u.role === filterRole)
  )

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div><h1 className="page-title">Utilisateurs</h1><p className="page-subtitle">{users.length} utilisateur(s)</p></div>
        {isAdmin && <button onClick={()=>{setForm(emptyForm);setShowCreate(true)}} className="btn-primary"><Plus size={16}/>Nouvel utilisateur</button>}
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 flex-1 min-w-48">
          <Search size={15} className="text-slate-500"/>
          <input className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full" placeholder="Nom, email…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <select className="select w-48" value={filterRole} onChange={e=>setFilterRole(e.target.value)}>
          <option value="">Tous les rôles</option>
          {ROLES.map(r=><option key={r} value={r}>{statusLabel(r)}</option>)}
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr><th className="th">Nom</th><th className="th">Email</th><th className="th">Code</th><th className="th">Rôle</th><th className="th">Spécialités</th><th className="th">Statut</th><th className="th">Actions</th></tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="td text-center py-12 text-slate-500">Chargement…</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={7} className="td text-center py-12 text-slate-500">Aucun utilisateur</td></tr>
              : filtered.map(u => (
                <tr key={u.id} className="tr-hover border-b border-slate-700/30">
                  <td className="td font-medium text-white">{u.fullName}</td>
                  <td className="td text-slate-400 text-xs">{u.email}</td>
                  <td className="td font-mono text-xs text-slate-500">{u.employeeCode}</td>
                  <td className="td"><span className={roleBadge(u.role)}>{statusLabel(u.role)}</span></td>
                  <td className="td text-xs text-slate-400">{u.specialties||'-'}</td>
                  <td className="td"><span className={u.active?'badge-green':'badge-gray'}>{u.active?'Actif':'Inactif'}</span></td>
                  <td className="td">
                    <div className="flex items-center gap-1">
                      {isAdmin && <button onClick={()=>openEdit(u)} className="btn-ghost p-1.5"><Pencil size={14}/></button>}
                      {isAdmin && <button onClick={()=>toggleActive(u)} className={`btn-ghost p-1.5 ${u.active?'text-red-400':'text-green-400'}`}>
                        {u.active ? <UserX size={14}/> : <UserCheck size={14}/>}
                      </button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <Modal open={showCreate} onClose={()=>setShowCreate(false)} title="Nouvel utilisateur" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="label">Nom complet *</label><input className="input" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})} required/></div>
            <div><label className="label">Email *</label><input className="input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></div>
            <div><label className="label">Mot de passe *</label><input className="input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required minLength={6}/></div>
            <div><label className="label">Code employé *</label><input className="input" value={form.employeeCode} onChange={e=>setForm({...form,employeeCode:e.target.value})} required/></div>
            <div><label className="label">Rôle *</label>
              <select className="select" value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                {ROLES.map(r=><option key={r} value={r}>{statusLabel(r)}</option>)}
              </select>
            </div>
            <div><label className="label">Téléphone</label><input className="input" value={form.phone||''} onChange={e=>setForm({...form,phone:e.target.value})}/></div>
            <div><label className="label">Département</label><input className="input" value={form.department||''} onChange={e=>setForm({...form,department:e.target.value})}/></div>
            <div><label className="label">Spécialités</label><input className="input" value={form.specialties||''} onChange={e=>setForm({...form,specialties:e.target.value})}/></div>
            <div><label className="label">Certifications</label><input className="input" value={form.certifications||''} onChange={e=>setForm({...form,certifications:e.target.value})}/></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={()=>setShowCreate(false)} className="btn-secondary">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving?'…':'Créer'}</button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!showEdit} onClose={()=>setShowEdit(null)} title="Modifier l'utilisateur" size="md">
        <form onSubmit={handleEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="label">Nom complet *</label><input className="input" value={editForm.fullName} onChange={e=>setEditForm({...editForm,fullName:e.target.value})} required/></div>
            <div><label className="label">Email *</label><input className="input" type="email" value={editForm.email} onChange={e=>setEditForm({...editForm,email:e.target.value})} required/></div>
            <div><label className="label">Rôle *</label>
              <select className="select" value={editForm.role} onChange={e=>setEditForm({...editForm,role:e.target.value})}>
                {ROLES.map(r=><option key={r} value={r}>{statusLabel(r)}</option>)}
              </select>
            </div>
            <div><label className="label">Téléphone</label><input className="input" value={editForm.phone||''} onChange={e=>setEditForm({...editForm,phone:e.target.value})}/></div>
            <div><label className="label">Département</label><input className="input" value={editForm.department||''} onChange={e=>setEditForm({...editForm,department:e.target.value})}/></div>
            <div><label className="label">Spécialités</label><input className="input" value={editForm.specialties||''} onChange={e=>setEditForm({...editForm,specialties:e.target.value})}/></div>
            <div><label className="label">Certifications</label><input className="input" value={editForm.certifications||''} onChange={e=>setEditForm({...editForm,certifications:e.target.value})}/></div>
            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-amber-500" checked={editForm.active} onChange={e=>setEditForm({...editForm,active:e.target.checked})}/>
                <span className="text-sm text-slate-300">Utilisateur actif</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={()=>setShowEdit(null)} className="btn-secondary">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving?'…':'Enregistrer'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
