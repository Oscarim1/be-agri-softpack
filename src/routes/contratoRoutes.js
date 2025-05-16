import express from 'express';
import {
  crearContrato,
  listarContratos,
  obtenerContrato,
  actualizarContrato,
  eliminarContrato,
  exportarContratosPDF
} from '../controllers/contratoController.js';

import { verificarToken } from '../middlewares/authMiddleware.js';
import { tieneRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.post('/', tieneRol('admin', 'supervisor'), crearContrato);
router.get('/', listarContratos);
router.get('/:id', obtenerContrato);
router.put('/:id', tieneRol('admin', 'supervisor'), actualizarContrato);
router.delete('/:id', tieneRol('admin'), eliminarContrato);
router.get('/exportar/pdf', exportarContratosPDF);

export default router;
