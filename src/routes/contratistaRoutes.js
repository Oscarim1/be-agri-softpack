import express from 'express';
import {
  crearContratista,
  listarContratistas,
  obtenerContratista,
  actualizarContratista,
  eliminarContratista,
  exportarContratistasPDF 
} from '../controllers/contratistaController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { tieneRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.post('/', tieneRol('admin'), crearContratista);
router.get('/', listarContratistas);
router.get('/:id', obtenerContratista);
router.put('/:id', tieneRol('admin'), actualizarContratista);
router.delete('/:id', tieneRol('admin'), eliminarContratista);
router.get('/exportar/pdf', exportarContratistasPDF);

export default router;
