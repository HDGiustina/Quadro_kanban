import './Dashboard.css'
import { useTasks } from '../../context/context'

function Dashboard() {
    const { getCountsByStatus, getCompletionPercent, getAverageTimeToCompletion } = useTasks()

    const counts = getCountsByStatus()
    const completedToday = getCompletionPercent('day')
    const completedWeek = getCompletionPercent('week')
    const avgDays = getAverageTimeToCompletion()

    return (
        <section className="dashboard">
            <h2>Dashboard</h2>

            <div className="cards">
                <div className="card">
                    <h3>Tarefas por status</h3>
                    <ul>
                        {Object.keys(counts).map(status => (
                            <li key={status}>
                                <strong>{status}:</strong> {counts[status]}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="card">
                    <h3>% Concluídas</h3>
                    <p>Hoje: {completedToday}%</p>
                    <p>Últimos 7 dias: {completedWeek}%</p>
                </div>

                <div className="card">
                    <h3>Tempo médio até conclusão</h3>
                    <p>{avgDays != null ? `${avgDays} dia(s)` : '—'}</p>
                </div>
            </div>
        </section>
    )
}

export default Dashboard
