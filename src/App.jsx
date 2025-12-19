import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import { useTasks } from './context/context.jsx'
import Home from './pages/Home'
import DashboardPage from './pages/Dashboard'
import ModalCriar from './components/Modais/Criar.jsx'
import ModalEditar from './components/Modais/Editar.jsx'
import ModalDeletar from './components/Modais/Deletar.jsx'
import Snackbar from './components/Snackbar/Snackbar.jsx'

function App() {
  const { deleteTask } = useTasks()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

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
    setIsDeleteModalOpen(false)
  }

  return (
    <>
      <BrowserRouter>
        <main className="app">
          <section className='app-header'>
            <h1>Kanban</h1>
            <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
              <Link className="btn-white" to="/dashboard">Dashboard</Link>
              <Link className="btn-white" to="/home">Quadro</Link>
            </div>
          </section>

          <Routes>
            <Route 
              path="/" 
              element={<Navigate to="/home" replace />} 
            />
            <Route 
              path="/home" 
              element={
                <Home 
                  onEditRequested={handleEdit} 
                  onDeleteRequested={handleDeleteClick} 
                  openCreateModal={() => setIsModalOpen(true)} 
                  setSnackbarMessage={setSnackbarMessage} 
                  setSnackbarOpen={setSnackbarOpen} />
              } 
            />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
      </BrowserRouter>

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
