import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskColumn from './TaskColumn';
import TaskFilters from './TaskFilters';
import Menu from './Menu'; // Importa el componente Menu

const KanbanBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [filter, setFilter] = useState({
        pendiente: '',
        enProgreso: '',
        completado: ''
    });
    const [userInfo, setUserInfo] = useState(null); // Estado para la información del usuario

    const token = localStorage.getItem('access_token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // Función para obtener las tareas desde el servidor
    const fetchTasks = async () => {
        try {
            const response = await axios.get(
                'http://127.0.0.1:8000/tareas/tareas/',
                config
            );
            console.log('Tareas obtenidas desde la API:', response.data); // Verificar los datos de la API
            setTasks(response.data);
            setFilteredTasks(response.data); // Inicialmente mostrar todas las tareas
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Función para obtener la información del usuario desde el backend
    const fetchUserInfo = async () => {
        try {
            const response = await axios.get(
                'http://127.0.0.1:8000/current-user/', // Ajusta la ruta según la API
                config
            );
            setUserInfo(response.data); // Actualiza el estado con la información del usuario
            console.log('User info fetched successfully:', response.data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    useEffect(() => {
        fetchTasks(); // Llamada para obtener las tareas al cargar el componente
        fetchUserInfo(); // Llamada para obtener la información del usuario
    }, []);

    // Función para aplicar filtros por estado
    const applyFilter = (estado, criteria) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            [estado]: criteria
        }));

        let filteredStateTasks = tasks.filter(
            (task) => task.estado === getStatusCode(estado)
        );

        if (criteria === 'priority') {
            filteredStateTasks.sort((a, b) => a.prioridad - b.prioridad);
        } else if (criteria === 'due_date') {
            filteredStateTasks.sort(
                (a, b) =>
                    new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento)
            );
        }

        setFilteredTasks((prevFilteredTasks) => ({
            ...prevFilteredTasks,
            [estado]: filteredStateTasks
        }));

        console.log(`Tareas filtradas para estado ${estado}:`, filteredStateTasks);
    };

    // Función auxiliar para obtener el código de estado
    const getStatusCode = (estado) => {
        switch (estado) {
            case 'pendiente':
                return 7;
            case 'enProgreso':
                return 8;
            case 'completado':
                return 9;
            default:
                return null;
        }
    };

    // Función para actualizar el estado de una tarea
    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            const updatedTask = tasks.find(
                (task) => task.id_tarea === taskId
            );
            console.log('Tarea antes de actualizar el estado:', updatedTask);
            updatedTask.estado = newStatus;

            await axios.put(
                `http://127.0.0.1:8000/tareas/tareas/${taskId}/`,
                updatedTask,
                config
            );
            setTasks(
                tasks.map((task) =>
                    task.id_tarea === taskId ? updatedTask : task
                )
            );

            // Aplicar los filtros después de la actualización del estado
            applyFilter('pendiente', filter.pendiente);
            applyFilter('enProgreso', filter.enProgreso);
            applyFilter('completado', filter.completado);
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    return (
        <div className="bg-white text-black min-vh-100">
            <Menu userInfo={userInfo} /> {/* Pasa la información del usuario al componente Menu */}
            <div className="container">
                <div className="card mt-4 bg-light">
                    <div className="card-body">
                        <h1 className="card-title my-4 text-center">
                            TABLERO DE TAREAS (KANBAN)
                        </h1>
                        
                        {/* Filtros */}
                        <TaskFilters applyFilter={applyFilter} />

                        <div className="row">
                            {/* Columna de tareas pendientes */}
                            <TaskColumn
                                title="Pendiente"
                                tasks={
                                    filteredTasks['pendiente'] ||
                                    tasks.filter((task) => task.estado === 7)
                                }
                                onMoveForward={(taskId) =>
                                    updateTaskStatus(taskId, 8)
                                }
                                onApplyFilter={(criteria) =>
                                    applyFilter('pendiente', criteria)
                                }
                            />

                            {/* Columna de tareas en progreso */}
                            <TaskColumn
                                title="En Progreso"
                                tasks={
                                    filteredTasks['enProgreso'] ||
                                    tasks.filter((task) => task.estado === 8)
                                }
                                onMoveForward={(taskId) =>
                                    updateTaskStatus(taskId, 9)
                                }
                                onMoveBackward={(taskId) =>
                                    updateTaskStatus(taskId, 7)
                                }
                                onApplyFilter={(criteria) =>
                                    applyFilter('enProgreso', criteria)
                                }
                            />

                            {/* Columna de tareas completadas */}
                            <TaskColumn
                                title="Completado"
                                tasks={
                                    filteredTasks['completado'] ||
                                    tasks.filter((task) => task.estado === 9)
                                }
                                onMoveBackward={(taskId) =>
                                    updateTaskStatus(taskId, 8)
                                }
                                onApplyFilter={(criteria) =>
                                    applyFilter('completado', criteria)
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;
