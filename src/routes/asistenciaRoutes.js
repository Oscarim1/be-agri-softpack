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

// Swagger documentation for Asistencia routes

/**
 * @swagger
 * tags:
 *   name: Asistencia
 *   description: Endpoints relacionados con la asistencia de los trabajadores
 */

/**
 * @swagger
 * /asistencia:
 *   post:
 *     summary: Registrar una marca de asistencia
 *     tags: [Asistencia]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos necesarios para registrar asistencia
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pulsera_uuid
 *               - tipo
 *             properties:
 *               pulsera_uuid:
 *                 type: string
 *                 example: "abc123-def456"
 *               tipo:
 *                 type: string
 *                 enum: [entrada, salida_colacion, entrada_colacion, salida]
 *                 example: "entrada - entrada_colacion - salida_colacion - salida"
 *     responses:
 *       201:
 *         description: Marca registrada correctamente
 *       400:
 *         description: Datos incompletos o tipo inválido
 *       403:
 *         description: Pulsera inactiva
 *       409:
 *         description: Marca duplicada
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /asistencia/reporte-mensual/{pulsera_uuid}:
 *   get:
 *     summary: Obtener reporte mensual de asistencia (JSON)
 *     tags: [Asistencia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: pulsera_uuid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "abc123-def456"
 *       - name: anio
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         example: "2025"
 *       - name: mes
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         example: "05"
 *     responses:
 *       200:
 *         description: Retorna el resumen y detalles de asistencia mensual
 *       400:
 *         description: Año y mes requeridos
 *       404:
 *         description: Trabajador no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /asistencia/reporte-mensual/{pulsera_uuid}/pdf:
 *   get:
 *     summary: Descargar reporte mensual de asistencia en PDF
 *     tags: [Asistencia]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: pulsera_uuid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         example: "abc123-def456"
 *       - name: anio
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         example: "2025"
 *       - name: mes
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         example: "05"
 *     responses:
 *       200:
 *         description: Retorna el archivo PDF generado
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Año y mes requeridos
 *       404:
 *         description: Trabajador no encontrado
 *       500:
 *         description: Error al generar PDF
 */