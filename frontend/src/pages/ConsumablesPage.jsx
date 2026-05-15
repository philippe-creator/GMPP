import React, { useEffect, useState } from 'react'
import { consumablesApi } from '../api/services'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { toast } from 'react-toastify'
import { Plus, Pencil, Trash2, Search, AlertTriangle, MinusCircle, PlusCircle } from 'lucide-react'

const emptyForm = { name:'', reference:'', category:'', unit:'', currentStock:0, minimumStock:0, unitPrice:0, supplier:'', location:'' }

export default function ConsumablesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const [adjustModal, setAdjustModal] = useState(null)
  const [adjustQty, setAdjustQty] = useState(0)
  const [adjustType, setAdjustType] = useState('add')

  const load = () => consumablesApi.getAll().then(r => setItems(r.data)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true) }
  const openEdit = c => { setEditing(c); setForm({ ...c }); setShowForm(true) }

  const handleSave = async e => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) { await consumablesApi.update(editing.id, form); toast.success('Mis à jour') }
      else { await consumablesApi.create(form); toast.success('Créé') }
      setShowForm(false); load()
    } catch(err) { toast.error(err.response?.data?.message || 'Erreur') }
    finally { setSaving(false) }
  }

  const handleDelete = async id => {
    try { await consumablesApi.delete(id); toast.success('Supprimé'); load() }
    catch { toast.error('Erreur') }
  }

  const handleAdjust = async () => {
    try {
      if (adjustType === 'add') await consumablesApi.addStock(adjustModal.id, adjustQty)
      else await consumablesApi.deduct(adjustModal.id, adjustQty)
      toast.success('Stock mis à jour'); setAdjustModal(null); load()
    } catch(err) { toast.error(err.response?.data?.message || 'Stock insuffisant') }
  }

  const lowStock = items.filter(i => i.currentStock <= i.minimumStock)
  const filtered = items.filter(i => {
    if (search && !i.name?.toLowerCase().includes(search.toLowerCase()) && !i.reference?.toLowerCase().includes(search.toLowerCase())) return false
    if (tab === 'low' && i.currentStock > i.minimumStock) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div><h1 className="page-title">Consommables</h1><p className="page-subtitle">{items.length} article(s) en stock</p></div>
        <button onClick={openCreate} className="btn-primary"><Plus size={16}/>Nouveau consommable</button>
      </div>

      {lowStock.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-amber-900/20 border border-amber-800/40 rounded-xl">
          <AlertTriangle size={18} className="text-amber-400 shrink-0"/>
          <span className="text-amber-300 text-sm font-medium">{lowStock.length} article(s) en stock bas — {lowStock.map(i=>i.name).join(', ')}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex bg-slate-800 rounded-lg p-1">
          {[['all','Tous'],['low','Stock bas']].map(([v,l])=>(
            <button key={v} onClick={()=>setTab(v)} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${tab===v?'bg-amber-500 text-white':'text-slate-400 hover:text-white'}`}>{l}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 flex-1 min-w-48">
          <Search size={15} className="text-slate-500"/>
          <input className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full" placeholder="Nom, référence…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50 border-b border-slate-700">
              <tr><th className="th">Désignation</th><th className="th">Référence</th><th className="th">Catégorie</th><th className="th">Stock actuel</th><th className="th">Stock min.</th><th className="th">Prix unit.</th><th className="th">Fournisseur</th><th className="th">Actions</th></tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={8} className="td text-center py-12 text-slate-500">Chargement…</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={8} className="td text-center py-12 text-slate-500">Aucun consommable</td></tr>
              : filtered.map(c => {
                const isLow = c.currentStock <= c.minimumStock
                return (
                  <tr key={c.id} className="tr-hover border-b border-slate-700/30">
                    <td className="td font-medium text-white">{c.name}</td>
                    <td className="td font-mono text-xs text-slate-400">{c.reference||'-'}</td>
                    <td className="td text-slate-400">{c.category||'-'}</td>
                    <td className="td">
                      <span className={isLow?'text-red-400 font-bold':'text-white'}>{c.currentStock} {c.unit}</span>
                      {isLow && <span className="ml-2 badge-red text-xs">BAS</span>}
                    </td>
                    <td className="td text-slate-500">{c.minimumStock} {c.unit}</td>
                    <td className="td text-slate-300">{c.unitPrice ? `${c.unitPrice} €` : '-'}</td>
                    <td className="td text-slate-400 text-xs">{c.supplier||'-'}</td>
                    <td className="td">
                      <div className="flex items-center gap-0.5">
                        <button title="Ajouter stock" onClick={()=>{setAdjustModal(c);setAdjustQty(1);setAdjustType('add')}} className="btn-ghost p-1.5 text-green-400"><PlusCircle size={14}/></button>
                        <button title="Déduire stock" onClick={()=>{setAdjustModal(c);setAdjustQty(1);setAdjustType('deduct')}} className="btn-ghost p-1.5 text-amber-400"><MinusCircle size={14}/></button>
                        <button onClick={()=>openEdit(c)} className="btn-ghost p-1.5"><Pencil size={14}/></button>
                        <button onClick={()=>setConfirmDelete(c.id)} className="btn-ghost p-1.5 text-red-400"><Trash2 size={14}/></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showForm} onClose={()=>setShowForm(false)} title={editing?'Modifier consommable':'Nouveau consommable'} size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><label className="label">Désignation *</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
            <div><label className="label">Référence</label><input className="input" value={form.reference||''} onChange={e=>setForm({...form,reference:e.target.value})}/></div>
            <div><label className="label">Catégorie</label><input className="input" value={form.category||''} onChange={e=>setForm({...form,category:e.target.value})} placeholder="ex: Lubrifiants"/></div>
            <div><label className="label">Unité</label><input className="input" value={form.unit||''} onChange={e=>setForm({...form,unit:e.target.value})} placeholder="ex: kg, L, pièce"/></div>
            <div><label className="label">Stock actuel</label><input className="input" type="number" step="0.01" value={form.currentStock||0} onChange={e=>setForm({...form,currentStock:+e.target.value})}/></div>
            <div><label className="label">Stock minimum</label><input className="input" type="number" step="0.01" value={form.minimumStock||0} onChange={e=>setForm({...form,minimumStock:+e.target.value})}/></div>
            <div><label className="label">Prix unitaire (€)</label><input className="input" type="number" step="0.01" value={form.unitPrice||0} onChange={e=>setForm({...form,unitPrice:+e.target.value})}/></div>
            <div><label className="label">Fournisseur</label><input className="input" value={form.supplier||''} onChange={e=>setForm({...form,supplier:e.target.value})}/></div>
            <div className="col-span-2"><label className="label">Emplacement</label><input className="input" value={form.location||''} onChange={e=>setForm({...form,location:e.target.value})}/></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={()=>setShowForm(false)} className="btn-secondary">Annuler</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving?'…':'Enregistrer'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={!!adjustModal} onClose={()=>setAdjustModal(null)} title={`Ajuster le stock — ${adjustModal?.name}`} size="sm">
        <div className="space-y-4">
          <div className="flex gap-2">
            <button onClick={()=>setAdjustType('add')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${adjustType==='add'?'bg-green-600 text-white':'bg-slate-700 text-slate-400'}`}>Entrée stock</button>
            <button onClick={()=>setAdjustType('deduct')} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${adjustType==='deduct'?'bg-amber-500 text-white':'bg-slate-700 text-slate-400'}`}>Sortie stock</button>
          </div>
          <div><label className="label">Quantité ({adjustModal?.unit})</label><input className="input" type="number" step="0.01" min="0.01" value={adjustQty} onChange={e=>setAdjustQty(+e.target.value)}/></div>
          <p className="text-sm text-slate-400">Stock actuel: <span className="text-white font-medium">{adjustModal?.currentStock} {adjustModal?.unit}</span></p>
          <div className="flex justify-end gap-3">
            <button onClick={()=>setAdjustModal(null)} className="btn-secondary">Annuler</button>
            <button onClick={handleAdjust} className="btn-primary">Confirmer</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!confirmDelete} onClose={()=>setConfirmDelete(null)} onConfirm={()=>handleDelete(confirmDelete)} title="Supprimer" message="Confirmer la suppression ?" danger/>
    </div>
  )
}
