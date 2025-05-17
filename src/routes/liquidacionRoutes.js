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

// Swagger documentation for Liquidacion routes
/**
 * @swagger
 * tags:
 *   name: Liquidaciones
 *   description: Gestión de liquidaciones de sueldo
 */

/**
 * @swagger
 * /liquidaciones:
 *   post:
 *     summary: Crear una nueva liquidación
 *     tags: [Liquidaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos completos de la liquidación
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [contrato_trabajador_id, fecha_liquidacion]
 *             properties:
 *               contrato_trabajador_id:
 *                 type: integer
 *                 example: 1
 *               fecha_liquidacion:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-30"
 *               dias_trabajados:
 *                 type: integer
 *                 example: 30
 *               sueldo_base:
 *                 type: number
 *                 example: 500000
 *               gratificacion:
 *                 type: number
 *                 example: 50000
 *               colacion:
 *                 type: number
 *                 example: 30000
 *               asignacion_gastos:
 *                 type: number
 *               cotizacion_prevision:
 *                 type: number
 *               cotizacion_salud:
 *                 type: number
 *               seguro_cesantia:
 *                 type: number
 *               impuesto_unico:
 *                 type: number
 *               otros_descuentos:
 *                 type: number
 *               afp_nombre:
 *                 type: string
 *                 example: "AFP Habitat"
 *               salud_nombre:
 *                 type: string
 *                 example: "Fonasa"
 *               total_haberes:
 *                 type: number
 *               total_descuentos:
 *                 type: number
 *               liquido_final:
 *                 type: number
 *     responses:
 *       201:
 *         description: Liquidación creada correctamente
 *       400:
 *         description: Datos obligatorios faltantes
 *       500:
 *         description: Error al crear la liquidación
 */

/**
 * @swagger
 * /liquidaciones:
 *   get:
 *     summary: Listar todas las liquidaciones
 *     tags: [Liquidaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de liquidaciones
 *       500:
 *         description: Error al listar
 */

/**
 * @swagger
 * /liquidaciones/{id}:
 *   get:
 *     summary: Obtener liquidación por ID
 *     tags: [Liquidaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         example: 10
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de la liquidación
 *       404:
 *         description: Liquidación no encontrada
 *       500:
 *         description: Error al obtener
 */

/**
 * @swagger
 * /liquidaciones/{id}:
 *   put:
 *     summary: Actualizar una liquidación
 *     tags: [Liquidaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Nuevos datos de la liquidación
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sueldo_base:
 *                 type: number
 *                 example: 600000
 *               dias_trabajados:
 *                 type: integer
 *                 example: 28
 *     responses:
 *       200:
 *         description: Liquidación actualizada correctamente
 *       404:
 *         description: No encontrada
 *       500:
 *         description: Error al actualizar
 */

/**
 * @swagger
 * /liquidaciones/{id}:
 *   delete:
 *     summary: Eliminar una liquidación
 *     tags: [Liquidaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Eliminada correctamente
 *       404:
 *         description: No encontrada
 *       500:
 *         description: Error al eliminar
 */

/**
 * @swagger
 * /liquidaciones/{id}/exportar/pdf:
 *   get:
 *     summary: Exportar una liquidación a PDF por ID
 *     tags: [Liquidaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 12
 *     responses:
 *       200:
 *         description: PDF generado
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Liquidación no encontrada
 *       500:
 *         description: Error al generar PDF
 */

/**
 * @swagger
 * /liquidaciones/exportar/pdf:
 *   get:
 *     summary: Exportar PDF de todas las liquidaciones de un trabajador
 *     tags: [Liquidaciones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: trabajador_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 3
 *       - in: query
 *         name: desde
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-05-01"
 *       - in: query
 *         name: hasta
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-05-31"
 *     responses:
 *       200:
 *         description: PDF generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Falta el parámetro trabajador_id
 *       404:
 *         description: No se encontraron liquidaciones
 *       500:
 *         description: Error al generar PDF
 */
