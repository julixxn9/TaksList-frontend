import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
// import { saveTask } from '../taksManager.ts'
import type { TaksType } from '../types.ts';

interface TaksContextType {
    taks: TaksType[];
    addTaks: (taks: Omit<TaksType, 'id' | 'completada' | 'borrada'>) => Promise<void>;
    checkTaks: (id: number) => Promise<void>;
    deteleTaks: (id: number) => Promise<void>;
}

const TaksContext = createContext<TaksContextType | undefined>(undefined);

function TaksContextProvider({ children }: { children: ReactNode }) {

    const [tasks, setTaks] = useState<TaksType[]>([]); // Estado local con las tareas

    // Obtener tareas del backend al montar
    useEffect(() => {
        fetchTaks();
    }, []);

    // Reutilizable: Carga todas las tareas desde el backend
    async function fetchTaks() {
        try {
            const response = await fetch('http://localhost:3000/task');
            const loadedTasks = await response.json() as TaksType[];
            setTaks(loadedTasks);
        } catch (error) {
            console.error("Error al cargar tareas:", error);
        }
    }

    // Agregar una nueva tarea (fetch POST)
    const addTaks: TaksContextType['addTaks'] = async (taks) => {
        try {
            const response = await fetch('http://localhost:3000/task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taks)
            });
            const newTask = await response.json() as TaksType;

            const update = [...tasks, newTask]; // Crear una copia del arreglo de tareas
            setTaks(update);
        } catch (error) {
            console.error(error);
            alert('Error al agregar tarea');
        }

        // Código viejo con saveTask() guardado como referencia:
        /*
        const newTask = {
            id: taks.length > 0 ? taks[taks.length - 1].id + 1 : 0,
            titulo,
            descripcion,
            completada: false,
            borrada: false
        };
        const actualizarTaks = [...taks, newTask];
        setTaks(actualizarTaks);
        await saveTask(actualizarTaks)
        */
    };

    // Cambiar estado de completada (fetch PATCH)
    const checkTaks: TaksContextType['checkTaks'] = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/task/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const checkedTaks = await response.json() as TaksType;
            const updatedTaks = tasks.map(t => t.id === checkedTaks.id ? checkedTaks : t);
            setTaks(updatedTaks);
        } catch (error) {
            console.error(error);
            alert('Error al checkear la tarea');
        }

        // Código viejo con cambios locales:
        /*
        const existTaks = tasks.findIndex((taks) => taks.id === id);
        if (existTaks === -1) return alert('Error al marcar la tarea como completada');
        const newTaks = [...tasks];
        newTaks[existTaks].completada = !newTaks[existTaks].completada;
        setTaks(newTaks);
        await saveTask(newTaks);
        */
    };

    // Eliminar tarea (DELETE real)
    const deteleTaks: TaksContextType['deteleTaks'] = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/task/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error("No se pudo eliminar la tarea");

            // const deletedTask = await response.json() as TaksType;
            // Filtrar tarea eliminada del estado
            const updated = tasks.filter(task => task.id !== id);
            setTaks(updated);
        } catch (error) {
            console.error("Error al eliminar tarea:", error);
            alert("Error al eliminar tarea");
        }

        // Código viejo con borrada=true:
        /*
        const existTaks = tasks.findIndex((taks) => taks.id === id);
        if (existTaks == -1) return alert('Error al marcar la tarea como completada');
        const newTaks = [...tasks];
        newTaks[existTaks].borrada = true;
        setTaks(newTaks);
        await saveTask(newTaks);
        */
    };

    return (
        <TaksContext.Provider value={{ taks: tasks, addTaks, checkTaks, deteleTaks }}>
            {children}
        </TaksContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTaks() {
    const contexto = useContext(TaksContext);
    if (!contexto) {
        throw new Error('no puedes usar useTaks fuera de TaksContext');
    }
    return contexto;
}

export default TaksContextProvider;
