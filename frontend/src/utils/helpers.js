export const statusBadge = status => {
  const map = {
    PLANIFIEE: 'badge-blue',
    EN_COURS: 'badge-yellow',
    EN_PAUSE: 'badge-gray',
    TERMINEE: 'badge-green',
    VALIDEE: 'badge-purple',
    EN_RETARD: 'badge-red',
    ANNULEE: 'badge-gray',
    EN_SERVICE: 'badge-green',
    EN_MAINTENANCE: 'badge-yellow',
    EN_PANNE: 'badge-red',
    HORS_SERVICE: 'badge-gray',
    EN_ATTENTE: 'badge-yellow'
  }
  return map[status] || 'badge-gray'
}

export const statusLabel = status => {
  const map = {
    PLANIFIEE: 'Planifiée', EN_COURS: 'En cours', EN_PAUSE: 'En pause',
    TERMINEE: 'Terminée', VALIDEE: 'Validée', EN_RETARD: 'En retard', ANNULEE: 'Annulée',
    EN_SERVICE: 'En service', EN_MAINTENANCE: 'En maintenance',
    EN_PANNE: 'En panne', HORS_SERVICE: 'Hors service', EN_ATTENTE: 'En attente',
    ADMIN: 'Administrateur', RESPONSABLE_MAINTENANCE: 'Resp. Maintenance',
    CHEF_EQUIPE: "Chef d'équipe", TECHNICIEN: 'Technicien',
    GRAISSAGE: 'Graissage', NETTOYAGE: 'Nettoyage', INSPECTION: 'Inspection',
    REMPLACEMENT: 'Remplacement', REGLAGE: 'Réglage', MESURE: 'Mesure',
    SERRAGE: 'Serrage', TEST: 'Test', CALIBRATION: 'Calibration', AUTRE: 'Autre',
    QUOTIDIENNE: 'Quotidienne', HEBDOMADAIRE: 'Hebdomadaire', BIMENSUELLE: 'Bimensuelle',
    MENSUELLE: 'Mensuelle', TRIMESTRIELLE: 'Trimestrielle', SEMESTRIELLE: 'Semestrielle',
    ANNUELLE: 'Annuelle', SELON_COMPTEUR: 'Selon compteur',
    NORMAL: 'Normal', USURE_DETECTEE: 'Usure détectée', ANOMALIE_TROUVEE: 'Anomalie trouvée',
    REPARATION_REQUISE: 'Réparation requise'
  }
  return map[status] || status
}

export const fmtDate = d => d ? new Date(d).toLocaleDateString('fr-FR') : '-'
export const fmtDateTime = d => d ? new Date(d).toLocaleString('fr-FR') : '-'

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

export const roleBadge = role => {
  const map = { ADMIN: 'badge-red', RESPONSABLE_MAINTENANCE: 'badge-purple', CHEF_EQUIPE: 'badge-blue', TECHNICIEN: 'badge-green' }
  return map[role] || 'badge-gray'
}
