import React, { useState, useEffect } from 'react'; 
import moment from 'moment';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Importar jwtDecode correctamente

// Importar moment para manejar fechas
const date = moment("2024-10-16T00:00:00Z");
const formattedDate = date.format('YYYY-MM-DD'); // '2024-10-16'

function TipoTareasForm({ tipoTareasInicial, onSave }) {
  const token = localStorage.getItem('access_token');
  let userId;

  // Decodificar el token para obtener el ID del usuario
  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.user_id; // Se asume que el campo en el token es 'user_id'
  }

  const [id_tarea, setIdTarea] = useState(tipoTareasInicial ? tipoTareasInicial.id_tarea : '');
  const [titulo, setTitulo] = useState(tipoTareasInicial ? tipoTareasInicial.titulo : '');
  const [descripcion, setDescripcion] = useState(tipoTareasInicial ? tipoTareasInicial.descripcion : '');
  const [fecha_vencimiento, setFechaVencimiento] = useState(tipoTareasInicial ? tipoTareasInicial.fecha_vencimiento : moment().format('YYYY-MM-DD'));
  const [prioridad, setPrioridad] = useState(tipoTareasInicial ? tipoTareasInicial.prioridad : '');
  const [estado, setEstado] = useState(tipoTareasInicial ? tipoTareasInicial.estado : '');
  const [etiquetas, setEtiquetas] = useState(tipoTareasInicial ? tipoTareasInicial.etiquetas : []);

  // Estado para almacenar listas de estados y prioridades
  const [estados, setEstados] = useState([]);
  const [prioridades, setPrioridades] = useState([]);

  // Calcular la fecha actual en formato YYYY-MM-DD usando moment
  const currentDate = moment().format('YYYY-MM-DD');

  // Obtener estados y prioridades al cargar el formulario
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [estadosResponse, prioridadesResponse] = await Promise.all([
          axios.get('http://127.0.0.1:8000/tareas/estados/', config),
          axios.get('http://127.0.0.1:8000/tareas/prioridades/', config),
        ]);

        setEstados(estadosResponse.data);
        setPrioridades(prioridadesResponse.data);
      } catch (error) {
        console.error('Error al obtener estados y prioridades:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (tipoTareasInicial) {
      setIdTarea(tipoTareasInicial.id_tarea);
      setTitulo(tipoTareasInicial.titulo);
      setDescripcion(tipoTareasInicial.descripcion);
      setFechaVencimiento(tipoTareasInicial.fecha_vencimiento);
      setPrioridad(tipoTareasInicial.prioridad);
      setEstado(tipoTareasInicial.estado);
      setEtiquetas(tipoTareasInicial.etiquetas);
    }
  }, [tipoTareasInicial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tipoTareasData = {
      id_tarea, 
      titulo, 
      descripcion, 
      fecha_vencimiento, 
      usuario: userId, // Asignar el ID del usuario de manera automática
      prioridad: parseInt(prioridad), // Convertir a número antes de enviar
      estado: parseInt(estado), // Convertir a número antes de enviar
      etiquetas
    };
    onSave(tipoTareasData);

    // Limpiar los campos después de guardar
    setIdTarea('');
    setTitulo('');
    setDescripcion('');
    setFechaVencimiento('');
    setPrioridad('');
    setEstado('');
    setEtiquetas([]);
  };

  return (
    <div className="container card mt-4 p-4">
      <h2>{tipoTareasInicial ? "Editar Tarea" : "Crear Tarea"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título:</label>
          <input
            type="text"
            className="form-control"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          <input
            type="text"
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Fecha de Vencimiento:</label>
          <input
            type="date"
            className="form-control"
            value={fecha_vencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
            min={currentDate} // Establecer la fecha mínima como la fecha actual
            required
          />
        </div>

        {/* Dropdown de Prioridad */}
        <div className="form-group">
          <label>Prioridad:</label>
          <select
            className="form-control"
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            required
          >
            <option value="">Seleccionar Prioridad</option>
            {prioridades.map((p) => (
              <option key={p.id_prioridad} value={p.id_prioridad}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown de Estado */}
        <div className="form-group">
          <label>Estado:</label>
          <select
            className="form-control"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
          >
            <option value="">Seleccionar Estado</option>
            {estados.map((e) => (
              <option key={e.id_estado} value={e.id_estado}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Etiquetas:</label>
          <input
            type="text"
            className="form-control"
            value={etiquetas.map(e => e.nombre).join(', ')} 
            onChange={(e) => setEtiquetas(e.target.value.split(',').map(nombre => ({ nombre: nombre.trim() })))}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {tipoTareasInicial ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
}

export default TipoTareasForm;
