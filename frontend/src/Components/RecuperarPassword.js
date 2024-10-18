import React, { useState } from 'react';
import axios from 'axios';

const RecuperarPassword = () => {
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [errores, setErrores] = useState('');

    const informacionRecuperacion = async () => {
        try {
            const respuesta = await axios.post('http://127.0.0.1:8000/password-reset/', { email });
            setMensaje('Favor revisar la bandeja de entrada de tu correo y darle clic en el enlace.');
            setErrores('');
        } catch (error) {
            console.error('Error en la solicitud:', error.response || error.message);
            setErrores('Error al enviar el enlace de recuperación, por favor intenta nuevamente.');
        }
    };

    return (
        <div className="bg-white text-dark min-vh-100"> {/* Aplica el estilo global */}            
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header text-center">
                                <h2>Recuperación de contraseña</h2>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} // Corregido: uso de onChange y target.value
                                        placeholder="Escriba su email"
                                    />
                                </div>
                                <button className="btn btn-primary btn-block" onClick={informacionRecuperacion}>
                                    Enviar enlace de recuperación
                                </button>
                                {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}
                                {errores && <div className="alert alert-danger mt-3">{errores}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecuperarPassword;
