import { STATUS, STATUS_COLORS } from '../../constants/status'
import './Card.css'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Card({ task, onEdit, onDelete, hideActions = false, isDragOverlay = false }) {
  const isAtrasado = task.status === STATUS.ATRASADO && task.dias_atrasado > 0
  const { attributes, listeners, setNodeRef, isDragging, transform, transition } = useSortable({
    id: task.id,
    disabled: isDragOverlay
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div 
      ref={setNodeRef}
      {...(!isDragOverlay ? listeners : {})}
      {...(!isDragOverlay ? attributes : {})}
      style={style}
      className={`card ${isDragging && !isDragOverlay ? 'dragging' : ''} ${isDragOverlay ? 'card-overlay' : ''}`}
    >
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

        {task.completed_at && (
          <div className="infos">
            Concluído em:
            <span>
              {new Date(task.completed_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
        )}

        {isAtrasado && (
          <div className="over">
            Atrasado há 
            <span >
              {' ' + task.dias_atrasado} dia{task.dias_atrasado !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </section>

      {!hideActions && (
        <section className="card-actions">
          <button 
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onEdit(task)}
            className='btn-primary'
          >
            Editar
          </button>
          <button 
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onDelete(task)}
            className='btn-cancel'
          >
            Deletar
          </button>
        </section>
      )}
    </div>
  )
}

export default Card
