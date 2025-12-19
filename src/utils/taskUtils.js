import { STATUS } from '../constants/status'

export const atualizarStatusEAtraso = (task) => {
  const result = { ...task };

  if (result.status === STATUS.CONCLUIDO) {
    result.dias_atrasado = 0
    if (!result.completed_at) {
      result.completed_at = new Date().toISOString().split('T')[0]
    }
    return result
  }

  result.completed_at = null

  if (!result.limit) {
    result.dias_atrasado = 0
    return result
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const limit = new Date(result.limit)
  limit.setHours(0, 0, 0, 0)

  const diffTime = today - limit
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const diasAtrasado = diffDays > 0 ? diffDays : 0
  let novoStatus
  if (diasAtrasado > 0) {
    novoStatus = STATUS.ATRASADO
  } else {
    novoStatus = result.status === STATUS.ATRASADO ? STATUS.A_FAZER : result.status
  }

  return {
    ...result,
    status: novoStatus,
    dias_atrasado: diasAtrasado
  }
}

export const inicializarTasks = (tasks) => {
  return tasks.map(task => atualizarStatusEAtraso(task))
}
