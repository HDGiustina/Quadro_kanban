import './App.css'
import { useTasks } from './context/context.jsx';
import Card from './components/Card/Card.jsx';

function App() {
  const { tasks } = useTasks();

  return (
    <>
      <main className="app">
        {tasks.map(task => (
           <Card key={task.id} task={task} />
        ))}
      </main>     
    </>
  )
}

export default App
