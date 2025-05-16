import express from 'express';
import { 
    resumenCuadrillaPorFecha,
    exportarResumenCuadrillaPDF
 } from '../controllers/cuadrillaController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.get('/:cuadrilla_id/resumen', resumenCuadrillaPorFecha);
router.get('/:cuadrilla_id/resumen/pdf', exportarResumenCuadrillaPDF);

export default router;
