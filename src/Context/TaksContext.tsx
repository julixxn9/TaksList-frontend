import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
// import { saveTask } from '../taksManager.ts'
import type { TaksType } from '../types.ts';


interface TaksContextType {
    taks: TaksType[];
    addTaks: (taks: Omit<TaksType, '_id' | 'completada'>) => Promise<void>;
    checkTaks: (_id: string) => Promise<void>;
    deteleTaks: (_id: string) => Promise<void>;
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
            const response = await fetch(import.meta.env.VITE_API+'/task');
            const loadedTasks = await response.json() as TaksType[];
            setTaks(loadedTasks);
        } catch (error) {
            console.error("Error al cargar tareas:", error);
        }
    }

    // Agregar una nueva tarea (fetch POST)
    const addTaks: TaksContextType['addTaks'] = async (taks) => {
        try {
            const response = await fetch(import.meta.env.VITE_API+'/task', {
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
    const checkTaks: TaksContextType['checkTaks'] = async (_id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API}/task/${_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const checkedTaks = await response.json() as Pick<TaksType, '_id' | 'completada'>; // aqui lo que hacemos es obtener solo el _id y completada de la tarea 
            const updatedTaks = [...tasks]; // Crear una copia del arreglo de tareas
            const index = updatedTaks.findIndex(t => t._id == checkedTaks._id); // esto aca es para encontrar la tarea que se esta actualizando
            if (index == -1) {
                throw new Error("Error al actualizar la tarea");
            }
            updatedTaks[index].completada = checkedTaks.completada; // Actualizar el estado de completada desde el backend
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
    const deteleTaks: TaksContextType['deteleTaks'] = async (_id) => {
        try {
            const response = await fetch( `${import.meta.env.VITE_API}/task/${_id}`, {
                method: 'DELETE',
            });

            const taskEliminada = await response.json() as Pick<TaksType, '_id'>; // Pick<TaksType, '_id'> es porque solo necesitamos el _id entonces prevenimos que nos de todo el objeto
            // const deletedTask = await response.json() as TaksType;
            // Filtrar tarea eliminada del estado
            const updated = tasks.filter(task => task._id !== taskEliminada._id);
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
