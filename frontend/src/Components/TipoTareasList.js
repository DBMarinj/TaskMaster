import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TipoTareasList({ onEdit, onDelete, tareas }) {
  const [tiposTareas, setTiposTareas] = useState([]); // Estado para todas las tareas

  // Efecto para obtener la lista de tareas cuando el componente se monta
  useEffect(() => {
    const fetchTiposTareas = async () => {
      try {
        const token = localStorage.getItem('access_token'); // Obtener el token de localStorage
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.get('http://127.0.0.1:8000/tareas/tareas/', config);

        if (Array.isArray(response.data)) {
          setTiposTareas(response.data); // Actualiza el estado con las tareas obtenidas
          console.log("Tareas obtenidas exitosamente:", response.data); // Mostrar los datos obtenidos en la consola
        } else {
          console.error("La respuesta no es un array:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
      }
    };

    fetchTiposTareas(); // Llama a la función para obtener las tareas
  }, []); // Se ejecuta una sola vez al montar el componente

  // Renderizado del componente
  return (
    <div className='container'>
      {/* Sección para tareas con estado 7 (Pendientes) */}
      <div className="container card mt-4 p-4">
        <h2 style={{ textAlign: 'center' }}>LISTADO DE TAREAS</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Título</th> {/* Nuevo campo 'Título' agregado */}
              <th>Descripción</th>
              <th>Fecha Vencimiento</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Etiquetas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Verificar si tiposTareas es un array válido antes de hacer el map */}
            {Array.isArray(tareas) && tareas.length > 0 ? (
              tareas.map(tipo => (
                <tr key={tipo.id_tarea}>
                  <td>{tipo.id_tarea}</td>
                  <td>{tipo.titulo}</td> {/* Mostrar el nuevo campo 'Título' */}
                  <td>{tipo.descripcion}</td>
                  <td>{new Date(tipo.fecha_vencimiento).toLocaleDateString()}</td>
                  <td>{tipo.prioridad}</td>
                  <td>{tipo.estado}</td>
                  <td>
                    {tipo.etiquetas.length > 0 ? (
                      tipo.etiquetas.map((etiqueta, index) => (
                        <span key={etiqueta.id_etiqueta}>
                          {etiqueta.nombre}
                          {index < tipo.etiquetas.length - 1 && ', '}
                        </span>
                      ))
                    ) : (
                      <span>Sin etiquetas</span>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-warning" onClick={() => onEdit(tipo)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => onDelete(tipo.id_tarea)}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No hay tareas pendientes.</td> {/* Ajustar colSpan a 8 para el nuevo campo */}
              </tr>
            )}
          </tbody>
        </table>
      </div>   
    </div>
  );
}

export default TipoTareasList;
