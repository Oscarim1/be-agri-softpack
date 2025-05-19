import express from 'express';
import {
  asignarContrato,
  listarContratosTrabajador,
  obtenerAsignacionContrato,
  actualizarAsignacionContrato,
  eliminarAsignacionContrato,
  exportarContratoTrabajadorPDF 
} from '../controllers/contratoTrabajadorController.js';

import { verificarToken } from '../middlewares/authMiddleware.js';
import { tieneRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.post('/', tieneRol('admin', 'supervisor'), asignarContrato);
router.get('/', listarContratosTrabajador);
router.get('/:id', obtenerAsignacionContrato);
router.put('/:id', tieneRol('admin', 'supervisor'), actualizarAsignacionContrato);
router.delete('/:id', tieneRol('admin'), eliminarAsignacionContrato);
router.get('/exportar/pdf', exportarContratoTrabajadorPDF);

export default router;

// Swagger documentation for ContratoTrabajador routes
/**
 * @swagger
 * tags:
 *   name: ContratosTrabajador
 *   description: Asignación de contratos a trabajadores
 */

/**
 * @swagger
 * /contratos-trabajador:
 *   post:
 *     summary: Asignar un contrato a un trabajador
 *     tags: [ContratosTrabajador]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contrato_id
 *               - trabajador_id
 *               - fecha_inicio
 *             properties:
 *               contrato_id:
 *                 type: integer
 *                 example: 1
 *               trabajador_id:
 *                 type: integer
 *                 example: 10
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-01"
 *               fecha_termino:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-01"
 *               estado:
 *                 type: string
 *                 example: "activo"
 *     responses:
 *       201:
 *         description: Contrato asignado correctamente
 *       400:
 *         description: Campos obligatorios faltantes
 *       500:
 *         description: Error al asignar contrato
 */

/**
 * @swagger
 * /contratos-trabajador:
 *   get:
 *     summary: Listar todas las asignaciones de contrato
 *     tags: [ContratosTrabajador]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contratos asignados a trabajadores
 *       500:
 *         description: Error al listar asignaciones
 */

/**
 * @swagger
 * /contratos-trabajador/{id}:
 *   get:
 *     summary: Obtener asignación de contrato por ID
 *     tags: [ContratosTrabajador]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         example: 5
 *     responses:
 *       200:
 *         description: Asignación encontrada
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error al obtener asignación
 */

/**
 * @swagger
 * /contratos-trabajador/{id}:
 *   put:
 *     summary: Actualizar una asignación de contrato
 *     tags: [ContratosTrabajador]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contrato_id:
 *                 type: integer
 *               trabajador_id:
 *                 type: integer
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_termino:
 *                 type: string
 *                 format: date
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Asignación actualizada correctamente
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error al actualizar asignación
 */

/**
 * @swagger
 * /contratos-trabajador/{id}:
 *   delete:
 *     summary: Eliminar asignación de contrato
 *     tags: [ContratosTrabajador]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asignación eliminada correctamente
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error al eliminar asignación
 */

/**
 * @swagger
 * /contratos-trabajador/exportar/pdf:
 *   get:
 *     summary: Exportar asignaciones a PDF
 *     tags: [ContratosTrabajador]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: contrato_id
 *         schema:
 *           type: integer
 *         required: false
 *         example: 2
 *       - in: query
 *         name: trabajador_id
 *         schema:
 *           type: integer
 *         required: false
 *         example: 12
 *     responses:
 *       200:
 *         description: PDF generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No se encontraron asignaciones
 *       500:
 *         description: Error al generar PDF
 */

