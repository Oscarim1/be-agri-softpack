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

// // Swagger documentation for Cuadrilla routes
/**
 * @swagger
 * tags:
 *   name: Cuadrillas
 *   description: Resumen de cuadrillas por día
 */

/**
 * @swagger
 * /cuadrillas/{cuadrilla_id}/resumen:
 *   get:
 *     summary: Obtener resumen diario de una cuadrilla
 *     tags: [Cuadrillas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cuadrilla_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 4
 *       - in: query
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2025-05-20"
 *     responses:
 *       200:
 *         description: Resumen de cuadrilla en formato JSON
 *       400:
 *         description: Falta el parámetro de fecha
 *       500:
 *         description: Error al generar el resumen
 */

/**
 * @swagger
 * /cuadrillas/{cuadrilla_id}/resumen/pdf:
 *   get:
 *     summary: Exportar resumen diario de una cuadrilla en PDF
 *     tags: [Cuadrillas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cuadrilla_id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 4
 *       - in: query
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         example: "2025-05-20"
 *     responses:
 *       200:
 *         description: PDF generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Falta el parámetro de fecha
 *       500:
 *         description: Error al generar PDF
 */
