import Card from '../Card/Card'
import './Column.css'
import { useTasks } from '../../context/context'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

function Column({ title, tasks, onEdit, onDelete, columnId }) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId
  })

  const { getWipLimit } = useTasks()

  const limit = getWipLimit(title)
  const count = tasks.length

  return (
    <section className={`column ${limit != null && count > limit ? 'over-limit' : ''}`} ref={setNodeRef} style={{
      backgroundColor: isOver ? 'rgba(245, 148, 139, 0.1)' : 'transparent'
    }}>
      <div className="column-header">
        <h1>{title}</h1>
        {limit != null && (
          <div className={`wip-indicator ${count > limit ? 'over' : ''}`}>
            {count}/{limit}
          </div>
        )}
      </div>

      <div className="column-content">
        {tasks.length > 0 ? (
          <SortableContext items={tasks.map(taskItem => taskItem.id)} strategy={verticalListSortingStrategy}>
            {tasks.map(taskItem => (
              <Card 
                key={taskItem.id} 
                task={taskItem}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </SortableContext>
        ) : (
          <div className="column-empty">
            Sem tarefas
          </div>
        )}
      </div>
    </section>
  )
}

export default Column
