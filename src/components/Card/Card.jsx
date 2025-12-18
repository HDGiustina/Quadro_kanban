import { STATUS, STATUS_COLORS } from '../../constants/status'
import './Card.css'

function Card({ task, onEdit, onDelete }) {
  const isAtrasado = task.status === STATUS.ATRASADO && task.dias_atrasado > 0

  return (
    <div className="card">
      <section className="card-header">
        <div>
          <h1>{task.title}</h1>
          <p>{task.description}</p>
        </div>

        <span 
          className="card-status"
          style={{ backgroundColor: STATUS_COLORS[task.status] }}
        >
          {task.status}
        </span>
      </section>

      <section className="card-info">
        <div className="infos">
          Responsável: 
          <span>
            {task.responsible.name}
          </span>
        </div>

        <div className="infos">
          Data limite:
          <span >
            {new Date(task.limit).toLocaleDateString('pt-BR')}
          </span>
        </div>

        {isAtrasado && (
          <div className="over">
            Atrasado há 
            <span >
              {' ' + task.dias_atrasado} dia{task.dias_atrasado !== 1 ? 's' : ''}
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
          onClick={() => onDelete(task)}
          className='btn-cancel'
        >
          Deletar
        </button>
      </section>
    </div>
  )
}

export default Card
