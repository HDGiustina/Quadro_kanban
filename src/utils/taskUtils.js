import { STATUS } from '../constants/status'

export const atualizarStatusEAtraso = (task) => {
  if (!task.limit || task.status === STATUS.CONCLUIDO) {
    return {
      ...task,
      dias_atrasado: 0
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const limit = new Date(task.limit)
  limit.setHours(0, 0, 0, 0)

  const diffTime = today - limit
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const diasAtrasado = diffDays > 0 ? diffDays : 0
  const novoStatus = diasAtrasado > 0 ? STATUS.ATRASADO : task.status

  return {
    ...task,
    status: novoStatus,
    dias_atrasado: diasAtrasado
  }
}

export const inicializarTasks = (tasks) => {
  return tasks.map(task => atualizarStatusEAtraso(task))
}
