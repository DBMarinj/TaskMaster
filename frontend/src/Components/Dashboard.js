import React, { useEffect, useState } from 'react'; // creamos hooks usestate (useEffect: llama axios, se activa cuando carga el componente)(useState: guarda en una vble de hook de estado, la inf. asociada al user) 
import { useNavigate, Link } from 'react-router-dom'; // combinamos los import de useNavigate y Link
import Menu from "./Menu"; // Importa el componente Menu
import axios from 'axios';
import './styles.css'; // Importa el archivo de estilos

// desarrollando el componente
const Dashboard = ({ token }) => { // variable para la clase
    const [userInfo, setUserInfo] = useState(null);  // variable userInfo va a usar el hook setUserInfo y va a hacer null/guarda info que devuelve el endpoint
    const navigate = useNavigate(); // hook de navegación: navigate
    
    useEffect(() => {
        // usar el hook de estado para obtener la inf. del usuario
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/current-user/', { // esto es el endpoint de postman
                    headers: { Authorization: `Bearer ${token}` } // este es la autorización, el Bearer token de postman
                });
                setUserInfo(response.data); // verifica el endpoint y el token, guarda los datos del usuario en userInfo
                console.log(response.data); // imprime la información obtenida del usuario
            } catch (error) {
                console.error('Error fetching user info:', error); // captura y muestra errores
            }
        };
        fetchUserInfo();
    }, [token]); // se ejecuta cada vez que el token cambia

    // Si no se ha cargado la información del usuario, muestra un mensaje de carga
    if (!userInfo) {
        return <div>Cargando información del usuario...</div>;
    }

    return (
        <div className="bg-white text-black min-vh-100"> {/* Fondo general blanco */}
            <Menu userInfo={userInfo} /> {/* pasa el userInfo al componente Menu */}

            <div className="container mt-4">
                <div className="card bg-light"> {/* Fondo de la tarjeta envolvente a gris claro (bg-light) */}
                    <div className="card-body">

                        {/* Card que envuelve el título y el nombre del usuario con fondo dark */}
                        <div className="card bg-dark text-white mb-4"> {/* Fondo bg-dark para esta sección */}
                            <div className="card-body text-center">
                                {/* Título de bienvenida con el nombre del usuario */}
                                <h1 className="my-4 dashboard-title">Bienvenido al Dashboard</h1> {/* Título sin sombra */}
                                <h2 className="user-name text-shadow">{userInfo.nombre} {userInfo.apellido}</h2> {/* Nombre del usuario con sombra */}
                                
                            </div>
                        </div>

                        {/* Nueva tarjeta que envuelve las tarjetas de Usuario y Tareas */}
                        <div className="card mb-4 text-center bg-dark"> {/* Cambiado a bg-dark para mantener consistencia */}
                            <div className="card-header">
                                <h4 className="dashboard-title">GESTIONAR USUARIO - TAREAS</h4> {/* Título centrado, cambiado a h4 */}
                                <hr className="text-white" /> {/* Línea debajo del título */}
                            </div>
                            <div className="card-body">
                                <div className="row mt-5">
                                    
                                    {/* Card de Usuario */}
                                    <div className="col-md-6 mb-4">
                                        <div className="card bg-dark text-white h-100 text-center"> {/* Fondo bg-dark para esta card */}
                                            <div className="card-header card-title text-uppercase"> {/* Se añade verificación de clase */}
                                                <h5 className="dashboard-title">USUARIO</h5> {/* Título cambiado a h5 para ser más pequeño */}
                                                <hr className="text-white" /> {/* Línea debajo del título */}
                                            </div>
                                            <div className="card-body">
                                                <ul className="list-unstyled">
                                                    <li className="mb-3">
                                                        <Link to="/user-update" className="custom-link">Editar Perfil</Link> {/* Enlace corregido */}
                                                    </li>
                                                    <li>
                                                        <Link to="/change-password" className="custom-link">Cambiar Contraseña</Link> {/* Enlace corregido */}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card de Tareas */}
                                    <div className="col-md-6 mb-4">
                                        <div className="card bg-dark text-white h-100 text-center"> {/* Fondo bg-dark para esta card */}
                                            <div className="card-header card-title text-uppercase"> {/* Se añade verificación de clase */}
                                                <h5 className="dashboard-title">TAREAS</h5> {/* Título cambiado a h5 para ser más pequeño */}
                                                <hr className="text-white" /> {/* Línea debajo del título */}
                                            </div>
                                            <div className="card-body">
                                                <ul className="list-unstyled">
                                                    <li className="mb-3">
                                                        <Link to="/tareas" className="custom-link">Gestionar Tareas</Link> {/* Enlace corregido */}
                                                    </li>
                                                    <li className="mb-3">
                                                        <Link to="/etiquetas" className="custom-link">Etiquetas</Link> {/* Enlace corregido */}
                                                    </li>
                                                    <li className="mb-3">
                                                        <Link to="/prioridades" className="custom-link">Prioridades</Link> {/* Enlace corregido */}
                                                    </li>
                                                    <li className="mb-3">
                                                        <Link to="/estados" className="custom-link">Estados</Link> {/* Enlace corregido */}
                                                    </li>
                                                    <li>
                                                        <Link to="/kanban" className="custom-link">Tablero Kanban</Link> {/* Enlace corregido */}
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
