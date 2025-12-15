import { createContext, useContext, useState } from 'react';
import { Tasks } from '../data/tasks.js';

const Context = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState(Tasks);

    const addTask = (task) => {
        setTasks(prev => {
            const last = prev.length > 0 ? Math.max(...prev.map(t => Number(t.id))) : 0;

            const newTask = {
                ...task,
                id: (last + 1).toString(),
                created_at: new Date().toISOString().split('T')[0],
                completed_at: null,
            };

            return [...prev, newTask];
        });
    };

    // const updateTask
    // const deleteTask
    // const changeStatus

    return (
        <Context.Provider value={{ tasks, addTask }}>
            {children}
        </Context.Provider>
    );
}

export const useTasks = () => useContext(Context);