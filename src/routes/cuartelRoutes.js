import express from 'express';
import {
  crearCuartel,
  listarCuarteles,
  obtenerCuartel,
  actualizarCuartel,
  eliminarCuartel,
  exportarCuartelesPDF 
} from '../controllers/cuartelController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { tieneRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.post('/', tieneRol('admin', 'supervisor'), crearCuartel);
router.get('/', listarCuarteles);
router.get('/:id', obtenerCuartel);
router.put('/:id', tieneRol('admin', 'supervisor'), actualizarCuartel);
router.delete('/:id', tieneRol('admin'), eliminarCuartel);
router.get('/exportar/pdf', exportarCuartelesPDF);

export default router;
