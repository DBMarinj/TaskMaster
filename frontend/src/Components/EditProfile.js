import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from './Menu';  // Importar el componente Menu
import './styles.css'; // Importa el archivo de estilos


const EditProfile = () => {
    const [userData, setUserData] = useState({
        id: '',
        username: '',
        nombre: '',  // Inicializado como nombre
        apellido: '',  // Inicializado como apellido
        direccion: '',
        celular: '',
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // useEffect para obtener los datos del usuario autenticado desde el backend
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                console.log("Token encontrado:", token);  // Verificar el token

                // Petición GET para obtener los datos del usuario autenticado
                const response = await axios.get('http://127.0.0.1:8000/current-user/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log("Datos recibidos del backend:", response.data);  // Para revisar los datos

                // Actualizar el estado con los datos obtenidos
                setUserData({
                    id: response.data.id,
                    username: response.data.username,
                    nombre: response.data.nombre,  // Cambiar de 'first_name' a 'nombre'
                    apellido: response.data.apellido,  // Cambiar de 'last_name' a 'apellido'
                    direccion: response.data.direccion,
                    celular: response.data.celular,
                });
                setLoading(false);  // Finaliza la carga
            } catch (error) {
                console.error('Error al obtener los datos del usuario:', error);
                setErrorMessage('Error al cargar los datos del perfil.');
                setLoading(false);  // Aún si hay error, se debe terminar la carga
            }
        };

        fetchUserData();  // Llamar a la función de obtención de datos
    }, []);

    // Manejo del evento de guardar
    const handleSave = async (e) => {
        e.preventDefault();  // Evita que el formulario recargue la página

        if (!userData.id) {
            setErrorMessage('El ID del usuario no está disponible.');
            return;
        }

        const updateData = {
            username: userData.username,
            nombre: userData.nombre,  // Cambiar de 'first_name' a 'nombre'
            apellido: userData.apellido,  // Cambiar de 'last_name' a 'apellido'
            direccion: userData.direccion,
            celular: userData.celular,
        };

        try {
            const token = localStorage.getItem('access_token');
            console.log("Datos a enviar al backend:", updateData);  // Para revisar lo que envías

            // Petición PUT para actualizar los datos del usuario
            const response = await axios.put(`http://127.0.0.1:8000/users/${userData.id}/update/`, updateData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log("Respuesta de la actualización:", response.data);  // Para revisar la respuesta

            // Actualizar el estado con los datos actualizados
            setUserData({
                ...userData,
                nombre: response.data.nombre,  // Actualiza correctamente el nombre
                apellido: response.data.apellido,  // Actualiza correctamente el apellido
                direccion: response.data.direccion,
                celular: response.data.celular,
            });
            setMessage('Perfil actualizado correctamente.');  // Mensaje de éxito
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
            setErrorMessage('Error al actualizar el perfil.');  // Mostrar error si la petición falla
        }
    };

    return (
        <div className="bg-white text-black min-vh-100">
            <Menu />  {/* Incluir el componente del menú */}
            <div className="container mt-5">
                <div className="card mt-4 bg-light"> {/* Añadida clase de fondo bg-light para un gris claro */}
                    <div className="card-body">
                        <h2 className="text-center">EDITAR PERFIL</h2>
                        {loading ? (
                            <p>Cargando datos...</p>
                        ) : (
                            <form onSubmit={handleSave}>
                                {message && <div className="alert alert-info text-center">{message}</div>}  {/* Mensaje de éxito */}
                                {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}  {/* Mensaje de error */}

                                {/* Campo: Nombre de Usuario */}
                                <div className="form-group">
                                    <label>Nombre de Usuario</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={userData.username}
                                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                        disabled
                                    />
                                </div>

                                {/* Campo: Nombre */}
                                <div className="form-group">
                                    <label>Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={userData.nombre}  // Campo nombre
                                        onChange={(e) => setUserData({ ...userData, nombre: e.target.value })}
                                    />
                                </div>

                                {/* Campo: Apellido */}
                                <div className="form-group">
                                    <label>Apellido</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={userData.apellido}  // Campo apellido
                                        onChange={(e) => setUserData({ ...userData, apellido: e.target.value })}
                                    />
                                </div>

                                {/* Campo: Dirección */}
                                <div className="form-group">
                                    <label>Dirección</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={userData.direccion}
                                        onChange={(e) => setUserData({ ...userData, direccion: e.target.value })}
                                    />
                                </div>

                                {/* Campo: Celular */}
                                <div className="form-group">
                                    <label>Celular</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={userData.celular}
                                        onChange={(e) => setUserData({ ...userData, celular: e.target.value })}
                                    />
                                </div>

                                {/* Botón para guardar cambios */}
                                <button type="submit" className="btn btn-primary btn-block mt-3">Guardar Cambios</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
