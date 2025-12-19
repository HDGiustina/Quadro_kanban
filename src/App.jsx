import { useState } from 'react'
import './App.css'
import { useTasks } from './context/context.jsx';
import { STATUS } from './constants/status'
import Column from './components/Column/Column.jsx';
import Card from './components/Card/Card.jsx'
import ModalCriar from './components/Modais/Criar.jsx'
import ModalEditar from './components/Modais/Editar.jsx'
import ModalDeletar from './components/Modais/Deletar.jsx'
import Snackbar from './components/Snackbar/Snackbar.jsx'
import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core'

function App() {
  const { tasks, deleteTask, updateTask, validateStatusChange, reorderTasksByArray, moveTaskToStatusAt, getTasksView } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [responsibleFilter, setResponsibleFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('none') 

  const colunas = [
    STATUS.A_FAZER,
    STATUS.EM_PROGRESSO,
    STATUS.ATRASADO,
    STATUS.CONCLUIDO
  ]

  const visibleColumns = statusFilter === 'All' ? colunas : [statusFilter]

  const responsibles = Array.from(new Set(tasks.map(taskItem => taskItem.responsible?.name).filter(Boolean)))

  const handleEdit = (task) => {
    setTaskToEdit(task)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (task) => {
    setTaskToDelete(task)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = (taskId) => {
    deleteTask(taskId)
  }

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const taskId = active.id
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    if (colunas.includes(over.id)) {
      const newStatus = over.id
      
      if (newStatus !== task.status) {
        const validation = validateStatusChange(task, newStatus)
        
        if (!validation.isValid) {
          setSnackbarMessage(validation.message)
          setSnackbarOpen(true)
          return
        }

        updateTask(taskId, { status: newStatus })
      }
    } else {
      const overTask = tasks.find(t => t.id === over.id)
      
      if (overTask) {
        if (task.status === overTask.status) {
          const tasksInStatus = tasks.filter(t => t.status === task.status).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          const fromIndex = tasksInStatus.findIndex(t => t.id === taskId)
          const toIndex = tasksInStatus.findIndex(t => t.id === over.id)
          
          if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
            const newArray = [...tasksInStatus]
            const [moved] = newArray.splice(fromIndex, 1)
            newArray.splice(toIndex, 0, moved)
            
            const reorderedIds = newArray.map(t => t.id)
            reorderTasksByArray(reorderedIds, task.status)
            // user manually reordered -> clear sort preference
            setSortOrder('none')
          }
        } 
        else {
          const validation = validateStatusChange(task, overTask.status)
          
          if (!validation.isValid) {
            setSnackbarMessage(validation.message)
            setSnackbarOpen(true)
            return
          }

          const tasksInTarget = tasks.filter(t => t.status === overTask.status).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          const insertIndex = tasksInTarget.findIndex(t => t.id === overTask.id)

          moveTaskToStatusAt(taskId, overTask.status, insertIndex)
          // user moved and placed explicitly -> clear sort preference
          setSortOrder('none')
        }
      }
    }
  }

  const activeDraggedTask = activeId ? tasks.find(t => t.id === activeId) : null

  return (
    <>
      <DndContext 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={pointerWithin}
        autoScroll={false}
      >
        <main className="app">
          <section className='app-header'>
            <h1>Kanban</h1>
            <button 
              className='btn-white add-task'
              onClick={() => setIsModalOpen(true)}
            >
              Adicionar tarefa
            </button>
          </section>

          <section className="filters-bar">
            <div className="filter-item">
              <label>Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">Todos</option>
                {colunas.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <label>Responsável</label>
              <select value={responsibleFilter} onChange={(e) => setResponsibleFilter(e.target.value)}>
                <option value="All">Todos</option>
                {responsibles.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="filter-item" style={{minWidth: 260}}>
              <label>Busca (Título / Descrição)</label>
              <input placeholder="Buscar..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>

            <div className="filter-item">
              <label>Ordenar por data de criação</label>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="none">Sem ordenação</option>
                <option value="asc">Mais antigas primeiro</option>
                <option value="desc">Mais novas primeiro</option>
              </select>
            </div>

            <div className="spacer" />
          </section>

          <section className='app-content'>
          {visibleColumns.map((coluna) => (
            <Column 
              key={coluna} 
              title={coluna} 
              tasks={getTasksView({ status: coluna, responsible: responsibleFilter, query, sortOrder })}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              columnId={coluna}
            />
          ))}
          </section>
        </main>

        <DragOverlay>
          {activeDraggedTask ? (
            <Card 
              task={activeDraggedTask}
              hideActions={true}
              isDragOverlay={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
      
      <ModalCriar 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />

      <ModalEditar 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={taskToEdit}
      />

      <ModalDeletar 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        task={taskToDelete}
      />

      <Snackbar 
        isOpen={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        type="error"
      />
    </>
  )
}

export default App
