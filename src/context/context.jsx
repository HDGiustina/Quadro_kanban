import { createContext, useContext, useState } from 'react';
import { Tasks } from '../data/tasks.js';
import { inicializarTasks, atualizarStatusEAtraso } from '../utils/taskUtils.js';
import { STATUS } from '../constants/status.js';

const Context = createContext();

export function TaskProvider({ children }) {
    const [tasks, setTasks] = useState(() => inicializarTasks(Tasks));

    const DEFAULT_WIP_LIMITS = {
        [STATUS.EM_PROGRESSO]: 2
    };

    const getWipLimit = (status) => DEFAULT_WIP_LIMITS[status] ?? null;

    const getCountForStatus = (status) => tasks.filter(t => t.status === status).length;

    const canAddToStatus = (status, excludeTaskId = null) => {
        const limit = getWipLimit(status);

        if (limit == null) {
            return { isValid: true }
        };

        const count = tasks.filter(t => t.status === status && t.id !== excludeTaskId).length;

        if (count >= limit) {
            return { isValid: false, message: `Limite de tarefas atingido para '${status}' (${count}/${limit})` };
        }

        return { isValid: true };
    };

    const validateStatusChange = (task, newStatus) => {
        if (task.status === newStatus) {
            return { isValid: true };
        }

        if (newStatus === STATUS.ATRASADO && task.status !== STATUS.ATRASADO) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const limitDate = new Date(task.limit);

            if (limitDate >= today) {
                return { 
                    isValid: false, 
                    message: 'A tarefa ainda não está atrasada.' 
                };
            }
        }

        if (task.status === STATUS.ATRASADO && newStatus !== STATUS.CONCLUIDO) {
            return { 
                isValid: false, 
                message: 'Tarefa ainda está atrasada. Conclua a tarefa para alterar o status.' 
            };
        }

        const limit = getWipLimit(newStatus);
        if (limit != null) {
            const countInTarget = tasks.filter(t => t.status === newStatus).length;
            if (countInTarget >= limit) {
                return { isValid: false, message: `Limite de tarefas atingido para '${newStatus}' (${countInTarget}/${limit})` };
            }
        }

        return { isValid: true };
    };

    const addTask = (task) => {
        const check = canAddToStatus(task.status);
        if (!check.isValid) {
            return { success: false, message: check.message };
        }

        setTasks(prev => {
            const last = prev.length > 0 ? Math.max(...prev.map(t => Number(t.id))) : 0;
            
            const taskCount = prev.filter(t => t.status === task.status).length;

            const newTask = atualizarStatusEAtraso({
                ...task,
                id: (last + 1).toString(),
                created_at: new Date().toISOString().split('T')[0],
                completed_at: null,
                dias_atrasado: 0,
                order: taskCount
            });

            return [...prev, newTask];
        });

        return { success: true };
    };

    const updateTask = (id, update) => {
        setTasks(prev => {
            return prev.map(task => {
                if (task.id === id) {
                    const updatedTask = {
                        ...task,
                        ...update,
                    };
                    
                    if (update.status && update.status !== task.status) {
                        const newStatusTasks = prev.filter(t => t.status === update.status);
                        updatedTask.order = newStatusTasks.length;
                    }
                    
                    return atualizarStatusEAtraso(updatedTask);
                }
                return task;
            });
        });
    };

    const deleteTask = (id) => {
        setTasks(prev => prev.filter(task => task.id !== id));
    };

    const changeStatus = (id, newStatus) => {
        setTasks(prev =>
            prev.map(task =>
                task.id === id
                    ? atualizarStatusEAtraso({
                        ...task,
                        status: newStatus
                    })
                    : task
            )
        );
    };

    const reorderTasks = (fromIndex, toIndex, status) => {
        setTasks(prev => {
            const tasksInStatus = prev.filter(t => t.status === status).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            const [movedTask] = tasksInStatus.splice(fromIndex, 1);
            tasksInStatus.splice(toIndex, 0, movedTask);

            const updatedTasksInStatus = tasksInStatus.map((task, index) => ({
                ...task,
                order: index
            }));

            return prev.map(task => {
                const updated = updatedTasksInStatus.find(t => t.id === task.id);
                return updated || task;
            });
        });
    };

    const reorderTasksByArray = (orderedTasksIds, status) => {
        setTasks(prev => {
            const updatedTasks = orderedTasksIds.map((id, index) => {
                const task = prev.find(t => t.id === id);
                return task ? { ...task, order: index } : null;
            }).filter(Boolean);

            return prev.map(task => {
                const updated = updatedTasks.find(t => t.id === task.id);
                return updated || task;
            });
        });
    };

    const moveTaskToStatusAt = (id, targetStatus, toIndex) => {
        setTasks(prev => {
            const targetTasks = prev
                .filter(t => t.status === targetStatus && t.id !== id)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

            const newTarget = [...targetTasks];
            const movedTask = prev.find(t => t.id === id);
            if (!movedTask) return prev;

            const adjustedTo = Math.max(0, Math.min(toIndex, newTarget.length));
            newTarget.splice(adjustedTo, 0, { ...movedTask, status: targetStatus });

            const updatedTargetTasks = newTarget.map((t, idx) => ({ ...t, order: idx, status: targetStatus }));

            return prev.map(task => {
                const updated = updatedTargetTasks.find(t => t.id === task.id);
                if (updated) {
                    return atualizarStatusEAtraso(updated);
                }

                if (task.id === id && !updated) {
                    return atualizarStatusEAtraso({ ...task, status: targetStatus, order: adjustedTo });
                }

                return task;
            });
        });
    };

    return (
        <Context.Provider value={{ tasks, addTask, updateTask, deleteTask, changeStatus, validateStatusChange, reorderTasks, reorderTasksByArray, moveTaskToStatusAt, getWipLimit, getCountForStatus, canAddToStatus }}>
            {children}
        </Context.Provider>
    );
}

export const useTasks = () => useContext(Context);