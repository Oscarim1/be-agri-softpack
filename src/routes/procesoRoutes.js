import express from 'express';
import { tieneRol } from '../middlewares/roleMiddleware.js';
import {
  crearProceso,
  listarProcesos,
  obtenerProceso,
  actualizarProceso,
  eliminarProceso,
  registrarDesdePulsera,
  resumenDiarioPorPulsera  
} from '../controllers/procesoController.js';

import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.post('/', verificarToken, tieneRol('admin', 'supervisor'), crearProceso);
router.get('/', listarProcesos);
router.get('/:id', obtenerProceso);
router.put('/:id', actualizarProceso);
router.delete('/:id', eliminarProceso);
router.post('/registrar-desde-pulsera', registrarDesdePulsera);
router.get('/resumen/:pulsera_uuid', resumenDiarioPorPulsera);

export default router;
