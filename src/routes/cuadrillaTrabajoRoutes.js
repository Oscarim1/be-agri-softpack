import express from 'express';
import {
  crearAsignacionTrabajo,
  listarAsignacionesTrabajo,
  obtenerAsignacionTrabajo,
  actualizarAsignacionTrabajo,
  eliminarAsignacionTrabajo
} from '../controllers/cuadrillaTrabajoController.js';

import { verificarToken } from '../middlewares/authMiddleware.js';
import { tieneRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.post('/', tieneRol('admin', 'supervisor'), crearAsignacionTrabajo);
router.get('/', listarAsignacionesTrabajo);
router.get('/:id', obtenerAsignacionTrabajo);
router.put('/:id', tieneRol('admin', 'supervisor'), actualizarAsignacionTrabajo);
router.delete('/:id', tieneRol('admin'), eliminarAsignacionTrabajo);

export default router;

// Swagger documentation for CuadrillaTrabajo routes
/**
 * @swagger
 * tags:
 *   name: CuadrillaTrabajo
 *   description: Asignación de trabajos a cuadrillas
 */

/**
 * @swagger
 * /cuadrilla-trabajo:
 *   post:
 *     summary: Asignar un trabajo a una cuadrilla
 *     tags: [CuadrillaTrabajo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos necesarios para crear una asignación
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cuadrilla_id
 *               - trabajo_id
 *               - fecha
 *             properties:
 *               cuadrilla_id:
 *                 type: integer
 *                 example: 3
 *               trabajo_id:
 *                 type: integer
 *                 example: 2
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-22"
 *     responses:
 *       201:
 *         description: Trabajo asignado a la cuadrilla
 *       400:
 *         description: Faltan campos obligatorios
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /cuadrilla-trabajo:
 *   get:
 *     summary: Listar todas las asignaciones de trabajo a cuadrillas
 *     tags: [CuadrillaTrabajo]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones
 *       500:
 *         description: Error al obtener asignaciones
 */

/**
 * @swagger
 * /cuadrilla-trabajo/{id}:
 *   get:
 *     summary: Obtener una asignación por ID
 *     tags: [CuadrillaTrabajo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Asignación encontrada
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error al buscar asignación
 */

/**
 * @swagger
 * /cuadrilla-trabajo/{id}:
 *   put:
 *     summary: Actualizar una asignación existente
 *     tags: [CuadrillaTrabajo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Datos nuevos de la asignación
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cuadrilla_id:
 *                 type: integer
 *                 example: 3
 *               trabajo_id:
 *                 type: integer
 *                 example: 2
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-25"
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
 * /cuadrilla-trabajo/{id}:
 *   delete:
 *     summary: Eliminar una asignación de trabajo
 *     tags: [CuadrillaTrabajo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 7
 *     responses:
 *       200:
 *         description: Asignación eliminada correctamente
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error al eliminar asignación
 */
