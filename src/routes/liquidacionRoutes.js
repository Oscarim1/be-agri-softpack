import express from 'express';
import {
  crearLiquidacion,
  listarLiquidaciones,
  obtenerLiquidacion,
  actualizarLiquidacion,
  eliminarLiquidacion,
  exportarPDFLiquidacion,
  exportarLiquidacionesPorTrabajadorPDF 
} from '../controllers/liquidacionController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { tieneRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.post('/', tieneRol('admin', 'supervisor'), crearLiquidacion);
router.get('/', listarLiquidaciones);
router.get('/:id', obtenerLiquidacion);
router.put('/:id', tieneRol('admin', 'supervisor'), actualizarLiquidacion);
router.delete('/:id', tieneRol('admin'), eliminarLiquidacion);
router.get('/:id/exportar/pdf', exportarPDFLiquidacion);
router.get('/exportar/pdf', exportarLiquidacionesPorTrabajadorPDF);

export default router;
