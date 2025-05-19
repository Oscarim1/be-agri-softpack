import express from 'express';
import {
  asignarTrabajadorCuadrilla,
  listarAsignaciones,
  obtenerAsignacion,
  actualizarAsignacion,
  eliminarAsignacion
} from '../controllers/cuadrillaTrabajadorController.js';

import { verificarToken } from '../middlewares/authMiddleware.js';
import { tieneRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.post('/', tieneRol('admin', 'supervisor'), asignarTrabajadorCuadrilla);
router.get('/', listarAsignaciones);
router.get('/:id', obtenerAsignacion);
router.put('/:id', tieneRol('admin', 'supervisor'), actualizarAsignacion);
router.delete('/:id', tieneRol('admin'), eliminarAsignacion);

export default router;

/**
 * @swagger
 * tags:
 *   name: CuadrillaTrabajador
 *   description: Gestión de trabajadores asignados a cuadrillas
 */

/**
 * @swagger
 * /cuadrilla-trabajador:
 *   post:
 *     summary: Asignar un trabajador a una cuadrilla
 *     tags: [CuadrillaTrabajador]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos de asignación
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cuadrilla_id
 *               - pulsera_uuid
 *             properties:
 *               cuadrilla_id:
 *                 type: integer
 *                 example: 3
 *               pulsera_uuid:
 *                 type: string
 *                 example: "uuid-123456"
 *               cantidad_fruta:
 *                 type: number
 *                 example: 150.5
 *     responses:
 *       201:
 *         description: Trabajador asignado correctamente
 *       400:
 *         description: Datos requeridos faltantes
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /cuadrilla-trabajador:
 *   get:
 *     summary: Listar todas las asignaciones de trabajadores
 *     tags: [CuadrillaTrabajador]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asignaciones
 *       500:
 *         description: Error al listar asignaciones
 */

/**
 * @swagger
 * /cuadrilla-trabajador/{id}:
 *   get:
 *     summary: Obtener una asignación por ID
 *     tags: [CuadrillaTrabajador]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Detalle de la asignación
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error al obtener asignación
 */

/**
 * @swagger
 * /cuadrilla-trabajador/{id}:
 *   put:
 *     summary: Actualizar una asignación existente
 *     tags: [CuadrillaTrabajador]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *     requestBody:
 *       description: Nuevos datos de la asignación
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cuadrilla_id:
 *                 type: integer
 *                 example: 4
 *               pulsera_uuid:
 *                 type: string
 *                 example: "uuid-actualizado"
 *               cantidad_fruta:
 *                 type: number
 *                 example: 120.75
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
 * /cuadrilla-trabajador/{id}:
 *   delete:
 *     summary: Eliminar una asignación de trabajador
 *     tags: [CuadrillaTrabajador]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Asignación eliminada correctamente
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error al eliminar asignación
 */
