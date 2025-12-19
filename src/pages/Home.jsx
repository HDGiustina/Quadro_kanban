import { useState } from 'react'
import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core'
import Column from '../components/Column/Column'
import Card from '../components/Card/Card'
import { STATUS } from '../constants/status'
import { useTasks } from '../context/context'
import './home.css'

function Home({ onEditRequested, onDeleteRequested, openCreateModal, setSnackbarMessage, setSnackbarOpen }) {
    const { tasks, validateStatusChange, reorderTasksByArray, moveTaskToStatusAt, getTasksView } = useTasks()

    const [activeId, setActiveId] = useState(null)
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

                moveTaskToStatusAt(taskId, newStatus, Number.MAX_SAFE_INTEGER)
                setSortOrder('none')
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
                        setSortOrder('none')
                    }
                } else {
                    const validation = validateStatusChange(task, overTask.status)
                    if (!validation.isValid) {
                        setSnackbarMessage(validation.message)
                        setSnackbarOpen(true)
                        return
                    }

                    const tasksInTarget = tasks.filter(t => t.status === overTask.status).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    const insertIndex = tasksInTarget.findIndex(t => t.id === overTask.id)
                    moveTaskToStatusAt(taskId, overTask.status, insertIndex)
                    setSortOrder('none')
                }
            }
        }
    }

    const activeDraggedTask = activeId ? tasks.find(t => t.id === activeId) : null

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={pointerWithin} autoScroll={false}>
            <div className="kanban-container">
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

                    <div className="filter-item" style={{ minWidth: 260 }}>
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
                    <button type="button" className="btn-white add-task" onClick={() => openCreateModal()}>
                        Adicionar tarefa
                    </button>
                </section>

                <section className="columns">
                    {visibleColumns.map((coluna) => (
                        <Column key={coluna} title={coluna} tasks={getTasksView({ status: coluna, responsible: responsibleFilter, query, sortOrder })} onEdit={onEditRequested} onDelete={onDeleteRequested} columnId={coluna} />
                    ))}
                </section>

                <DragOverlay>
                    {activeDraggedTask ? (
                        <Card task={activeDraggedTask} hideActions={true} isDragOverlay={true} />
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    )
}

export default Home
