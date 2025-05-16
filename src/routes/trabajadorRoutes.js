import express from 'express';
import {
  crearTrabajador,
  listarTrabajadores,
  obtenerTrabajador,
  actualizarTrabajador,
  eliminarTrabajador,
  buscarPorPulsera 
} from '../controllers/trabajadorController.js';

import { verificarToken } from '../middlewares/authMiddleware.js';
import { tieneRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken); // Todas las rutas protegidas

// Crear trabajador (solo admin o supervisor)
router.post('/', tieneRol('admin', 'supervisor'), crearTrabajador);

// Listar todos
router.get('/', listarTrabajadores);

// Obtener uno por ID
router.get('/:id', obtenerTrabajador);

// Actualizar (solo admin o supervisor)
router.put('/:id', tieneRol('admin', 'supervisor'), actualizarTrabajador);

// Eliminar (solo admin)
router.delete('/:id', tieneRol('admin'), eliminarTrabajador);

router.get('/pulsera/:uuid', buscarPorPulsera);

export default router;
