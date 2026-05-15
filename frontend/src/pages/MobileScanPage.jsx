import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import QrScanner from 'react-qr-scanner'
import { machinesApi, interventionsApi } from '../api/services'
import { useTheme } from '../contexts/ThemeContext'
import { toast } from 'react-toastify'
import { Camera, CameraOff, QrCode, ArrowLeft, Clock, Play, CheckCircle, AlertTriangle, Image as ImageIcon } from 'lucide-react'
import { statusBadge, statusLabel, fmtDateTime } from '../utils/helpers'

export default function MobileScanPage() {
  const { theme, isDark } = useTheme()
  const navigate = useNavigate()
  const [scanning, setScanning] = useState(true)
  const [machine, setMachine] = useState(null)
  const [interventions, setInterventions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleScan = async (result) => {
    if (result && scanning) {
      setScanning(false)
      setLoading(true)
      setError(null)
      try {
        const qrCode = result?.text
        if (!qrCode) {
          setError('Code QR invalide')
          setScanning(true)
          setLoading(false)
          return
        }
        const machineRes = await machinesApi.getByQrCode(qrCode)
        setMachine(machineRes.data)
        
        const interventionsRes = await interventionsApi.getByMachine(machineRes.data.id)
        setInterventions(interventionsRes.data)
        toast.success(`Machine trouvée: ${machineRes.data.name}`)
      } catch (err) {
        setError('Machine non trouvée avec ce code QR')
        setScanning(true)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleError = (err) => {
    console.error(err)
  }

  const resetScan = () => {
    setMachine(null)
    setInterventions([])
    setError(null)
    setScanning(true)
  }

  const viewMachineDetails = () => {
    navigate(`/machines`)
  }

  const startIntervention = async (interventionId) => {
    try {
      await interventionsApi.start(interventionId)
      toast.success('Intervention démarrée')
      const interventionsRes = await interventionsApi.getByMachine(machine.id)
      setInterventions(interventionsRes.data)
    } catch (err) {
      toast.error('Erreur lors du démarrage')
    }
  }

  const completeIntervention = (interventionId) => {
    navigate(`/interventions`, { state: { completeInterventionId: interventionId } })
  }

  return (
    <div className={`min-h-screen ${theme.bg} pb-20`}>
      {/* Header */}
      <div className={`${theme.bgCard} border-b ${theme.border} p-4 sticky top-0 z-50`}>
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className={`${theme.textMuted} hover:${theme.text} transition-colors`}>
            <ArrowLeft size={24} />
          </button>
          <h1 className={`text-lg font-medium ${theme.text}`}>Scan QR Machine</h1>
          <div className="w-6" />
        </div>
      </div>

      {!machine ? (
        <div className="p-4">
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${isDark ? 'bg-amber-500/20' : 'bg-amber-100'} mb-4`}>
              <QrCode size={32} className={isDark ? 'text-amber-400' : 'text-amber-600'} />
            </div>
            <h2 className={`text-xl font-medium ${theme.text} mb-2`}>Scanner le code QR</h2>
            <p className={`${theme.textMuted} text-sm`}>Scannez le code QR d'une machine pour accéder à ses informations et interventions</p>
          </div>

          {scanning ? (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <QrScanner
                onScan={handleScan}
                onError={handleError}
                constraints={{ facingMode: 'environment' }}
                style={{ width: '100%', height: '400px' }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-64 h-64 border-4 ${isDark ? 'border-white/50' : 'border-black/50'} rounded-lg`} />
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <button onClick={() => setScanning(true)} className={`${theme.button} px-6 py-3 rounded-full flex items-center gap-2 mx-auto`}>
                <Camera size={20} />
                <span>Scanner à nouveau</span>
              </button>
            </div>
          )}

          {error && (
            <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-red-500/20 border border-red-500/50' : 'bg-red-100 border border-red-200'}`}>
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}

          {loading && (
            <div className="mt-4 text-center">
              <div className={`w-8 h-8 border-2 ${isDark ? 'border-white/30 border-t-white' : 'border-black/30 border-t-black'} rounded-full animate-spin mx-auto`} />
              <p className={`${theme.textMuted} text-sm mt-2`}>Recherche de la machine...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4">
          {/* Machine Info Card */}
          <div className={`${theme.bgCard} border ${theme.border} rounded-xl p-4 mb-4`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className={`text-xl font-medium ${theme.text}`}>{machine.name}</h2>
                <p className={`${theme.textMuted} text-sm`}>{machine.machineType || 'Type non spécifié'}</p>
              </div>
              <span className={statusBadge(machine.status)}>{statusLabel(machine.status)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div>
                <p className={`${theme.textMuted} text-xs mb-1`}>Marque / Modèle</p>
                <p className={`${theme.text} text-sm`}>{[machine.brand, machine.model].filter(Boolean).join(' / ') || '-'}</p>
              </div>
              <div>
                <p className={`${theme.textMuted} text-xs mb-1`}>N° Série</p>
                <p className={`${theme.text} text-sm font-mono`}>{machine.serialNumber || '-'}</p>
              </div>
              <div>
                <p className={`${theme.textMuted} text-xs mb-1`}>Localisation</p>
                <p className={`${theme.text} text-sm`}>{machine.location || '-'}</p>
              </div>
              <div>
                <p className={`${theme.textMuted} text-xs mb-1`}>Heures</p>
                <p className={`${theme.text} text-sm`}>{machine.operatingHours?.toLocaleString()} h</p>
              </div>
            </div>

            <div className={`mt-4 pt-4 border-t ${theme.border}`}>
              <p className={`${theme.textMuted} text-xs mb-1`}>Code QR</p>
              <p className={`${theme.text} text-sm font-mono`}>{machine.qrCode}</p>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={viewMachineDetails} className={`flex-1 ${theme.button} py-2 rounded-lg text-sm`}>
                Voir détails
              </button>
              <button onClick={resetScan} className={`flex-1 ${theme.buttonSecondary} py-2 rounded-lg text-sm`}>
                Scanner autre
              </button>
            </div>
          </div>

          {/* Interventions */}
          <div className="mb-4">
            <h3 className={`text-lg font-medium ${theme.text} mb-3 flex items-center gap-2`}>
              <Clock size={18} />
              Interventions ({interventions.length})
            </h3>
            
            {interventions.length === 0 ? (
              <div className={`${theme.bgCard} border ${theme.border} rounded-xl p-6 text-center`}>
                <p className={`${theme.textMuted} text-sm`}>Aucune intervention pour cette machine</p>
              </div>
            ) : (
              <div className="space-y-3">
                {interventions.map(intervention => (
                  <div key={intervention.id} className={`${theme.bgCard} border ${theme.border} rounded-xl p-4`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className={`text-xs ${theme.textMuted} font-mono`}>#{intervention.id}</span>
                        {intervention.urgent && (
                          <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">URGENT</span>
                        )}
                      </div>
                      <span className={statusBadge(intervention.status)}>{statusLabel(intervention.status)}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div>
                        <p className={`${theme.textMuted} text-xs`}>Planifiée le</p>
                        <p className={`${theme.text} text-sm`}>{fmtDateTime(intervention.plannedAt)}</p>
                      </div>
                      <div>
                        <p className={`${theme.textMuted} text-xs`}>Technicien</p>
                        <p className={`${theme.text} text-sm`}>{intervention.technicianName || 'Non assigné'}</p>
                      </div>
                    </div>

                    {intervention.status === 'PLANIFIEE' && (
                      <button 
                        onClick={() => startIntervention(intervention.id)}
                        className={`w-full mt-3 ${theme.button} py-2 rounded-lg text-sm flex items-center justify-center gap-2`}
                      >
                        <Play size={16} />
                        Démarrer l'intervention
                      </button>
                    )}

                    {(intervention.status === 'EN_COURS' || intervention.status === 'EN_PAUSE') && (
                      <button 
                        onClick={() => completeIntervention(intervention.id)}
                        className={`w-full mt-3 ${theme.button} py-2 rounded-lg text-sm flex items-center justify-center gap-2`}
                      >
                        <CheckCircle size={16} />
                        Terminer + Ajouter photos
                      </button>
                    )}

                    {intervention.status === 'TERMINEE' && intervention.photos && intervention.photos.length > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <ImageIcon size={14} className={theme.textMuted} />
                        <span className={`${theme.textMuted} text-xs`}>{intervention.photos.length} photo(s)</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
