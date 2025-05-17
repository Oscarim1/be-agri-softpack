import express from 'express';
import {
  crearContratista,
  listarContratistas,
  obtenerContratista,
  actualizarContratista,
  eliminarContratista,
  exportarContratistasPDF 
} from '../controllers/contratistaController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import { tieneRol } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.use(verificarToken);

router.post('/', tieneRol('admin'), crearContratista);
router.get('/', listarContratistas);
router.get('/:id', obtenerContratista);
router.put('/:id', tieneRol('admin'), actualizarContratista);
router.delete('/:id', tieneRol('admin'), eliminarContratista);
router.get('/exportar/pdf', exportarContratistasPDF);

export default router;

// Swagger documentation for Contratista routes

/**
 * @swagger
 * tags:
 *   name: Contratistas
 *   description: Gestión de contratistas asociados a empresas
 */

/**
 * @swagger
 * /contratistas:
 *   post:
 *     summary: Crear un nuevo contratista
 *     tags: [Contratistas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Datos del contratista
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razon_social
 *               - empresa_id
 *               - usuario_id
 *             properties:
 *               razon_social:
 *                 type: string
 *                 example: "Servicios Agrícolas del Sur Ltda."
 *               empresa_id:
 *                 type: integer
 *                 example: 2
 *               usuario_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Contratista creado correctamente
 *       400:
 *         description: Faltan campos obligatorios
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /contratistas:
 *   get:
 *     summary: Listar todos los contratistas
 *     tags: [Contratistas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de contratistas
 *       500:
 *         description: Error al listar contratistas
 */

/**
 * @swagger
 * /contratistas/{id}:
 *   get:
 *     summary: Obtener contratista por ID
 *     tags: [Contratistas]
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
 *         description: Datos del contratista
 *       404:
 *         description: Contratista no encontrado
 *       500:
 *         description: Error al obtener contratista
 */

/**
 * @swagger
 * /contratistas/{id}:
 *   put:
 *     summary: Actualizar contratista por ID
 *     tags: [Contratistas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               razon_social:
 *                 type: string
 *                 example: "Nueva Razón Social S.A."
 *               empresa_id:
 *                 type: integer
 *                 example: 3
 *               usuario_id:
 *                 type: integer
 *                 example: 6
 *     responses:
 *       200:
 *         description: Contratista actualizado correctamente
 *       404:
 *         description: Contratista no encontrado
 *       500:
 *         description: Error al actualizar contratista
 */

/**
 * @swagger
 * /contratistas/{id}:
 *   delete:
 *     summary: Eliminar contratista por ID
 *     tags: [Contratistas]
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
 *         description: Contratista eliminado correctamente
 *       404:
 *         description: Contratista no encontrado
 *       500:
 *         description: Error al eliminar contratista
 */

/**
 * @swagger
 * /contratistas/exportar/pdf:
 *   get:
 *     summary: Exportar contratistas a PDF
 *     tags: [Contratistas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No hay contratistas registrados
 *       500:
 *         description: Error al generar PDF
 */

