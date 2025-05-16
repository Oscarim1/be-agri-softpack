import express from 'express';
import { 
    marcarAsistencia,
    reporteMensualAsistencia,
    exportarPDFReporteMensual  
} from '../controllers/asistenciaController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarToken);

// Ruta única para registrar cualquier tipo de marca
router.post('/', marcarAsistencia);
router.get('/reporte-mensual/:pulsera_uuid', reporteMensualAsistencia);
router.get('/reporte-mensual/:pulsera_uuid/pdf', exportarPDFReporteMensual);

export default router;
