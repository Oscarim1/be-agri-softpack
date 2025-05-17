import express from 'express';
import {
  crearTrabajador,
  listarTrabajadores,
  obtenerTrabajador,
  actualizarTrabajador,
  eliminarTrabajador,
  buscarPorPulsera 
} from '../controllers/trabajadorController.js';

import { verificarToken } from '../middlewares/authMiddleware.js';
import { tieneRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken); // Todas las rutas protegidas

// Crear trabajador (solo admin o supervisor)
router.post('/', tieneRol('admin', 'supervisor'), crearTrabajador);

// Listar todos
router.get('/', listarTrabajadores);

// Obtener uno por ID
router.get('/:id', obtenerTrabajador);

// Actualizar (solo admin o supervisor)
router.put('/:id', tieneRol('admin', 'supervisor'), actualizarTrabajador);

// Eliminar (solo admin)
router.delete('/:id', tieneRol('admin'), eliminarTrabajador);

router.get('/pulsera/:uuid', buscarPorPulsera);

export default router;

// Swagger documentation for Trabajador routes
/**
 * @swagger
 * tags:
 *   name: Trabajadores
 *   description: Administración de trabajadores del sistema
 */

/**
 * @swagger
 * /trabajadores:
 *   post:
 *     summary: Crear un nuevo trabajador
 *     tags: [Trabajadores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos del trabajador
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombres, direccion, contacto, rol, pulsera_uuid]
 *             properties:
 *               nombres:
 *                 type: string
 *                 example: "Juan Pérez"
 *               direccion:
 *                 type: string
 *                 example: "Av. Siempre Viva 742"
 *               contacto:
 *                 type: string
 *                 example: "+56912345678"
 *               rol:
 *                 type: string
 *                 example: "temporero"
 *               pulsera_uuid:
 *                 type: string
 *                 example: "uuid-abc-123"
 *     responses:
 *       201:
 *         description: Trabajador creado correctamente
 *       500:
 *         description: Error al crear trabajador
 */

/**
 * @swagger
 * /trabajadores:
 *   get:
 *     summary: Listar todos los trabajadores
 *     tags: [Trabajadores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de trabajadores
 *       500:
 *         description: Error al obtener trabajadores
 */

/**
 * @swagger
 * /trabajadores/{id}:
 *   get:
 *     summary: Obtener trabajador por ID
 *     tags: [Trabajadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Trabajador encontrado
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error al obtener trabajador
 */

/**
 * @swagger
 * /trabajadores/{id}:
 *   put:
 *     summary: Actualizar datos de un trabajador
 *     tags: [Trabajadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *     requestBody:
 *       description: Nuevos datos del trabajador
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombres:
 *                 type: string
 *               direccion:
 *                 type: string
 *               contacto:
 *                 type: string
 *               rol:
 *                 type: string
 *               pulsera_uuid:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trabajador actualizado correctamente
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error al actualizar
 */

/**
 * @swagger
 * /trabajadores/{id}:
 *   delete:
 *     summary: Eliminar un trabajador
 *     tags: [Trabajadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: Eliminado correctamente
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error al eliminar
 */

/**
 * @swagger
 * /trabajadores/pulsera/{uuid}:
 *   get:
 *     summary: Buscar trabajador por UUID de pulsera
 *     tags: [Trabajadores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: uuid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: "uuid-abc-123"
 *     responses:
 *       200:
 *         description: Trabajador encontrado
 *       403:
 *         description: Pulsera inactiva
 *       404:
 *         description: No encontrado
 *       500:
 *         description: Error al buscar por pulsera
 */
