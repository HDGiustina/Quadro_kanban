import './App.css'
import { useTasks } from './context/context.jsx';
import { STATUS } from './constants/status'
import Column from './components/Column/Column.jsx';

function App() {
  const { tasks } = useTasks();

  const colunas = [
    STATUS.A_FAZER,
    STATUS.EM_PROGRESSO,
    STATUS.ATRASADO,
    STATUS.CONCLUIDO
  ]

  return (
    <>
      <main className="app">
        {colunas.map((coluna) => (
          <Column 
            key={coluna} 
            title={coluna} 
            tasks={tasks.filter(task => task.status === coluna)} 
          />
        ))}
      </main>     
    </>
  )
}

export default App
