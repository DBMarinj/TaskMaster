import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskColumn from './TaskColumn';
import TaskFilters from './TaskFilters';
import Menu from "./Menu"; // Importa el componente Menu

const KanbanBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [filter, setFilter] = useState({
        pendiente: '',
        enProgreso: '',
        completado: ''
    });

    // Función para obtener las tareas desde el servidor
    const fetchTasks = async () => {
        const token = localStorage.getItem('access_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            const response = await axios.get('http://127.0.0.1:8000/tareas/tareas/', config);
            console.log("Tareas obtenidas desde la API:", response.data); // Verificar los datos de la API
            setTasks(response.data);
            setFilteredTasks(response.data); // Inicialmente mostrar todas las tareas
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks(); // Llamar a la función para obtener las tareas desde el servidor
    }, []);

    // Función para aplicar los filtros de forma independiente por estado
    const applyFilter = (estado, criteria) => {
        setFilter(prevFilter => ({
            ...prevFilter,
            [estado]: criteria
        }));

        let filteredStateTasks = tasks.filter(task => task.estado === getStatusCode(estado));
        if (criteria === 'priority') {
            filteredStateTasks = filteredStateTasks.sort((a, b) => a.prioridad - b.prioridad);
        } else if (criteria === 'due_date') {
            filteredStateTasks = filteredStateTasks.sort((a, b) => new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento));
        }

        // Se actualizan las tareas filtradas por estado sin afectar a otras columnas
        setFilteredTasks(prevFilteredTasks => ({
            ...prevFilteredTasks,
            [estado]: filteredStateTasks
        }));

        console.log(`Tareas filtradas para estado ${estado}:`, filteredStateTasks); // Verificar las tareas filtradas
    };

    // Función auxiliar para obtener el código de estado (7: Pendiente, 8: En Progreso, 9: Completado)
    const getStatusCode = (estado) => {
        switch (estado) {
            case 'pendiente': return 7;
            case 'enProgreso': return 8;
            case 'completado': return 9;
            default: return null;
        }
    };

    // Esta función también se encargará de actualizar el estado de las tareas.
    const updateTaskStatus = async (taskId, newStatus) => {
        const token = localStorage.getItem('access_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            const updatedTask = tasks.find(task => task.id_tarea === taskId);
            console.log("Tarea antes de actualizar el estado:", updatedTask); // Verificar la tarea seleccionada
            updatedTask.estado = newStatus;

            await axios.put(`http://127.0.0.1:8000/tareas/tareas/${taskId}/`, updatedTask, config);
            setTasks(tasks.map(task => task.id_tarea === taskId ? updatedTask : task));

            // Aplicar filtro de nuevo tras la actualización del estado
            applyFilter('pendiente', filter.pendiente);
            applyFilter('enProgreso', filter.enProgreso);
            applyFilter('completado', filter.completado);
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    return (
        <div className="bg-white text-black min-vh-100">
            <Menu /> {/* usa el componente Menu aqui */}
            <div className="container">
                <div className="card mt-4 bg-light"> {/* Añadida clase de fondo bg-light para un gris claro */}
                    <div className="card-body">
                        <h1 className="card-title my-4 text-center">TABLERO DE TAREAS (KANBAN)</h1>

                        {/* Componente para aplicar filtros */}
                        <TaskFilters applyFilter={applyFilter} />

                        <div className="row">
                            {/* Columna para tareas pendientes */}
                            <TaskColumn 
                                title="Pendiente" 
                                tasks={filteredTasks['pendiente'] || tasks.filter(task => task.estado === 7)} 
                                onMoveForward={(taskId) => updateTaskStatus(taskId, 8)} 
                                onApplyFilter={(criteria) => applyFilter('pendiente', criteria)}
                            />
                            
                            {/* Columna para tareas en progreso */}
                            <TaskColumn 
                                title="En Progreso" 
                                tasks={filteredTasks['enProgreso'] || tasks.filter(task => task.estado === 8)} 
                                onMoveForward={(taskId) => updateTaskStatus(taskId, 9)} 
                                onMoveBackward={(taskId) => updateTaskStatus(taskId, 7)} 
                                onApplyFilter={(criteria) => applyFilter('enProgreso', criteria)}
                            />
                            
                            {/* Columna para tareas completadas */}
                            <TaskColumn 
                                title="Completado" 
                                tasks={filteredTasks['completado'] || tasks.filter(task => task.estado === 9)} 
                                onMoveBackward={(taskId) => updateTaskStatus(taskId, 8)} 
                                onApplyFilter={(criteria) => applyFilter('completado', criteria)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KanbanBoard;
