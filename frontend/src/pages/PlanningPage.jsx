import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { interventionsApi, machinesApi, usersApi } from '../api/services'
import Modal from '../components/ui/Modal'
import { statusLabel, fmtDateTime } from '../utils/helpers'
import { toast } from 'react-toastify'
import { Play, Pause, CheckCircle, ShieldCheck, XCircle } from 'lucide-react'

const STATUS_COLORS = { PLANIFIEE:'#3b82f6', EN_COURS:'#f59e0b', EN_PAUSE:'#8b5cf6', TERMINEE:'#10b981', VALIDEE:'#a855f7', EN_RETARD:'#ef4444', ANNULEE:'#64748b' }

export default function PlanningPage() {
  const [events, setEvents] = useState([])
  const [selected, setSelected] = useState(null)
  const [machines, setMachines] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [filterTech, setFilterTech] = useState('')
  const [filterMachine, setFilterMachine] = useState('')
  const calRef = useRef()

  const load = async () => {
    const [inter, mach, techs] = await Promise.all([interventionsApi.getAll(), machinesApi.getAll(), usersApi.getTechnicians()])
    setMachines(mach.data)
    setTechnicians(techs.data)
    let data = inter.data
    if (filterTech) data = data.filter(i => String(i.technicianId) === filterTech)
    if (filterMachine) data = data.filter(i => String(i.machineId) === filterMachine)
    setEvents(data.map(i => ({
      id: String(i.id),
      title: `${i.machineName}${i.technicianName ? ' · ' + i.technicianName : ''}`,
      start: i.plannedAt,
      end: i.completedAt || (i.plannedAt ? new Date(new Date(i.plannedAt).getTime() + (i.durationMinutes||60)*60000).toISOString() : null),
      backgroundColor: STATUS_COLORS[i.status] || '#3b82f6',
      borderColor: STATUS_COLORS[i.status] || '#3b82f6',
      extendedProps: i
    })))
  }

  useEffect(() => { load() }, [filterTech, filterMachine])

  const handleEventClick = ({ event }) => setSelected(event.extendedProps)

  const action = async (fn, label) => {
    try { await fn(); toast.success(label); setSelected(null); load() }
    catch(err) { toast.error(err.response?.data?.message || 'Erreur') }
  }

  return (
    <div className="space-y-4">
      <div className="page-header">
        <div><h1 className="page-title">Planning</h1><p className="page-subtitle">Calendrier des interventions</p></div>
      </div>

      {/* Legend + Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(STATUS_COLORS).map(([s, c]) => (
            <div key={s} className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }}/>
              {statusLabel(s)}
            </div>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          <select className="select w-44 text-xs py-1.5" value={filterTech} onChange={e=>setFilterTech(e.target.value)}>
            <option value="">Tous techniciens</option>
            {technicians.map(t=><option key={t.id} value={t.id}>{t.fullName}</option>)}
          </select>
          <select className="select w-44 text-xs py-1.5" value={filterMachine} onChange={e=>setFilterMachine(e.target.value)}>
            <option value="">Toutes machines</option>
            {machines.map(m=><option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
      </div>

      {/* Calendar */}
      <div className="card p-4">
        <FullCalendar
          ref={calRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale="fr"
          headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
          buttonText={{ today: "Aujourd'hui", month: 'Mois', week: 'Semaine', day: 'Jour' }}
          events={events}
          eventClick={handleEventClick}
          height={600}
          slotMinTime="06:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          nowIndicator
          eventDisplay="block"
        />
      </div>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={()=>setSelected(null)} title={`Intervention #${selected?.id}`} size="md">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[['Machine', selected.machineName],['Localisation', selected.machineLocation||'-'],['Technicien', selected.technicianName||'Non assigné'],['Assignée par', selected.assignedByName||'-'],['Date planifiée', fmtDateTime(selected.plannedAt)],['Durée', selected.durationMinutes ? `${selected.durationMinutes} min` : '-']].map(([k,v])=>(
                <div key={k}><p className="text-slate-500 text-xs">{k}</p><p className="text-white font-medium">{v}</p></div>
              ))}
            </div>
            {selected.observations && <div><p className="text-slate-500 text-xs mb-1">Observations</p><p className="text-slate-300 bg-slate-900/60 rounded p-2 text-sm">{selected.observations}</p></div>}
            <div className="flex flex-wrap gap-2 pt-2">
              {selected.status === 'PLANIFIEE' && <button onClick={()=>action(()=>interventionsApi.start(selected.id),'Démarrée')} className="btn-primary py-1.5 text-sm"><Play size={14}/>Démarrer</button>}
              {selected.status === 'EN_COURS' && <button onClick={()=>action(()=>interventionsApi.pause(selected.id),'Mise en pause')} className="btn-secondary py-1.5 text-sm"><Pause size={14}/>Pause</button>}
              {selected.status === 'TERMINEE' && <button onClick={()=>action(()=>interventionsApi.validate(selected.id),'Validée')} className="btn-primary py-1.5 text-sm"><ShieldCheck size={14}/>Valider</button>}
              {['PLANIFIEE','EN_RETARD'].includes(selected.status) && <button onClick={()=>action(()=>interventionsApi.cancel(selected.id),'Annulée')} className="btn-danger py-1.5 text-sm"><XCircle size={14}/>Annuler</button>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
