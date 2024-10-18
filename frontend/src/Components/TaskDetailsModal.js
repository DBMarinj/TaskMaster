import React from 'react';
import { Modal, Button } from 'react-bootstrap'; // Usaremos React-Bootstrap para crear el modal

const TaskDetailsModal = ({ show, handleClose, task }) => {
    if (!task) return null; // Si no hay tarea seleccionada, no mostrar nada

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Detalles de la Tarea</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>ID:</strong> {task.id_tarea}</p>
                <p><strong>Título:</strong> {task.titulo || 'Sin título'}</p> {/* Mostrar el campo título */}
                <p><strong>Descripción:</strong> {task.descripcion || 'Sin descripción'}</p>
                <p><strong>Prioridad:</strong> {task.prioridad}</p>
                <p><strong>Fecha de Vencimiento:</strong> {task.fecha_vencimiento ? new Date(task.fecha_vencimiento).toLocaleDateString() : 'Sin fecha'}</p>
                <p><strong>Estado:</strong> {task.estado}</p>
                {/* Agrega más campos según sea necesario */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TaskDetailsModal;
