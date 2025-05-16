import express from 'express';
import {
  crearEmpresa,
  listarEmpresas,
  obtenerEmpresa,
  actualizarEmpresa,
  eliminarEmpresa,
  exportarEmpresasPDF 
} from '../controllers/empresaController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { tieneRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.post('/', tieneRol('admin'), crearEmpresa);
router.get('/', listarEmpresas);
router.get('/:id', obtenerEmpresa);
router.put('/:id', tieneRol('admin'), actualizarEmpresa);
router.delete('/:id', tieneRol('admin'), eliminarEmpresa);
router.get('/exportar/pdf', exportarEmpresasPDF);

export default router;
