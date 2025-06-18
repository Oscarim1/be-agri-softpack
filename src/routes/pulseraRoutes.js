import express from 'express';
import {   
    obtenerEstadoPulsera,
    actualizarEstadoPulsera
} from '../controllers/pulseraController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarToken);

// Ruta única para registrar cualquier tipo de marca
router.get('/estado/:pulsera_uuid', obtenerEstadoPulsera);
router.put('/estado/:pulsera_uuid', actualizarEstadoPulsera);

export default router;

// Swagger documentation for Asistencia routes


