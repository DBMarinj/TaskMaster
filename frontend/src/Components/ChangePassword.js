import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from './Menu';

const ChangePassword = () => {
  // Declaración de estados
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    // Obtener datos del usuario logueado
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:8000/current-user/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data); // Guardar datos del usuario, incluyendo el ID
        setLoading(false); // Finalizar carga
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        setErrorMessage('Error al cargar los datos del perfil.');
        setLoading(false); // Detener carga en caso de error
      }
    };

    fetchUserData(); // Llamar a la función para obtener datos del usuario
  }, []);

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Las nuevas contraseñas no coinciden.");
      return;
    }

    try {
      const response = await axios.put(
        'http://127.0.0.1:8000/change-password/',
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      setMessage(response.data.status);
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      setMessage(
        error.response?.data?.old_password || 
        error.response?.data?.confirm_password || 
        "Error al cambiar la contraseña."
      );
    }
  };

  if (loading) {
    return <div>Cargando datos del usuario...</div>;
  }

  return (
    <div className="bg-white text-dark min-vh-100">
      <Menu />
      <div className="container">
        <div className="card mt-4 bg-light"> {/* Añadida clase de fondo bg-light para un gris claro */}
          <div className="card-body">
            <h1 className="card-title my-4 text-center">CAMBIAR CONTRASEÑA</h1>
            {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}
            {message && <div className="alert alert-info text-center">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Contraseña Actual</label>
                <input
                  type="password"
                  className="form-control"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label>Nueva Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block mt-3">Cambiar Contraseña</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
