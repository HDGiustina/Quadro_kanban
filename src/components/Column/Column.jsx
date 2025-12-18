import Card from '../Card/Card'
import './Column.css'

function Column({ title, tasks, onEdit, onDelete }) {

  return (
    <section className="column">
      <div className="column-header">
        <h1>{title}</h1>
      </div>

      <div className="column-content">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <Card 
              key={task.id} 
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
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
