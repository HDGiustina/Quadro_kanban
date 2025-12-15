import './App.css'
import { useTasks } from './context/context.jsx';

function App() {
  const { tasks } = useTasks();

  return (
    <>
      <div>
        {tasks.map(task => (
          <div key={task.id}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
