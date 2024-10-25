import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom'; // Importamos Link para crear el enlace
import MensajeError from './MensajeError'; // Importa el componente de mensaje de error
import axios from 'axios'; // Integración con la API REST

// Desarrollando el componente
const Login = ({ setToken }) => { //variable para la clase, () => eso es función anónima, abajo cuerpo de la función,settoken va entre {} ya que es una vble/se comunica con setToken del archivo app.js
    const [usuario, setUsuario] = useState(''); // Hook de estado para manejar el nombre de usuario
    const [contrasena, setContrasena] = useState(''); // Hook de estado para manejar la contraseña
    const [errores, setError] = useState(''); // Hook de estado para manejar los errores
    const navegar = useNavigate(); // Hook de navegación: usar para redirigir/useNavigate que importamos de react router dom
    const APPI_URL = 'http://127.0.0.1:8000/token/'; // URL de la API para la autenticación

    // Función para validar los datos de inicio de sesión
    const validarDatos = async () => {   
        try {
            const respuesta = await axios.post(APPI_URL, { "username": usuario, "password": contrasena }); // Realiza la petición POST a la API con usuario y contraseña
            
            localStorage.setItem('access_token', respuesta.data.access); // Guardamos el token de acceso en el almacenamiento local
            setToken(respuesta.data.access); // Actualizamos el estado con el token
            navegar('/dashboard'); // Redirigimos al usuario al dashboard
        } catch (error) { 
            setError('Credenciales incorrectas'); // Si ocurre un error, se muestra el mensaje de error
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-white"> {/*Estilos para centrar el contenido */}
            <div className="card bg-secondary" style={{ width: '25rem' }}> {/* Tarjeta de Bootstrap para el formulario */}
                <div className="card-body text-center"> 
                    <h2 className="card-title">Task Master</h2> {/* Título del formulario */}
                    {errores && <MensajeError message={errores} />} {/* Mostrar mensaje de error si ocurre un error */}

                    {/* Campo para el nombre de usuario */}
                    <div className="form-group">        
                        <label htmlFor="username"></label>
                        <input 
                            placeholder='Escriba el nombre de usuario' 
                            type="text" 
                            className="form-control" 
                            id="username" 
                            value={usuario} 
                            onChange={(e) => {setUsuario(e.target.value); setError('');}} // Se limpia el error cuando se escribe
                            required                            
                            autoComplete="off" // Desactiva el autocompletado para el usuario
                        />
                    </div>

                    {/* Campo para la contraseña */}
                    <div className="form-group">
                        <label htmlFor="password"></label>
                        <input 
                            placeholder='Escriba la contraseña'
                            type="password"
                            className="form-control"
                            id="password"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)} // Actualiza el estado con la contraseña
                            required
                            autoComplete="new-password" // Desactiva el autocompletado para la contraseña
                        />                        
                    </div>

                    {/* Botón para iniciar sesión */}
                    <button className="btn btn-primary btn-block mt-3" onClick={validarDatos}>
                        Iniciar Sesión
                    </button>

                    {/* Enlace para la recuperación de contraseña */}
                    <div className="mt-3">
                        <Link to="/recuperar-password" className="text-white"> {/* Redirige a la página de recuperación de contraseña */}
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    {/* Enlace para registrarse */}
                    <div className="mt-3">
                        <Link to="/register" className="text-white"> {/* Redirige a la página de registro */}
                            ¿No tienes una cuenta? Regístrate aquí
                        </Link>
                    </div>

                </div>
            </div> 
        </div>
    );
};

export default Login;
