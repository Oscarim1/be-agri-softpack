import express from 'express';
import {
  crearAsignacionTrabajo,
  listarAsignacionesTrabajo,
  obtenerAsignacionTrabajo,
  actualizarAsignacionTrabajo,
  eliminarAsignacionTrabajo
} from '../controllers/cuadrillaTrabajoController.js';

import { verificarToken } from '../middlewares/authMiddleware.js';
import { tieneRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.post('/', tieneRol('admin', 'supervisor'), crearAsignacionTrabajo);
router.get('/', listarAsignacionesTrabajo);
router.get('/:id', obtenerAsignacionTrabajo);
router.put('/:id', tieneRol('admin', 'supervisor'), actualizarAsignacionTrabajo);
router.delete('/:id', tieneRol('admin'), eliminarAsignacionTrabajo);

export default router;
