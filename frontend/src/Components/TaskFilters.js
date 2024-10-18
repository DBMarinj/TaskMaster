import React from 'react';

const TaskFilters = ({ applyFilter }) => {
    const handleFilterChange = (e, estado) => {
        const selectedFilter = e.target.value;
        console.log(`Filtro seleccionado para ${estado}:`, selectedFilter); // Verificar el filtro seleccionado
        applyFilter(estado, selectedFilter);
    };

    return (
        <div className="mb-4">
            <label htmlFor="filterPendiente" className="form-label">Filtrar tareas pendientes por:</label>
            <select id="filterPendiente" className="form-select" onChange={(e) => handleFilterChange(e, 'pendiente')}>
                <option value="">Sin filtro</option>
                <option value="priority">Prioridad</option>
                <option value="due_date">Fecha de vencimiento</option>
            </select>

            <label htmlFor="filterEnProgreso" className="form-label">Filtrar tareas en progreso por:</label>
            <select id="filterEnProgreso" className="form-select" onChange={(e) => handleFilterChange(e, 'enProgreso')}>
                <option value="">Sin filtro</option>
                <option value="priority">Prioridad</option>
                <option value="due_date">Fecha de vencimiento</option>
            </select>

            <label htmlFor="filterCompletado" className="form-label">Filtrar tareas completadas por:</label>
            <select id="filterCompletado" className="form-select" onChange={(e) => handleFilterChange(e, 'completado')}>
                <option value="">Sin filtro</option>
                <option value="priority">Prioridad</option>
                <option value="due_date">Fecha de vencimiento</option>
            </select>
        </div>
    );
};

export default TaskFilters;
