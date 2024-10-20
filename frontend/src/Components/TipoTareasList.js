import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Componente de lista de tareas que recibe tareas, funciones de edición y eliminación como props
function TipoTareasList({ tareas, onEdit, onDelete }) {
  // Estados locales para almacenar los datos de estados y prioridades obtenidos del backend
  const [estados, setEstados] = useState([]);
  const [prioridades, setPrioridades] = useState([]);

  // useEffect para realizar la solicitud al backend una vez que el componente se monta
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener el token de autenticación desde localStorage
        const token = localStorage.getItem('access_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Realizar las solicitudes a las API para obtener estados y prioridades en paralelo
        const [estadosResponse, prioridadesResponse] = await Promise.all([
          axios.get('http://127.0.0.1:8000/tareas/estados/', config),
          axios.get('http://127.0.0.1:8000/tareas/prioridades/', config),
        ]);

        // Almacenar las respuestas en los estados locales
        setEstados(estadosResponse.data);
        setPrioridades(prioridadesResponse.data);
      } catch (error) {
        // Manejar cualquier error que ocurra durante la solicitud
        console.error('Error al obtener estados y prioridades:', error);
      }
    };

    // Llamar a la función para obtener los datos
    fetchData();
  }, []);

  // Función para obtener el nombre del estado a partir de su id
  const getNombreEstado = (idEstado) => {
    const estado = estados.find((e) => e.id_estado === idEstado);
    return estado ? estado.nombre : 'Desconocido'; // Devolver el nombre o 'Desconocido' si no se encuentra
  };

  // Función para obtener el nombre de la prioridad a partir de su id
  const getNombrePrioridad = (idPrioridad) => {
    const prioridad = prioridades.find((p) => p.id_prioridad === idPrioridad);
    return prioridad ? prioridad.nombre : 'Desconocido'; // Devolver el nombre o 'Desconocido' si no se encuentra
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            {/* He eliminado la columna de Usuario */}
            <th>Título</th>
            <th>Descripción</th>
            <th>Fecha de Vencimiento</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Etiquetas</th> {/* Nueva columna para las etiquetas */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map((tarea) => (
            <tr key={tarea.id_tarea}>
              <td>{tarea.titulo}</td>
              <td>{tarea.descripcion}</td>
              <td>{tarea.fecha_vencimiento}</td>
              {/* He eliminado la celda del Usuario */}
              <td>{getNombrePrioridad(tarea.prioridad)}</td> {/* Mostrar el nombre de la prioridad */}
              <td>{getNombreEstado(tarea.estado)}</td> {/* Mostrar el nombre del estado */}
              <td>
                {tarea.etiquetas.map((etiqueta) => etiqueta.nombre).join(', ')} {/* Mostrar etiquetas separadas por comas */}
              </td>
              <td>
                {/* Botones de editar y eliminar */}
                <button className="btn btn-primary mr-2" onClick={() => onEdit(tarea)}>Editar</button>
                <button className="btn btn-danger" onClick={() => onDelete(tarea.id_tarea)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TipoTareasList;
