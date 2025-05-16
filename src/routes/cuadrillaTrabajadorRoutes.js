import express from 'express';
import {
  asignarTrabajadorCuadrilla,
  listarAsignaciones,
  obtenerAsignacion,
  actualizarAsignacion,
  eliminarAsignacion
} from '../controllers/cuadrillaTrabajadorController.js';

import { verificarToken } from '../middlewares/authMiddleware.js';
import { tieneRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.post('/', tieneRol('admin', 'supervisor'), asignarTrabajadorCuadrilla);
router.get('/', listarAsignaciones);
router.get('/:id', obtenerAsignacion);
router.put('/:id', tieneRol('admin', 'supervisor'), actualizarAsignacion);
router.delete('/:id', tieneRol('admin'), eliminarAsignacion);

export default router;
