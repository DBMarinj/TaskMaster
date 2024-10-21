import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TipoTareasForm from './TipoTareasFORM';
import TipoTareasList from './TipoTareasList';
import Menu from "./Menu"; // Importa el componente Menu

const TipoTareasCRUD = () => {
  const [tareas, setTareas] = useState([]);
  const [editingTarea, setEditingTarea] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const token = localStorage.getItem('access_token');
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (token) {
      fetchTareas();
      fetchUserInfo(); // Obtiene la información del usuario
    } else {
      console.error("No token found");
    }
  }, [token]);

  const fetchTareas = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/tareas/tareas/', config);
      setTareas(response.data);
      console.log("Tareas fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching tareas:", error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/current-user/', config); // Ajusta la ruta según la API
      setUserInfo(response.data);
      console.log("User info fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleCreate = async (newTarea) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/tareas/tareas/', newTarea, config);
      setTareas([...tareas, response.data]);
      console.log("Tarea created successfully:", response.data);
    } catch (error) {
      console.error("Error creating tarea:", error);
    }
  };

  const handleEdit = (tarea) => {
    setEditingTarea(tarea);
  };

  const handleUpdate = async (updatedTarea) => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/tareas/tareas/${updatedTarea.id_tarea}/`, updatedTarea, config);
      setTareas(tareas.map(t => t.id_tarea === updatedTarea.id_tarea ? response.data : t));
      console.log("Tarea updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating tarea:", error);
    }
    setEditingTarea(null);
  };

  const handleDelete = async (id_tarea) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/tareas/tareas/${id_tarea}/`, config);
      setTareas(tareas.filter(t => t.id_tarea !== id_tarea));
      console.log("Tarea deleted successfully:", id_tarea);
    } catch (error) {
      console.error("Error deleting tarea:", error);
    }
  };

  return (
    <div className="bg-white text-black min-vh-100">
      <Menu userInfo={userInfo} /> {/* Usa el componente Menu y pasa userInfo */}
      <div className="container">
        <div className="card mt-4 bg-light">
          <div className="card-body">
            <h3 className="card-title my-4 text-center">GESTIÓN TAREAS</h3>
            <TipoTareasForm
              tipoTareasInicial={editingTarea}
              onSave={editingTarea ? handleUpdate : handleCreate}
            />
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
