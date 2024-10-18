import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TipoTareasForm from './TipoTareasFORM';
import TipoTareasList from './TipoTareasList';
import Menu from "./Menu"; // Importa el componente Menu

const TipoTareasCRUD = () => {
  // Estado que almacena la lista de tareas
  const [tareas, setTareas] = useState([]);
  // Estado que almacena la tarea que se está editando
  const [editingTarea, setEditingTarea] = useState(null);

  // Obtiene el token de autenticación del localStorage
  const token = localStorage.getItem('access_token');

  // Configuración del encabezado de la solicitud con el token de autenticación
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // Hook de efecto que carga las tareas al montar el componente
  useEffect(() => {
    fetchTareas();
  }, []);

  // Función para obtener la lista de tareas del servidor
  const fetchTareas = async () => {
    try {
      // Solicitud GET para obtener las tareas, con el token en los encabezados
      const response = await axios.get('http://127.0.0.1:8000/tareas/tareas/', config);
      setTareas(response.data); // Actualiza el estado con las tareas obtenidas
      console.log("Tareas fetched successfully:", response.data);
    } catch (error) {
      // Manejo de error si la solicitud falla
      console.error("Error fetching tareas:", error);
    }
  };

  // Función para crear una nueva tarea
  const handleCreate = async (newTarea) => {
    try {
      // Solicitud POST para crear una nueva tarea, con el token en los encabezados
      const response = await axios.post('http://127.0.0.1:8000/tareas/tareas/', newTarea, config);
      setTareas([...tareas, response.data]); // Añade la nueva tarea al estado
      console.log("Tarea created successfully:", response.data);
    } catch (error) {
      // Manejo de error si la creación falla
      console.error("Error creating tarea:", error);
    }
  };

  // Función para establecer la tarea que será editada
  const handleEdit = (tarea) => {
    setEditingTarea(tarea); // Actualiza el estado con la tarea seleccionada
  };

  // Función para actualizar una tarea existente
  const handleUpdate = async (updatedTarea) => {
    try {
      // Solicitud PUT para actualizar una tarea existente, con el token en los encabezados
      const response = await axios.put(`http://127.0.0.1:8000/tareas/tareas/${updatedTarea.id_tarea}/`, updatedTarea, config);
      // Actualiza la lista de tareas en el estado con la tarea actualizada
      setTareas(tareas.map(t => t.id_tarea === updatedTarea.id_tarea ? response.data : t));
      console.log("Tarea updated successfully:", response.data);
    } catch (error) {
      // Manejo de error si la actualización falla
      console.error("Error updating tarea:", error);
    }
    // Limpia la tarea en edición después de actualizar
    setEditingTarea(null);
  };

  // Función para eliminar una tarea
  const handleDelete = async (id_tarea) => {
    try {
      // Solicitud DELETE para eliminar una tarea, con el token en los encabezados
      await axios.delete(`http://127.0.0.1:8000/tareas/tareas/${id_tarea}/`, config);
      // Elimina la tarea del estado filtrando por el id de la tarea eliminada
      setTareas(tareas.filter(t => t.id_tarea !== id_tarea));
      console.log("Tarea deleted successfully:", id_tarea);
    } catch (error) {
      // Manejo de error si la eliminación falla
      console.error("Error deleting tarea:", error);
    }
  };

  return (
    <div className="bg-white text-black min-vh-100">
      <Menu /> {/* Usa el componente Menu aquí */}
      <div className="container">
        <div className="card mt-4 bg-light"> {/* Añadida clase de fondo bg-light para un gris claro */}
          <div className="card-body">
            <h3 className="card-title my-4 text-center">GESTIÓN TAREAS</h3> {/* Título centrado */}
            {/* Formulario para agregar o editar tareas */}
            <TipoTareasForm
              tipoTareasInicial={editingTarea}
              onSave={editingTarea ? handleUpdate : handleCreate}
            />

            {/* Listado de tareas en una tabla dentro de la card */}
            <TipoTareasList
              tareas={tareas}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipoTareasCRUD;
