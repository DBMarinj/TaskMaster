import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PrioridadForm from './PrioridadFORM'; // Componente para el formulario de crear/editar prioridades
import PrioridadList from './PrioridadList'; // Componente para mostrar la lista de prioridades
import Menu from "./Menu"; // Importa el componente Menu

const PrioridadCRUD = () => {
  const [prioridades, setPrioridades] = useState([]); // Estado para almacenar la lista de prioridades
  const [prioridadEdit, setPrioridadEdit] = useState(null); // Estado para almacenar la prioridad que será editada

  // Obtiene el token de autenticación del localStorage
  const token = localStorage.getItem('access_token');

  // Configuración del encabezado de la solicitud con el token de autenticación
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // useEffect para cargar las prioridades cuando se monta el componente
  useEffect(() => {
    fetchPrioridades(); // Llamar a la función para obtener prioridades al cargar el componente
  }, []);

  // Función para obtener todas las prioridades desde el servidor
  const fetchPrioridades = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/tareas/prioridades/', config);
      setPrioridades(response.data); // Actualiza el estado con las prioridades obtenidas
      console.log("Prioridades fetched successfully:", response.data);
    } catch (error) {
      console.error('Error al obtener las prioridades:', error);
    }
  };

  // Función para manejar la creación o actualización de una prioridad
  const handleSave = async (prioridadData) => {
    try {
      if (prioridadEdit) {
        // Si hay una prioridad seleccionada para editar, realizar PUT (actualización)
        const response = await axios.put(`http://127.0.0.1:8000/tareas/prioridades/${prioridadEdit.id_prioridad}/`, prioridadData, config);
        console.log("Prioridad updated successfully:", response.data);
      } else {
        // Si no hay prioridad seleccionada, realizar POST (crear nueva prioridad)
        const response = await axios.post('http://127.0.0.1:8000/tareas/prioridades/', prioridadData, config);
        console.log("Prioridad created successfully:", response.data);
      }

      fetchPrioridades(); // Recargar la lista de prioridades después de guardar
      setPrioridadEdit(null); // Reiniciar el formulario
    } catch (error) {
      console.error('Error al guardar la prioridad:', error);
    }
  };

  // Función para manejar la eliminación de una prioridad
  const handleDelete = async (idPrioridad) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/tareas/prioridades/${idPrioridad}/`, config);
      fetchPrioridades(); // Recargar la lista de prioridades después de eliminar
      console.log("Prioridad deleted successfully:", idPrioridad);
    } catch (error) {
      console.error('Error al eliminar la prioridad:', error);
    }
  };

  // Función para manejar la edición de una prioridad
  const handleEdit = (prioridad) => {
    setPrioridadEdit(prioridad); // Asigna la prioridad seleccionada para editar
  };

  return (
    <div className="bg-white text-black min-vh-100">
      <Menu /> {/* Usa el componente Menu */}
      <div className="container">
        <div className="card mt-4 bg-light"> {/* Añadida clase de fondo bg-light para un gris claro */}
          <div className="card-body">
            <h3 className="card-title my-4 text-center">GESTIÓN PRIORIDADES</h3> {/* Título centrado */}
            {/* Formulario para agregar o editar prioridades */}
            <PrioridadForm onSave={handleSave} prioridadEdit={prioridadEdit} />

            {/* Lista de prioridades, con funciones para editar o eliminar */}
            <PrioridadList
              prioridades={prioridades}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrioridadCRUD;
