import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "./Menu"; // Importa el componente Menu

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({});
  const token = localStorage.getItem("access_token");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (token) {
      fetchUserInfo();
    } else {
      console.error("No token found");
    }
  }, [token]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/current-user/", config);
      setUserInfo(response.data);
      console.log("User Info fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  return (
    <div className="bg-white text-black min-vh-100">
      <Menu userInfo={userInfo} /> {/* Usa el componente Menu y pasa userInfo */}
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light text-dark">
        {/* Fondo claro, tarjeta centrada en ancho y alto */}
        <div
          className="card bg-white shadow"
          style={{ maxWidth: "800px", width: "100%" }} // Cambia el maxWidth a 800px
        >
          <div className="card-body">
            {/* Título y separación */}
            <div className="card-header bg-primary text-white text-center mb-4">
              {/* Fondo primario y texto blanco */}
              <h3 className="card-title">Información del Usuario</h3>
            </div>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Nombre:</strong> {userInfo.nombre}</p>
                <p><strong>Apellido:</strong> {userInfo.apellido}</p>
                <p><strong>Celular:</strong> {userInfo.celular}</p>
                <p><strong>Dirección:</strong> {userInfo.direccion}</p>
                <p style={{ wordBreak: "break-word" }}> {/* Evita el corte del texto a mitad de palabras */}
                  <strong>Email:</strong> {userInfo.email || "No proporcionado"}
                </p>
                <p><strong>Estado:</strong> {userInfo.estado ? "Activo" : "Inactivo"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
