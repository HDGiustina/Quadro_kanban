import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TaskProvider } from './context/context.jsx';

createRoot(document.getElementById('root')).render(
  <TaskProvider>
    <App />
  </TaskProvider>
)
