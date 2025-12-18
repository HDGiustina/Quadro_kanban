import { useState } from 'react'
import './App.css'
import { useTasks } from './context/context.jsx';
import { STATUS } from './constants/status'
import Column from './components/Column/Column.jsx';
import ModalCriar from './components/Modais/Criar.jsx'
import ModalEditar from './components/Modais/Editar.jsx'
import ModalDeletar from './components/Modais/Deletar.jsx'

function App() {
  const { tasks, deleteTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)

  const colunas = [
    STATUS.A_FAZER,
    STATUS.EM_PROGRESSO,
    STATUS.ATRASADO,
    STATUS.CONCLUIDO
  ]

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

  return (
    <>
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

        <section className='app-content'>
        {colunas.map((coluna) => (
          <Column 
            key={coluna} 
            title={coluna} 
            tasks={tasks.filter(task => task.status === coluna)}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        ))}
        </section>
      </main>
      
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
    </>
  )
}

export default App
