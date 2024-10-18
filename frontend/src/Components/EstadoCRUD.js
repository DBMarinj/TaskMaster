import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import EstadoForm from './EstadoForm'; // Componente para el formulario de crear/editar estados
import EstadoList from './EstadoList'; // Componente para mostrar la lista de estados
import Menu from "./Menu"; // Importa el componente Menu

function EstadoCRUD() {
  const [estados, setEstados] = useState([]); // Estado para almacenar la lista de estados
  const [estadoEdit, setEstadoEdit] = useState(null); // Estado para almacenar el estado que será editado

  // Función para obtener todos los estados desde el servidor
  const fetchEstados = async () => {
    try {
      const token = localStorage.getItem('access_token'); // Obtener el token del localStorage para autenticación
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Endpoint para obtener los estados
      const response = await axios.get('http://127.0.0.1:8000/tareas/estados/', config);
      setEstados(response.data); // Actualiza el estado con los estados obtenidos
      console.log("Estados fetched successfully:", response.data);
    } catch (error) {
      console.error('Error al obtener los estados:', error); // Manejo de errores
    }
  };

  // Función para manejar la creación o actualización de un estado
  const handleSave = async (estadoData) => {
    try {
      const token = localStorage.getItem('access_token'); // Obtener el token de autenticación
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (estadoEdit) {
        // Si hay un estado seleccionado para editar, realizar PUT (actualización)
        await axios.put(`http://127.0.0.1:8000/tareas/estados/${estadoEdit.id_estado}/`, estadoData, config);
      } else {
        // Si no hay estado seleccionado, realizar POST (crear nuevo estado)
        await axios.post('http://127.0.0.1:8000/tareas/estados/', estadoData, config);
      }

      fetchEstados(); // Recargar la lista de estados después de guardar
      setEstadoEdit(null); // Reiniciar el formulario
    } catch (error) {
      console.error('Error al guardar el estado:', error); // Manejo de errores
    }
  };

  // Función para manejar la eliminación de un estado
  const handleDelete = async (idEstado) => {
    try {
      const token = localStorage.getItem('access_token'); // Obtener el token de autenticación
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Eliminar el estado con el ID seleccionado
      await axios.delete(`http://127.0.0.1:8000/tareas/estados/${idEstado}/`, config);
      fetchEstados(); // Recargar la lista después de eliminar el estado
    } catch (error) {
      console.error('Error al eliminar el estado:', error); // Manejo de errores
    }
  };

  // Función para manejar la edición de un estado (llena el formulario con los datos del estado seleccionado)
  const handleEdit = (estado) => {
    setEstadoEdit(estado); // Asigna el estado seleccionado para editar
  };

  // useEffect para cargar los estados cuando se monta el componente
  useEffect(() => {
    fetchEstados(); // Llamar a la función cuando el componente se cargue
  }, []);

  return (
    <div className="bg-white text-black min-vh-100"> {/* Aplicar el mismo fondo y color de texto */}
      <Menu /> {/* usa el componente Menu aquí */}
      <div className="container mt-4"> {/* Añadir margen superior */}
        {/* Card para gestionar los estados */}
        <div className="card bg-light"> {/* Añadida clase de fondo bg-light para un gris claro */}
          <div className="card-header text-center"> {/* Encabezado de la card centrado */}
            <h3>GESTIÓN ESTADOS</h3> {/* Título centrado */}
          </div>
          <div className="card-body">
            {/* Formulario para agregar o editar estados */}
            <EstadoForm onSave={handleSave} estadoEdit={estadoEdit} />

            {/* Listado de estados en una tabla dentro de la card */}
            <EstadoList
              estados={estados}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EstadoCRUD;
