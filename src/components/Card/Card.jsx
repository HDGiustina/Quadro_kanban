import './Card.css'

function Card({ task, onEdit, onDelete }) {
  const calcularAtraso = () => {
    if (!task.limit) return 0
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const limit = new Date(task.limit)
    limit.setHours(0, 0, 0, 0)
    
    const diffTime = today - limit
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays > 0 ? diffDays : 0
  }

  const getStatusColor = (status) => {
    const statusColors = {
      'A Fazer': 'var(--color-success)',
      'Em progresso': 'var(--color-warning)',
      'Concluído': 'var(--color-danger)'
    }

    return statusColors[status]
  }


  const atraso = calcularAtraso()
  const over = atraso > 0 && task.status !== 'Concluído'

  return (
    <div className="card">
      <section className="card-header">
        <div>
          <h1>{task.title}</h1>
          <p>{task.description}</p>
        </div>

        <span 
          className="card-status"
          style={{ backgroundColor: getStatusColor(task.status) }}
        >
          {task.status}
        </span>
      </section>


      <section className="card-info">
        <div className="infos">
          Responsável: 
          <span >
            {task.responsible.name}
          </span>
        </div>

        <div className="infos">
          Data limite:
          <span >
            {new Date(task.limit).toLocaleDateString('pt-BR')}
          </span>
        </div>

        {over && (
          <div className="over">
            Atrasado há 
            <span >
              {' ' + atraso} dia{atraso !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </section>

      <section className="card-actions">
        <button 
          onClick={() => onEdit(task)}
          className='btn-primary'
        >
          Editar
        </button>
        <button 
          onClick={() => onDelete(task.id)}
          className='btn-cancel'
        >
          Deletar
        </button>
      </section>
    </div>
  )
}

export default Card
