import express from 'express';
import {
  asignarContrato,
  listarContratosTrabajador,
  obtenerAsignacionContrato,
  actualizarAsignacionContrato,
  eliminarAsignacionContrato,
  exportarContratoTrabajadorPDF 
} from '../controllers/contratoTrabajadorController.js';

import { verificarToken } from '../middlewares/authMiddleware.js';
import { tieneRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.post('/', tieneRol('admin', 'supervisor'), asignarContrato);
router.get('/', listarContratosTrabajador);
router.get('/:id', obtenerAsignacionContrato);
router.put('/:id', tieneRol('admin', 'supervisor'), actualizarAsignacionContrato);
router.delete('/:id', tieneRol('admin'), eliminarAsignacionContrato);
router.get('/exportar/pdf', exportarContratoTrabajadorPDF);

export default router;
