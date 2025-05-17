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

//Swagger documentation for Proceso routes
/**
 * @swagger
 * tags:
 *   name: Procesos
 *   description: Registro y resumen de procesos por trabajadores
 */

/**
 * @swagger
 * /procesos:
 *   post:
 *     summary: Crear un nuevo proceso manualmente
 *     tags: [Procesos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_pulsera
 *               - cantidad_fruta
 *               - fecha
 *             properties:
 *               id_pulsera:
 *                 type: string
 *                 example: "uuid-pulsera-123"
 *               cantidad_fruta:
 *                 type: number
 *                 example: 100.5
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-05-21"
 *     responses:
 *       201:
 *         description: Proceso creado correctamente
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /procesos:
 *   get:
 *     summary: Listar todos los procesos
 *     tags: [Procesos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de procesos
 *       500:
 *         description: Error al listar
 */

/**
 * @swagger
 * /procesos/{id}:
 *   get:
 *     summary: Obtener un proceso por ID
 *     tags: [Procesos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Proceso encontrado
 *       404:
 *         description: Proceso no encontrado
 *       500:
 *         description: Error al obtener proceso
 */

/**
 * @swagger
 * /procesos/{id}:
 *   put:
 *     summary: Actualizar un proceso por ID
 *     tags: [Procesos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_pulsera:
 *                 type: string
 *               cantidad_fruta:
 *                 type: number
 *               fecha:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Proceso actualizado correctamente
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error
 */

/**
 * @swagger
 * /procesos/{id}:
 *   delete:
 *     summary: Eliminar un proceso
 *     tags: [Procesos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eliminado correctamente
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error
 */

/**
 * @swagger
 * /procesos/registrar-desde-pulsera:
 *   post:
 *     summary: Registrar proceso desde una pulsera activa
 *     tags: [Procesos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pulsera_uuid, cantidad_fruta]
 *             properties:
 *               pulsera_uuid:
 *                 type: string
 *                 example: "uuid-abc-123"
 *               cantidad_fruta:
 *                 type: number
 *                 example: 200.75
 *     responses:
 *       201:
 *         description: Proceso registrado correctamente
 *       400:
 *         description: Datos faltantes
 *       403:
 *         description: Pulsera inactiva
 *       404:
 *         description: Pulsera no asociada
 *       500:
 *         description: Error
 */

/**
 * @swagger
 * /procesos/resumen/{pulsera_uuid}:
 *   get:
 *     summary: Obtener resumen diario de procesos por pulsera
 *     tags: [Procesos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: pulsera_uuid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "uuid-abc-123"
 *       - name: fecha
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-05-21"
 *     responses:
 *       200:
 *         description: Resumen generado
 *       400:
 *         description: Fecha requerida
 *       404:
 *         description: Pulsera no asociada a trabajador
 *       500:
 *         description: Error
 */
