import React, { useState, useEffect } from 'react';
import moment from 'moment';

// Importar moment para manejar fechas
const date = moment("2024-10-16T00:00:00Z");
const formattedDate = date.format('YYYY-MM-DD'); // '2024-10-16'

function TipoTareasForm({ tipoTareasInicial, onSave }) {
  // Agregar el campo 'título' además de los otros campos
  const [id_tarea, setIdTarea] = useState(tipoTareasInicial ? tipoTareasInicial.id_tarea : '');
  const [titulo, setTitulo] = useState(tipoTareasInicial ? tipoTareasInicial.titulo : ''); // Nuevo campo 'título'
  const [descripcion, setDescripcion] = useState(tipoTareasInicial ? tipoTareasInicial.descripcion : '');
  const [fecha_vencimiento, setFechaVencimiento] = useState(tipoTareasInicial ? tipoTareasInicial.fecha_vencimiento : moment().format('YYYY-MM-DD'));
  const [usuario, setUsuario] = useState(tipoTareasInicial ? tipoTareasInicial.usuario : '');
  const [prioridad, setPrioridad] = useState(tipoTareasInicial ? tipoTareasInicial.prioridad : '');
  const [estado, setEstado] = useState(tipoTareasInicial ? tipoTareasInicial.estado : '');
  const [etiquetas, setEtiquetas] = useState(tipoTareasInicial ? tipoTareasInicial.etiquetas : []);

  // Calcular la fecha actual en formato YYYY-MM-DD usando moment
  const currentDate = moment().format('YYYY-MM-DD');

  useEffect(() => {
    if (tipoTareasInicial) {
      setIdTarea(tipoTareasInicial.id_tarea);
      setTitulo(tipoTareasInicial.titulo); // Actualizar el estado del nuevo campo 'título'
      setDescripcion(tipoTareasInicial.descripcion);
      setFechaVencimiento(tipoTareasInicial.fecha_vencimiento);
      setUsuario(tipoTareasInicial.usuario);
      setPrioridad(tipoTareasInicial.prioridad);
      setEstado(tipoTareasInicial.estado);
      setEtiquetas(tipoTareasInicial.etiquetas);
    }
  }, [tipoTareasInicial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tipoTareasData = {
      id_tarea, 
      titulo, // Incluir el campo 'título' en los datos enviados
      descripcion, 
      fecha_vencimiento, 
      usuario, 
      prioridad, 
      estado, 
      etiquetas
    };
    onSave(tipoTareasData);
    
    // Limpiar los campos después de guardar
    setIdTarea('');
    setTitulo(''); // Limpiar el campo 'título'
    setDescripcion('');
    setFechaVencimiento('');
    setUsuario('');
    setPrioridad('');
    setEstado('');
    setEtiquetas([]);
  };

  return (
    <div className="container card mt-4 p-4">
      <h2>{tipoTareasInicial ? "Editar Tarea" : "Crear Tarea"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Título:</label> {/* Nuevo campo 'título' */}
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
        <div className="form-group">
          <label>Usuario:</label>
          <input
            type="number"
            className="form-control"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Prioridad:</label>
          <input
            type="number"
            className="form-control"
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Estado:</label>
          <input
            type="number"
            className="form-control"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Etiquetas:</label>
          <input
            type="text"
            className="form-control"
            value={etiquetas.map(e => e.nombre).join(', ')} // Muestra las etiquetas como una lista separada por comas
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
