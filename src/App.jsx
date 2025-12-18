import { useState } from 'react'
import './App.css'
import { useTasks } from './context/context.jsx';
import { STATUS } from './constants/status'
import Column from './components/Column/Column.jsx';
import ModalCriar from './components/Modais/Criar.jsx'
import ModalEditar from './components/Modais/Editar.jsx'

function App() {
  const { tasks } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)

  const colunas = [
    STATUS.A_FAZER,
    STATUS.EM_PROGRESSO,
    STATUS.ATRASADO,
    STATUS.CONCLUIDO
  ]

  const edit = (task) => {
    setTaskToEdit(task)
    setIsEditModalOpen(true)
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
            onEdit={edit}
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
    </>
  )
}

export default App
